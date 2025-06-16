import { 
  users,
  transactions, 
  categories,
  type User,
  type InsertUser,
  type Transaction, 
  type InsertTransaction, 
  type Category, 
  type InsertCategory,
  type DashboardStats,
  type ChartData,
  type CategoryBreakdown
} from "@shared/schema";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transaction operations
  getTransactions(userId: number, limit?: number, offset?: number, category?: string): Promise<{ transactions: Transaction[], total: number }>;
  getTransactionById(id: number, userId: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction & { userId: number }): Promise<Transaction>;
  updateTransaction(id: number, userId: number, transaction: Partial<InsertTransaction>): Promise<Transaction>;
  deleteTransaction(id: number, userId: number): Promise<boolean>;
  
  // Category operations
  getCategories(userId: number): Promise<Category[]>;
  createCategory(category: InsertCategory & { userId: number }): Promise<Category>;
  
  // Dashboard stats
  getDashboardStats(userId: number): Promise<DashboardStats>;
  getChartData(userId: number, months: number): Promise<ChartData>;
  getCategoryBreakdown(userId: number, period: 'month' | 'quarter' | 'year'): Promise<CategoryBreakdown[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  private categories: Map<number, Category>;
  private currentUserId: number;
  private currentTransactionId: number;
  private currentCategoryId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.categories = new Map();
    this.currentUserId = 1;
    this.currentTransactionId = 1;
    this.currentCategoryId = 1;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      password: hashedPassword,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    
    // Initialize default categories for the new user
    await this.initializeDefaultCategories(id);
    
    return user;
  }

  private async initializeDefaultCategories(userId: number) {
    const defaultCategories: (InsertCategory & { userId: number })[] = [
      { name: "Food & Dining", type: "expense", color: "#f59e0b", userId },
      { name: "Transportation", type: "expense", color: "#3b82f6", userId },
      { name: "Shopping", type: "expense", color: "#8b5cf6", userId },
      { name: "Entertainment", type: "expense", color: "#ec4899", userId },
      { name: "Utilities", type: "expense", color: "#06b6d4", userId },
      { name: "Healthcare", type: "expense", color: "#64748b", userId },
      { name: "Salary", type: "income", color: "#10b981", userId },
      { name: "Freelance", type: "income", color: "#059669", userId },
      { name: "Investment", type: "income", color: "#047857", userId },
    ];

    for (const cat of defaultCategories) {
      await this.createCategory(cat);
    }
  }

  async getTransactions(userId: number, limit = 50, offset = 0, category?: string): Promise<{ transactions: Transaction[], total: number }> {
    let transactionList = Array.from(this.transactions.values()).filter(t => t.userId === userId);
    
    if (category && category !== 'all') {
      transactionList = transactionList.filter(t => t.category === category);
    }
    
    // Sort by date descending (newest first)
    transactionList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const total = transactionList.length;
    const paginatedTransactions = transactionList.slice(offset, offset + limit);
    
    return { transactions: paginatedTransactions, total };
  }

  async getTransactionById(id: number, userId: number): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    return transaction && transaction.userId === userId ? transaction : undefined;
  }

  async createTransaction(insertTransaction: InsertTransaction & { userId: number }): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      amount: insertTransaction.amount.toString(),
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, userId: number, updateData: Partial<InsertTransaction>): Promise<Transaction> {
    const existing = this.transactions.get(id);
    if (!existing || existing.userId !== userId) {
      throw new Error('Transaction not found');
    }
    
    const updated: Transaction = { 
      ...existing, 
      ...updateData,
      amount: updateData.amount ? updateData.amount.toString() : existing.amount
    };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: number, userId: number): Promise<boolean> {
    const existing = this.transactions.get(id);
    if (!existing || existing.userId !== userId) {
      return false;
    }
    return this.transactions.delete(id);
  }

  async getCategories(userId: number): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(c => c.userId === userId);
  }

  async createCategory(insertCategory: InsertCategory & { userId: number }): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async getDashboardStats(userId: number): Promise<DashboardStats> {
    const allTransactions = Array.from(this.transactions.values()).filter(t => t.userId === userId);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Current month transactions
    const currentMonthTransactions = allTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });
    
    // Previous month transactions
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthTransactions = allTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === prevMonth && transactionDate.getFullYear() === prevYear;
    });
    
    const totalIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const prevIncome = prevMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const prevExpenses = prevMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const netBalance = totalIncome - totalExpenses;
    const prevNetBalance = prevIncome - prevExpenses;
    
    return {
      totalIncome,
      totalExpenses,
      netBalance,
      incomeChange: prevIncome ? ((totalIncome - prevIncome) / prevIncome) * 100 : 0,
      expensesChange: prevExpenses ? ((totalExpenses - prevExpenses) / prevExpenses) * 100 : 0,
      balanceChange: prevNetBalance ? ((netBalance - prevNetBalance) / Math.abs(prevNetBalance)) * 100 : 0,
    };
  }

  async getChartData(userId: number, months: number): Promise<ChartData> {
    const allTransactions = Array.from(this.transactions.values()).filter(t => t.userId === userId);
    const now = new Date();
    const labels: string[] = [];
    const income: number[] = [];
    const expenses: number[] = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short' });
      labels.push(monthLabel);
      
      const monthTransactions = allTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === date.getMonth() && 
               transactionDate.getFullYear() === date.getFullYear();
      });
      
      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const monthExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      income.push(monthIncome);
      expenses.push(monthExpenses);
    }
    
    return { labels, income, expenses };
  }

  async getCategoryBreakdown(userId: number, period: 'month' | 'quarter' | 'year'): Promise<CategoryBreakdown[]> {
    const allTransactions = Array.from(this.transactions.values()).filter(t => t.userId === userId);
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStart, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }
    
    const periodTransactions = allTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && t.type === 'expense';
    });
    
    const categoryTotals = new Map<string, number>();
    
    periodTransactions.forEach(t => {
      const current = categoryTotals.get(t.category) || 0;
      categoryTotals.set(t.category, current + parseFloat(t.amount));
    });
    
    const categoryColors = new Map<string, string>();
    Array.from(this.categories.values()).filter(c => c.userId === userId).forEach(cat => {
      categoryColors.set(cat.name, cat.color);
    });
    
    return Array.from(categoryTotals.entries()).map(([category, amount]) => ({
      category,
      amount,
      color: categoryColors.get(category) || '#64748b',
    }));
  }
}

export const storage = new MemStorage();
