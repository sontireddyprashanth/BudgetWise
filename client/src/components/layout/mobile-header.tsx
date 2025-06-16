import { Menu, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  toggleMobileMenu: () => void;
}

export default function MobileHeader({ toggleMobileMenu }: MobileHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 lg:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="text-gray-500 hover:text-gray-700"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <h1 className="text-lg font-semibold text-gray-900 flex items-center">
          <Wallet className="text-primary-500 mr-2 h-5 w-5" />
          BudgetWise
        </h1>
        
        <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
          <span className="text-white text-sm font-medium">JD</span>
        </div>
      </div>
    </div>
  );
}
