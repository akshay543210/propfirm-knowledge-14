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
      prop_firms: {
        Row: {
          id: string
          name: string
          slug: string
          category_id: string | null
          price: number
          original_price: number
          coupon_code: string | null
          review_score: number | null
          trust_rating: number | null
          description: string | null
          features: string[] | null
          logo_url: string | null
          profit_split: number
          payout_rate: number
          funding_amount: string
          user_review_count: number | null
          pros: string[] | null
          cons: string[] | null
          affiliate_url: string | null
          brand: string | null
          platform: string | null
          max_funding: string | null
          evaluation_model: string | null
          starting_fee: number | null
          regulation: string | null
          show_on_homepage: boolean
          created_at: string | null
          updated_at: string | null
          table_price: number | null
          table_profit_split: number | null
          table_payout_rate: number | null
          table_platform: string | null
          table_trust_rating: number | null
          table_evaluation_rules: string | null
          table_fee: number | null
          table_coupon_code: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category_id?: string | null
          price: number
          original_price: number
          coupon_code?: string | null
          review_score?: number | null
          trust_rating?: number | null
          description?: string | null
          features?: string[] | null
          logo_url?: string | null
          profit_split: number
          payout_rate: number
          funding_amount: string
          user_review_count?: number | null
          pros?: string[] | null
          cons?: string[] | null
          affiliate_url?: string | null
          brand?: string | null
          platform?: string | null
          max_funding?: string | null
          evaluation_model?: string | null
          starting_fee?: number | null
          regulation?: string | null
          show_on_homepage?: boolean
          created_at?: string | null
          updated_at?: string | null
          table_price?: number | null
          table_profit_split?: number | null
          table_payout_rate?: number | null
          table_platform?: string | null
          table_trust_rating?: number | null
          table_evaluation_rules?: string | null
          table_fee?: number | null
          table_coupon_code?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category_id?: string | null
          price?: number
          original_price?: number
          coupon_code?: string | null
          review_score?: number | null
          trust_rating?: number | null
          description?: string | null
          features?: string[] | null
          logo_url?: string | null
          profit_split?: number
          payout_rate?: number
          funding_amount?: string
          user_review_count?: number | null
          pros?: string[] | null
          cons?: string[] | null
          affiliate_url?: string | null
          brand?: string | null
          platform?: string | null
          max_funding?: string | null
          evaluation_model?: string | null
          starting_fee?: number | null
          regulation?: string | null
          show_on_homepage?: boolean
          created_at?: string | null
          updated_at?: string | null
          table_price?: number | null
          table_profit_split?: number | null
          table_payout_rate?: number | null
          table_platform?: string | null
          table_trust_rating?: number | null
          table_evaluation_rules?: string | null
          table_fee?: number | null
          table_coupon_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prop_firms_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          firm_id: string | null
          user_id: string | null
          reviewer_name: string | null
          rating: number
          title: string | null
          content: string
          is_verified: boolean | null
          helpful_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          firm_id?: string | null
          user_id?: string | null
          reviewer_name?: string | null
          rating: number
          title?: string | null
          content: string
          is_verified?: boolean | null
          helpful_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          firm_id?: string | null
          user_id?: string | null
          reviewer_name?: string | null
          rating?: number
          title?: string | null
          content?: string
          is_verified?: boolean | null
          helpful_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "prop_firms"
            referencedColumns: ["id"]
          }
        ]
      }
      budget_prop: {
        Row: {
          id: string
          propfirm_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          propfirm_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          propfirm_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_prop_propfirm_id_fkey"
            columns: ["propfirm_id"]
            isOneToOne: false
            referencedRelation: "prop_firms"
            referencedColumns: ["id"]
          }
        ]
      }
      top5_prop: {
        Row: {
          id: string
          propfirm_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          propfirm_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          propfirm_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "top5_prop_propfirm_id_fkey"
            columns: ["propfirm_id"]
            isOneToOne: false
            referencedRelation: "prop_firms"
            referencedColumns: ["id"]
          }
        ]
      }
      table_review_firms: {
        Row: {
          id: string
          firm_id: string
          is_approved: boolean
          sort_priority: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          firm_id: string
          is_approved?: boolean
          sort_priority?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          firm_id?: string
          is_approved?: boolean
          sort_priority?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_review_firms_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "prop_firms"
            referencedColumns: ["id"]
          }
        ]
      }
      drama_reports: {
        Row: {
          id: string
          firm_name: string
          date_reported: string
          drama_type: string
          description: string
          source_links: string[] | null
          severity: string
          status: string
          submitted_by: string | null
          admin_approved_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          firm_name: string
          date_reported?: string
          drama_type: string
          description: string
          source_links?: string[] | null
          severity: string
          status?: string
          submitted_by?: string | null
          admin_approved_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          firm_name?: string
          date_reported?: string
          drama_type?: string
          description?: string
          source_links?: string[] | null
          severity?: string
          status?: string
          submitted_by?: string | null
          admin_approved_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      account_sizes: {
        Row: {
          id: string
          firm_id: string
          size: string
          discounted_price: number
          original_price: number
          promo_code: string | null
          buying_link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          firm_id: string
          size: string
          discounted_price: number
          original_price: number
          promo_code?: string | null
          buying_link?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          firm_id?: string
          size?: string
          discounted_price?: number
          original_price?: number
          promo_code?: string | null
          buying_link?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_sizes_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "prop_firms"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never