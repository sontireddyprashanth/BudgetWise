import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authManager } from "@/lib/auth";
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";
import Categories from "@/pages/categories";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, navigate] = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!authManager.isAuthenticated()) {
      navigate("/login");
    } else {
      setIsChecking(false);
    }
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <Component />;
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const [, navigate] = useLocation();

  useEffect(() => {
    if (authManager.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login">
        <PublicRoute component={Login} />
      </Route>
      <Route path="/register">
        <PublicRoute component={Register} />
      </Route>
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/transactions">
        <ProtectedRoute component={Transactions} />
      </Route>
      <Route path="/categories">
        <ProtectedRoute component={Categories} />
      </Route>
      <Route path="/reports">
        <ProtectedRoute component={Reports} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Check if user is authenticated on app load
    if (!authManager.isAuthenticated() && !window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
