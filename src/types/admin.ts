
export interface UserData {
  user_id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  status: string; // 'active' or 'inactive'
  isAdmin: boolean;
  isEditor?: boolean;
  isEmailVerified: boolean;
  created_at: string;
  trial_used: boolean;
  subscription_plan_name: string;
  subscription_status: string;
  monthly_credits: number;
  indexer_used: number;
  checker_used: number;
  total_used: number;
  held_credits: number;
  current_period_end?: string;
  total_credits?: number;
  subscription_credits?: number;
  extra_credits?: number;
}

export interface UserTotalCredits {
  user_id: string;
  total_credits: number;
  subscription_credits: number;
  extra_credits: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  paidSubscriptions: number;
  freeSubscriptions: number;
  newThisMonth: number;
}

export interface UsersResponse {
  users: UserData[];
  total: number;
  stats: UserStats;
}

export interface SubscriptionData {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  previousPlanId?: string;
  carriedForwardCredits: number;
  usedCredits?: number;
  heldCredits?: number;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    contactNumber?: string;
    createdAt: string;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    credits: number;
    isFreePlan: boolean;
  };
  previousPlan?: {
    id: string;
    name: string;
    price: number;
    credits: number;
  };
}

export interface SubscriptionStats {
  totalSubscriptions: string; // Format: "paid / free"
  active: number;
  expired: number;
  monthlyRevenue: number;
}

export interface SubscriptionHistory {
  subscriptions: SubscriptionData[];
  payments: Array<{
    id: string;
    amountPaid: number;
    currency: string;
    paymentDate: string;
    status: string;
    plan: {
      id: string;
      name: string;
      price: number;
    };
  }>;
  creditUsage: Array<{
    id: string;
    amount: number;
    createdAt: string;
    task?: {
      id: string;
      title?: string;
      status: string;
    };
  }>;
  totalUsage?: {
    usedCredits: number;
    heldCredits: number;
  };

}

export interface SubscriptionsResponse {
  subscriptions: SubscriptionData[];
  total: number;
  stats: SubscriptionStats;
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
