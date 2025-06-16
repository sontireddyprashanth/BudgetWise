import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ChartData } from "@shared/schema";

export default function IncomeExpensesChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const [period, setPeriod] = useState("6months");

  const months = period === "6months" ? 6 : period === "12months" ? 12 : 12;

  const { data: chartData, isLoading } = useQuery<ChartData>({
    queryKey: ['/api/dashboard/chart-data', { months }],
  });

  useEffect(() => {
    if (!chartData || !chartRef.current) return;

    // Dynamically import Chart.js
    import('chart.js/auto').then((ChartJS) => {
      const Chart = ChartJS.default;
      const ctx = chartRef.current!.getContext('2d')!;

      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'Income',
              data: chartData.income,
              borderColor: 'hsl(151, 83%, 47%)',
              backgroundColor: 'hsla(151, 83%, 47%, 0.1)',
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Expenses',
              data: chartData.expenses,
              borderColor: 'hsl(0, 84%, 60%)',
              backgroundColor: 'hsla(0, 84%, 60%, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + Number(value).toLocaleString();
                },
              },
            },
          },
        },
      });
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Income vs Expenses</h3>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="12months">Last 12 Months</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-64">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <canvas ref={chartRef}></canvas>
        )}
      </div>
    </Card>
  );
}
