export interface Transaction {
  id: string;
  type: 'Expense' | 'Income' | 'Investment';
  amount: number;
  category: string;
  note: string;
  date: Date;
  receiptUrl?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon?: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  category: string;
  isRecurring?: boolean;
  frequency?: 'monthly' | 'annually' | 'weekly';
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  email?: string;
  joinedDate?: string;
  currency?: string;
  householdId?: string;
}

export interface RationItem {
  id: string;
  name: string;
  estimatedAmount: number;
  isPurchased: boolean;
}

export interface QuickActionState {
  id: string;
  label: string;
  visible: boolean;
}
