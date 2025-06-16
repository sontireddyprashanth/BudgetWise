import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authManager } from "@/lib/auth";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Wallet } from "lucide-react";

export default function Register() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: InsertUser) => {
    setIsLoading(true);
    try {
      await authManager.register(data.name, data.email, data.password);
      toast({
        title: "Success",
        description: "Account created successfully! Welcome to BudgetWise.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Wallet className="text-primary-500 h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">BudgetWise</h1>
          </div>
          <h2 className="text-xl text-gray-600">
            Create your account
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>
              Create your account to start managing your finances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...form.register("name")}
                  className="mt-1"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-danger-600 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...form.register("email")}
                  className="mt-1"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-danger-600 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  {...form.register("password")}
                  className="mt-1"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-danger-600 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}