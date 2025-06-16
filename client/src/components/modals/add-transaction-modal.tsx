import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTransactions } from "@/hooks/use-transactions";
import { insertTransactionSchema, type InsertTransaction } from "@shared/schema";
import { X } from "lucide-react";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { toast } = useToast();
  const { createTransaction } = useTransactions({});
  
  const form = useForm<InsertTransaction>({
    resolver: zodResolver(insertTransactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: undefined,
      category: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: InsertTransaction) => {
    try {
      await createTransaction.mutateAsync(data);
      toast({
        title: "Success",
        description: "Transaction added successfully!",
      });
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const watchedType = form.watch("type");

  const getCategories = () => {
    if (watchedType === "income") {
      return [
        { value: "Salary", label: "Salary" },
        { value: "Freelance", label: "Freelance" },
        { value: "Investment", label: "Investment" },
      ];
    } else if (watchedType === "expense") {
      return [
        { value: "Food & Dining", label: "Food & Dining" },
        { value: "Transportation", label: "Transportation" },
        { value: "Shopping", label: "Shopping" },
        { value: "Entertainment", label: "Entertainment" },
        { value: "Utilities", label: "Utilities" },
        { value: "Healthcare", label: "Healthcare" },
      ];
    }
    return [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add New Transaction</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter transaction description"
              {...form.register("description")}
              className="mt-1"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-danger-600 mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...form.register("amount", { valueAsNumber: true })}
              className="mt-1"
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-danger-600 mt-1">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={form.watch("type") || ""}
              onValueChange={(value: "income" | "expense") => {
                form.setValue("type", value);
                form.setValue("category", ""); // Reset category when type changes
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-sm text-danger-600 mt-1">
                {form.formState.errors.type.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={form.watch("category") || ""}
              onValueChange={(value) => form.setValue("category", value)}
              disabled={!watchedType}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {getCategories().map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-sm text-danger-600 mt-1">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...form.register("date")}
              className="mt-1"
            />
            {form.formState.errors.date && (
              <p className="text-sm text-danger-600 mt-1">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTransaction.isPending}
              className="bg-primary-600 hover:bg-primary-700"
            >
              {createTransaction.isPending ? "Adding..." : "Add Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
