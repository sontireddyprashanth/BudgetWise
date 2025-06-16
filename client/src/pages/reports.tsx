import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import StatsCards from "@/components/dashboard/stats-cards";
import IncomeExpensesChart from "@/components/dashboard/income-expenses-chart";
import CategoryChart from "@/components/dashboard/category-chart";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, PieChart } from "lucide-react";

export default function Reports() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState("month");

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className="lg:pl-64 flex flex-col flex-1">
        <MobileHeader 
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />
        
        <main className="flex-1 pb-8">
          {/* Page Header */}
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    Financial Reports
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Analyze your financial data with detailed insights and trends
                  </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                  <Select value={reportPeriod} onValueChange={setReportPeriod}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline"
                    className="bg-white hover:bg-gray-50"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Overview Cards */}
            <StatsCards />
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <IncomeExpensesChart />
              <CategoryChart />
            </div>

            {/* Additional Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="text-success-500 h-6 w-6 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Income Trends</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Monthly Income</span>
                    <span className="text-sm font-medium text-gray-900">$3,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Highest Month</span>
                    <span className="text-sm font-medium text-success-600">$4,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Growth Rate</span>
                    <span className="text-sm font-medium text-success-600">+12.3%</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <TrendingDown className="text-danger-500 h-6 w-6 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Expense Analysis</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Monthly Expenses</span>
                    <span className="text-sm font-medium text-gray-900">$2,150</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Largest Category</span>
                    <span className="text-sm font-medium text-gray-900">Food & Dining</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">vs Last Month</span>
                    <span className="text-sm font-medium text-danger-600">+5.2%</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <PieChart className="text-primary-500 h-6 w-6 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Savings Rate</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Savings Rate</span>
                    <span className="text-sm font-medium text-gray-900">34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Target Rate</span>
                    <span className="text-sm font-medium text-gray-600">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Performance</span>
                    <span className="text-sm font-medium text-success-600">Above Target</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Monthly Breakdown */}
            <Card className="mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Monthly Breakdown</h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Income
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expenses
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Net Savings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Savings Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { month: "December 2024", income: 3200, expenses: 2100, savings: 1100, rate: 34.4 },
                        { month: "November 2024", income: 3150, expenses: 2050, savings: 1100, rate: 34.9 },
                        { month: "October 2024", income: 3100, expenses: 2200, savings: 900, rate: 29.0 },
                      ].map((row, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {row.month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-success-600">
                            ${row.income.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-danger-600">
                            ${row.expenses.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${row.savings.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-medium ${row.rate >= 30 ? 'text-success-600' : 'text-warning-600'}`}>
                              {row.rate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}