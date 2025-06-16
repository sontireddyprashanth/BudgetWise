import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // 'income' or 'expense'
  category: text("category").notNull(),
  date: text("date").notNull(), // ISO date string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  type: text("type").notNull(), // 'income' or 'expense'
  color: text("color").notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  description: true,
  amount: true,
  type: true,
  category: true,
  date: true,
}).extend({
  amount: z.coerce.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"], { required_error: "Type is required" }),
  date: z.string().min(1, "Date is required"),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  type: true,
  color: true,
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

// Additional types for dashboard stats
export type DashboardStats = {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  incomeChange: number;
  expensesChange: number;
  balanceChange: number;
};

export type ChartData = {
  labels: string[];
  income: number[];
  expenses: number[];
};

export type CategoryBreakdown = {
  category: string;
  amount: number;
  color: string;
};
