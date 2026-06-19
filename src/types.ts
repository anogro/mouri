export interface BudgetRules {
  totalAmount: number;
  giveAmount: number;
  spendAmount: number;
  investAmount: number;
  extraAmount: number; // 4th piggy bank (Premium)
  bonusType: 'SIMPLE' | 'COMPOUND';
  bonusRate: number; // Percentage, e.g., 50 for 50%, 5 for 5%
  customAccounts?: {
    give: { name: string; emoji: string };
    spend: { name: string; emoji: string };
    invest: { name: string; emoji: string };
    extra: { name: string; emoji: string };
  };
}

export type TransactionType = 'GIVE' | 'SPEND' | 'INVEST' | 'EARN' | 'BONUS' | 'WISHLIST';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string;
  accountId?: 'GIVE' | 'SPEND' | 'INVEST' | 'EXTRA' | 'WISHLIST';
}

export interface PendingTransaction {
  id: string;
  txInfo: Omit<Transaction, 'id' | 'date'>;
  executeAt: number;
}

export interface ChildProfile {
  id: string; // UUID for DB
  name: string;
  rules: BudgetRules;
  initialBalances: { give: number; spend: number; invest: number; extra: number };
  transactions: Transaction[];
  pendingTransactions: PendingTransaction[];
  premiumMode: boolean;
  wishlistTarget: number;
}

export interface ParentProfile {
  parentName: string;
  email: string;
  pin: string; // 4-digit PIN
  membershipTier: 'BASIC' | 'PREMIUM';
  children: ChildProfile[];
}

export interface AppState {
  parent: ParentProfile | null;
  currentChildId: string | null;
  isAuthenticated: boolean; // True if parent is logged in to change settings or during onboarding
}
