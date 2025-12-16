export type ItemType = 'INCOME' | 'EXPENSE';

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
