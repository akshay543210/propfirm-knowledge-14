export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      account_sizes: {
        Row: {
          buying_link: string | null
          created_at: string | null
          discounted_price: number
          firm_id: string | null
          id: string
          original_price: number
          promo_code: string | null
          size: string
          updated_at: string | null
        }
        Insert: {
          buying_link?: string | null
          created_at?: string | null
          discounted_price: number
          firm_id?: string | null
          id?: string
          original_price: number
          promo_code?: string | null
          size: string
          updated_at?: string | null
        }
        Update: {
          buying_link?: string | null
          created_at?: string | null
          discounted_price?: number
          firm_id?: string | null
          id?: string
          original_price?: number
          promo_code?: string | null
          size?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_sizes_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "prop_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_prop: {
        Row: {
          created_at: string | null
          id: string
          propfirm_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          propfirm_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          propfirm_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_prop_propfirm_id_fkey"
            columns: ["propfirm_id"]
            isOneToOne: true
            referencedRelation: "prop_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      drama_reports: {
        Row: {
          admin_approved_by: string | null
          created_at: string | null
          date_reported: string | null
          description: string
          drama_type: string
          firm_name: string
          id: string
          severity: string
          source_links: string[] | null
          status: string | null
          submitted_by: string | null
          updated_at: string | null
        }
        Insert: {
          admin_approved_by?: string | null
          created_at?: string | null
          date_reported?: string | null
          description: string
          drama_type: string
          firm_name: string
          id?: string
          severity: string
          source_links?: string[] | null
          status?: string | null
          submitted_by?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_approved_by?: string | null
          created_at?: string | null
          date_reported?: string | null
          description?: string
          drama_type?: string
          firm_name?: string
          id?: string
          severity?: string
          source_links?: string[] | null
          status?: string | null
          submitted_by?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      explore_firms: {
        Row: {
          created_at: string | null
          firm_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          firm_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          firm_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "explore_firms_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "prop_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      firms: {
        Row: {
          approvals_count: number | null
          created_at: string | null
          denials_count: number | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          website: string | null
        }
        Insert: {
          approvals_count?: number | null
          created_at?: string | null
          denials_count?: number | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          website?: string | null
        }
        Update: {
          approvals_count?: number | null
          created_at?: string | null
          denials_count?: number | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      payout_cases: {
        Row: {
          amount: number | null
          created_at: string | null
          date: string | null
          firm_id: string | null
          id: string
          notes: string | null
          screenshot_url: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          date?: string | null
          firm_id?: string | null
          id?: string
          notes?: string | null
          screenshot_url?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          date?: string | null
          firm_id?: string | null
          id?: string
          notes?: string | null
          screenshot_url?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payout_cases_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      prop_firms: {
        Row: {
          affiliate_url: string | null
          brand: string | null
          category_id: string | null
          cons: string[] | null
          coupon_code: string | null
          created_at: string | null
          description: string | null
          evaluation_model: string | null
          features: string[] | null
          funding_amount: string
          id: string
          logo_url: string | null
          max_funding: string | null
          name: string
          original_price: number
          payout_rate: number
          platform: string | null
          price: number
          profit_split: number
          pros: string[] | null
          regulation: string | null
          review_score: number | null
          show_on_homepage: boolean | null
          slug: string
          starting_fee: number | null
          table_coupon_code: string | null
          table_evaluation_rules: string | null
          table_fee: number | null
          table_payout_rate: number | null
          table_platform: string | null
          table_price: number | null
          table_profit_split: number | null
          table_trust_rating: number | null
          trust_rating: number | null
          updated_at: string | null
          user_review_count: number | null
        }
        Insert: {
          affiliate_url?: string | null
          brand?: string | null
          category_id?: string | null
          cons?: string[] | null
          coupon_code?: string | null
          created_at?: string | null
          description?: string | null
          evaluation_model?: string | null
          features?: string[] | null
          funding_amount: string
          id?: string
          logo_url?: string | null
          max_funding?: string | null
          name: string
          original_price: number
          payout_rate: number
          platform?: string | null
          price: number
          profit_split: number
          pros?: string[] | null
          regulation?: string | null
          review_score?: number | null
          show_on_homepage?: boolean | null
          slug: string
          starting_fee?: number | null
          table_coupon_code?: string | null
          table_evaluation_rules?: string | null
          table_fee?: number | null
          table_payout_rate?: number | null
          table_platform?: string | null
          table_price?: number | null
          table_profit_split?: number | null
          table_trust_rating?: number | null
          trust_rating?: number | null
          updated_at?: string | null
          user_review_count?: number | null
        }
        Update: {
          affiliate_url?: string | null
          brand?: string | null
          category_id?: string | null
          cons?: string[] | null
          coupon_code?: string | null
          created_at?: string | null
          description?: string | null
          evaluation_model?: string | null
          features?: string[] | null
          funding_amount?: string
          id?: string
          logo_url?: string | null
          max_funding?: string | null
          name?: string
          original_price?: number
          payout_rate?: number
          platform?: string | null
          price?: number
          profit_split?: number
          pros?: string[] | null
          regulation?: string | null
          review_score?: number | null
          show_on_homepage?: boolean | null
          slug?: string
          starting_fee?: number | null
          table_coupon_code?: string | null
          table_evaluation_rules?: string | null
          table_fee?: number | null
          table_payout_rate?: number | null
          table_platform?: string | null
          table_price?: number | null
          table_profit_split?: number | null
          table_trust_rating?: number | null
          trust_rating?: number | null
          updated_at?: string | null
          user_review_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prop_firms_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          content: string
          created_at: string | null
          firm_id: string | null
          helpful_count: number | null
          id: string
          images: string[] | null
          is_verified: boolean | null
          rating: number
          reviewer_name: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          firm_id?: string | null
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          rating: number
          reviewer_name?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          firm_id?: string | null
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          rating?: number
          reviewer_name?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "prop_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      section_memberships: {
        Row: {
          created_at: string | null
          firm_id: string | null
          id: string
          rank: number | null
          section_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          firm_id?: string | null
          id?: string
          rank?: number | null
          section_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          firm_id?: string | null
          id?: string
          rank?: number | null
          section_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "section_memberships_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "prop_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      table_review_firms: {
        Row: {
          created_at: string | null
          firm_id: string | null
          id: string
          is_approved: boolean | null
          sort_priority: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          firm_id?: string | null
          id?: string
          is_approved?: boolean | null
          sort_priority?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          firm_id?: string | null
          id?: string
          is_approved?: boolean | null
          sort_priority?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_review_firms_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: true
            referencedRelation: "prop_firms"
            referencedColumns: ["id"]
          },
        ]
      }
      top5_prop: {
        Row: {
          created_at: string | null
          id: string
          propfirm_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          propfirm_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          propfirm_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "top5_prop_propfirm_id_fkey"
            columns: ["propfirm_id"]
            isOneToOne: true
            referencedRelation: "prop_firms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_firm_stats: {
        Args: never
        Returns: {
          approval_rate: number
          approvals_count: number
          denials_count: number
          id: string
          logo_url: string
          name: string
        }[]
      }
      get_recent_cases: {
        Args: { limit_count?: number }
        Returns: {
          amount: number
          created_at: string
          date: string
          firm_logo_url: string
          firm_name: string
          id: string
          notes: string
          screenshot_url: string
          status: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
