import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Transaction, InsertTransaction } from "@shared/schema";

interface UseTransactionsParams {
  limit?: number;
  offset?: number;
  category?: string;
}

interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
}

export function useTransactions(params: UseTransactionsParams) {
  const { limit = 50, offset = 0, category } = params;

  // Construct query params
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  
  if (category) {
    queryParams.append('category', category);
  }

  // Fetch transactions
  const {
    data: transactionsData,
    isLoading,
    error,
  } = useQuery<TransactionsResponse>({
    queryKey: ['/api/transactions', { limit, offset, category }],
    queryFn: async () => {
      const response = await fetch(`/api/transactions?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      return response.json();
    },
  });

  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (transaction: InsertTransaction) => {
      const response = await apiRequest('POST', '/api/transactions', transaction);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch transactions
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/chart-data'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/category-breakdown'] });
    },
  });

  // Update transaction mutation
  const updateTransaction = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertTransaction> }) => {
      const response = await apiRequest('PUT', `/api/transactions/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/chart-data'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/category-breakdown'] });
    },
  });

  // Delete transaction mutation
  const deleteTransaction = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/chart-data'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/category-breakdown'] });
    },
  });

  // Export CSV mutation
  const exportCSV = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/transactions/export/csv');
      if (!response.ok) {
        throw new Error('Failed to export CSV');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });

  return {
    transactions: transactionsData?.transactions,
    totalTransactions: transactionsData?.total,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    exportCSV,
  };
}
