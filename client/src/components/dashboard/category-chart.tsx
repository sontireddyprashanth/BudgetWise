import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CategoryBreakdown } from "@shared/schema";

export default function CategoryChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  const { data: categoryData, isLoading } = useQuery<CategoryBreakdown[]>({
    queryKey: ['/api/dashboard/category-breakdown', { period }],
  });

  useEffect(() => {
    if (!categoryData || !chartRef.current || categoryData.length === 0) return;

    // Dynamically import Chart.js
    import('chart.js/auto').then((ChartJS) => {
      const Chart = ChartJS.default;
      const ctx = chartRef.current!.getContext('2d')!;

      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categoryData.map(item => item.category),
          datasets: [
            {
              data: categoryData.map(item => item.amount),
              backgroundColor: categoryData.map(item => item.color),
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = '$' + Number(context.parsed).toLocaleString();
                  return `${label}: ${value}`;
                }
              }
            }
          },
        },
      });
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [categoryData]);

  return (
    <Card className="p-3 sm:p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Expense Categories</h3>
        <Select value={period} onValueChange={(value: 'month' | 'quarter' | 'year') => setPeriod(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-64">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : categoryData && categoryData.length > 0 ? (
          <canvas ref={chartRef}></canvas>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No expense data available for this period
          </div>
        )}
      </div>
    </Card>
  );
}
