export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
<<<<<<< HEAD
  public: {
    Tables: {
=======
  // Allows to automatically instanciate createClient with right options
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
>>>>>>> 0b83ad0 (Your commit message)
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
<<<<<<< HEAD
=======
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
>>>>>>> 0b83ad0 (Your commit message)
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
<<<<<<< HEAD
=======
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
>>>>>>> 0b83ad0 (Your commit message)
      reviews: {
        Row: {
          content: string
          created_at: string | null
          firm_id: string | null
          helpful_count: number | null
          id: string
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
<<<<<<< HEAD
=======
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
>>>>>>> 0b83ad0 (Your commit message)
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
<<<<<<< HEAD
      [_ in never]: never
=======
      ensure_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
>>>>>>> 0b83ad0 (Your commit message)
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

<<<<<<< HEAD
type DefaultSchema = Database[Extract<keyof Database, "public">]
=======
type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]
>>>>>>> 0b83ad0 (Your commit message)

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
<<<<<<< HEAD
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
=======
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
>>>>>>> 0b83ad0 (Your commit message)
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
<<<<<<< HEAD
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
=======
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
>>>>>>> 0b83ad0 (Your commit message)
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
<<<<<<< HEAD
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
=======
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
>>>>>>> 0b83ad0 (Your commit message)
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
<<<<<<< HEAD
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
=======
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
>>>>>>> 0b83ad0 (Your commit message)
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
<<<<<<< HEAD
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
=======
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
>>>>>>> 0b83ad0 (Your commit message)
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
