import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import StatsCards from "@/components/dashboard/stats-cards";
import IncomeExpensesChart from "@/components/dashboard/income-expenses-chart";
import CategoryChart from "@/components/dashboard/category-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import AddTransactionModal from "@/components/modals/add-transaction-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className="lg:ml-64 flex flex-col flex-1">
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
                    Dashboard
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Welcome back! Here's your financial overview.
                  </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                  <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <StatsCards />
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <IncomeExpensesChart />
              <CategoryChart />
            </div>
            
            <RecentTransactions />
          </div>
        </main>
      </div>

      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
