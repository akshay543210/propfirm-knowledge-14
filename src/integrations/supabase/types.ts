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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      account_sizes: {
        Row: {
          buying_link: string | null
          created_at: string
          discounted_price: number
          firm_id: string
          id: string
          original_price: number
          promo_code: string | null
          size: string
          updated_at: string
        }
        Insert: {
          buying_link?: string | null
          created_at?: string
          discounted_price: number
          firm_id: string
          id?: string
          original_price: number
          promo_code?: string | null
          size: string
          updated_at?: string
        }
        Update: {
          buying_link?: string | null
          created_at?: string
          discounted_price?: number
          firm_id?: string
          id?: string
          original_price?: number
          promo_code?: string | null
          size?: string
          updated_at?: string
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
          amount_cents: number
          created_at: string
          currency: string
          description: string | null
          id: number
          project_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: never
          project_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: never
          project_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          id?: string
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
          created_at: string
          date_reported: string
          description: string
          drama_type: Database["public"]["Enums"]["drama_type"]
          firm_name: string
          id: string
          severity: Database["public"]["Enums"]["drama_severity"]
          source_links: string[] | null
          status: Database["public"]["Enums"]["drama_status"]
          submitted_by: string | null
          updated_at: string
        }
        Insert: {
          admin_approved_by?: string | null
          created_at?: string
          date_reported?: string
          description: string
          drama_type: Database["public"]["Enums"]["drama_type"]
          firm_name: string
          id?: string
          severity: Database["public"]["Enums"]["drama_severity"]
          source_links?: string[] | null
          status?: Database["public"]["Enums"]["drama_status"]
          submitted_by?: string | null
          updated_at?: string
        }
        Update: {
          admin_approved_by?: string | null
          created_at?: string
          date_reported?: string
          description?: string
          drama_type?: Database["public"]["Enums"]["drama_type"]
          firm_name?: string
          id?: string
          severity?: Database["public"]["Enums"]["drama_severity"]
          source_links?: string[] | null
          status?: Database["public"]["Enums"]["drama_status"]
          submitted_by?: string | null
          updated_at?: string
        }
        Relationships: []
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
          sections: Json | null
          show_on_homepage: boolean
          slug: string
          starting_fee: number | null
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
          sections?: Json | null
          show_on_homepage?: boolean
          slug: string
          starting_fee?: number | null
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
          sections?: Json | null
          show_on_homepage?: boolean
          slug?: string
          starting_fee?: number | null
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
      propfirms: {
        Row: {
          category: string
          cost: number
          created_at: string | null
          id: string
          name: string
          payout: number
          platform: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          cost?: number
          created_at?: string | null
          id?: string
          name: string
          payout?: number
          platform?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          cost?: number
          created_at?: string | null
          id?: string
          name?: string
          payout?: number
          platform?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      section_firms: {
        Row: {
          created_at: string | null
          id: string
          order: number | null
          prop_firm_id: string | null
          section_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order?: number | null
          prop_firm_id?: string | null
          section_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order?: number | null
          prop_firm_id?: string | null
          section_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "section_firms_prop_firm_id_fkey"
            columns: ["prop_firm_id"]
            isOneToOne: false
            referencedRelation: "prop_firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_firms_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      section_memberships: {
        Row: {
          created_at: string
          firm_id: string
          id: string
          rank: number | null
          section_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          firm_id: string
          id?: string
          rank?: number | null
          section_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          firm_id?: string
          id?: string
          rank?: number | null
          section_type?: string
          updated_at?: string
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
      sections: {
        Row: {
          created_at: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: number
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_admin_access: { Args: never; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      drama_severity: "Low" | "Medium" | "High" | "Scam Alert"
      drama_status: "Pending" | "Approved" | "Rejected"
      drama_type:
        | "Payout Delay"
        | "Account Ban"
        | "Rule Change"
        | "Suspicious Activity"
        | "Shutdown"
        | "Other"
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
    Enums: {
      drama_severity: ["Low", "Medium", "High", "Scam Alert"],
      drama_status: ["Pending", "Approved", "Rejected"],
      drama_type: [
        "Payout Delay",
        "Account Ban",
        "Rule Change",
        "Suspicious Activity",
        "Shutdown",
        "Other",
      ],
    },
  },
} as const
