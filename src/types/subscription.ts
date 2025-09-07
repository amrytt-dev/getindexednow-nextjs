
export interface CustomUserSubscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_end: string;
  current_period_start: string;
  subscription_plans: {
    name: string;
    monthly_credits?: number;
    price_monthly: number;
    features: string[];
  };
}
