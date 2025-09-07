export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      credit_usage_reports: {
        Row: {
          checker_credits_used: number | null
          created_at: string
          id: string
          indexer_credits_used: number | null
          month_year: string
          total_available_credits: number | null
          total_credits_used: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          checker_credits_used?: number | null
          created_at?: string
          id?: string
          indexer_credits_used?: number | null
          month_year: string
          total_available_credits?: number | null
          total_credits_used?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          checker_credits_used?: number | null
          created_at?: string
          id?: string
          indexer_credits_used?: number | null
          month_year?: string
          total_available_credits?: number | null
          total_credits_used?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      monthly_usage: {
        Row: {
          checker_credits_used: number | null
          created_at: string
          id: string
          indexer_credits_used: number | null
          month_year: string
          subscription_id: string | null
          updated_at: string
          urls_used: number | null
          user_id: string
        }
        Insert: {
          checker_credits_used?: number | null
          created_at?: string
          id?: string
          indexer_credits_used?: number | null
          month_year: string
          subscription_id?: string | null
          updated_at?: string
          urls_used?: number | null
          user_id: string
        }
        Update: {
          checker_credits_used?: number | null
          created_at?: string
          id?: string
          indexer_credits_used?: number | null
          month_year?: string
          subscription_id?: string | null
          updated_at?: string
          urls_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_usage_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          checker_credits: number
          created_at: string
          currency: string | null
          id: string
          indexer_credits: number
          plan_name: string
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          checker_credits?: number
          created_at?: string
          currency?: string | null
          id?: string
          indexer_credits?: number
          plan_name: string
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          checker_credits?: number
          created_at?: string
          currency?: string | null
          id?: string
          indexer_credits?: number
          plan_name?: string
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          features: Json
          id: string
          is_popular: boolean | null
          monthly_credits: number
          name: string
          price_monthly: number
          stripe_price_id: string | null
          updated_at: string
          urls_per_month: number
        }
        Insert: {
          created_at?: string
          features?: Json
          id?: string
          is_popular?: boolean | null
          monthly_credits?: number
          name: string
          price_monthly: number
          stripe_price_id?: string | null
          updated_at?: string
          urls_per_month: number
        }
        Update: {
          created_at?: string
          features?: Json
          id?: string
          is_popular?: boolean | null
          monthly_credits?: number
          name?: string
          price_monthly?: number
          stripe_price_id?: string | null
          updated_at?: string
          urls_per_month?: number
        }
        Relationships: []
      }
      task_links: {
        Row: {
          created_at: string | null
          error_code: string | null
          id: string
          is_indexed: boolean | null
          task_id: string
          title: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          error_code?: string | null
          id?: string
          is_indexed?: boolean | null
          task_id: string
          title?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          error_code?: string | null
          id?: string
          is_indexed?: boolean | null
          task_id?: string
          title?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_links_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          credits_used: number | null
          id: string
          indexed_count: number | null
          link_count: number | null
          processed_count: number | null
          report_last_checked: string | null
          report_status: string | null
          speedy_task_id: string
          status: string | null
          title: string
          type: string
          user_id: string
          vip_used: boolean | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          credits_used?: number | null
          id?: string
          indexed_count?: number | null
          link_count?: number | null
          processed_count?: number | null
          report_last_checked?: string | null
          report_status?: string | null
          speedy_task_id: string
          status?: string | null
          title: string
          type: string
          user_id: string
          vip_used?: boolean | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          credits_used?: number | null
          id?: string
          indexed_count?: number | null
          link_count?: number | null
          processed_count?: number | null
          report_last_checked?: string | null
          report_status?: string | null
          speedy_task_id?: string
          status?: string | null
          title?: string
          type?: string
          user_id?: string
          vip_used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_extra_credits: {
        Row: {
          admin_user_id: string
          created_at: string | null
          credits: number
          expires_at: string | null
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          credits?: number
          expires_at?: string | null
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          credits?: number
          expires_at?: string | null
          id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_extra_credits_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_extra_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          urls_used_this_month: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          urls_used_this_month?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          urls_used_this_month?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: string | null
          trial_used: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          role?: string | null
          trial_used?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: string | null
          trial_used?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_trial: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      add_user_extra_credits: {
        Args: {
          target_user_id: string
          extra_credits?: number
          credit_reason?: string
          expires_days?: number
        }
        Returns: boolean
      }
      can_activate_trial: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      get_all_users_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          email: string
          created_at: string
          trial_used: boolean
          subscription_plan_name: string
          subscription_status: string
          monthly_credits: number
          indexer_used: number
          checker_used: number
          total_used: number
        }[]
      }
      get_credit_usage_report: {
        Args: { user_uuid: string }
        Returns: {
          month_year: string
          indexer_used: number
          checker_used: number
          total_used: number
          total_available: number
          remaining_credits: number
        }[]
      }
      get_current_month_usage: {
        Args: { user_uuid: string }
        Returns: number
      }
      get_detailed_credit_usage: {
        Args: { user_uuid: string }
        Returns: {
          indexer_used: number
          checker_used: number
          total_used: number
        }[]
      }
      get_user_total_credits: {
        Args: { user_uuid: string }
        Returns: {
          total_credits: number
          subscription_credits: number
          extra_credits: number
        }[]
      }
      increment_monthly_usage: {
        Args:
          | { user_uuid: string; urls_count?: number }
          | { user_uuid: string; urls_count?: number; credit_type?: string }
        Returns: number
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      process_successful_payment: {
        Args: { order_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
