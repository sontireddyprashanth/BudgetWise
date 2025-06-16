import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  ArrowLeftRight, 
  Tags, 
  PieChart, 
  Settings, 
  Wallet,
  LogOut 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authManager } from "@/lib/auth";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3, current: true },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight, current: false },
  { name: 'Categories', href: '/categories', icon: Tags, current: false },
  { name: 'Reports', href: '/reports', icon: PieChart, current: false },
  { name: 'Settings', href: '/settings', icon: Settings, current: false },
];

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    authManager.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <>
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            <Wallet className="text-primary-500 mr-2 h-6 w-6" />
            BudgetWise
          </h1>
        </div>
        
        <nav className="mt-8 flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon 
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-primary-500' : 'text-gray-400'
                  }`} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
