import { useQuery } from "@tanstack/react-query";
import { getWithAuth } from "@/utils/fetchWithAuth";

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  includesInPlan: string;
  isActive: boolean;
  isFreePlan: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: string;
}

interface FAQsResponse {
  faqs: Record<string, FAQ[]>;
  categories: string[];
}

interface CurrentSubscription {
  id: string;
  planId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  plan: {
    id: string;
    name: string;
    price: number;
    credits: number;
    includesInPlan: string;
  };
}

// Fetch all active plans
export const usePlans = () => {
  return useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${backendBaseUrl}/api/plans`);
      if (!res.ok) {
        throw new Error("Failed to fetch plans");
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch FAQs organized by category
export const useFAQs = () => {
  return useQuery<FAQsResponse>({
    queryKey: ["faqs"],
    queryFn: async () => {
      const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${backendBaseUrl}/api/faqs`);
      if (!res.ok) {
        throw new Error("Failed to fetch FAQs");
      }
      const data = await res.json();
      return data.result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch current user subscription (if logged in)
export const useCurrentSubscription = () => {
  return useQuery<{
    hasActiveSubscription: boolean;
    subscription: CurrentSubscription | null;
  }>({
    queryKey: ["current-subscription"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return { hasActiveSubscription: false, subscription: null };
      }

      return await getWithAuth<{
        hasActiveSubscription: boolean;
        subscription: CurrentSubscription | null;
      }>("/user/subscription");
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!localStorage.getItem("token"),
  });
};
