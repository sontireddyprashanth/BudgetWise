import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import type { DashboardStats } from "@shared/schema";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-5 animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-5 text-center text-gray-500">
          No stats available
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Income */}
      <Card className="overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success-100 rounded-md flex items-center justify-center">
                <TrendingUp className="text-success-600 h-5 w-5" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Income
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(stats.totalIncome)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className={`font-medium ${
              stats.incomeChange >= 0 ? 'text-success-600' : 'text-danger-600'
            }`}>
              {formatPercentage(stats.incomeChange)}
            </span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </Card>

      {/* Total Expenses */}
      <Card className="overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-danger-100 rounded-md flex items-center justify-center">
                <TrendingDown className="text-danger-600 h-5 w-5" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Expenses
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(stats.totalExpenses)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className={`font-medium ${
              stats.expensesChange >= 0 ? 'text-danger-600' : 'text-success-600'
            }`}>
              {formatPercentage(Math.abs(stats.expensesChange))}
            </span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </Card>

      {/* Net Balance */}
      <Card className="overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-md flex items-center justify-center">
                <Wallet className="text-primary-600 h-5 w-5" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Net Balance
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(stats.netBalance)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className={`font-medium ${
              stats.balanceChange >= 0 ? 'text-success-600' : 'text-danger-600'
            }`}>
              {formatPercentage(stats.balanceChange)}
            </span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
