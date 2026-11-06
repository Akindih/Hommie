export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string;
          id: string;
          institution: string | null;
          name: string;
          slug: string;
          type: Database["public"]["Enums"]["brand_type"];
          website: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          institution?: string | null;
          name: string;
          slug: string;
          type?: Database["public"]["Enums"]["brand_type"];
          website?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          institution?: string | null;
          name?: string;
          slug?: string;
          type?: Database["public"]["Enums"]["brand_type"];
          website?: string | null;
        };
        Relationships: [];
      };
      logs: {
        Row: {
          id: string;
          liked: boolean;
          logged_at: string;
          rating: number | null;
          review_text: string | null;
          show_id: string;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          id?: string;
          liked?: boolean;
          logged_at?: string;
          rating?: number | null;
          review_text?: string | null;
          show_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          liked?: boolean;
          logged_at?: string;
          rating?: number | null;
          review_text?: string | null;
          show_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "logs_show_id_fkey";
            columns: ["show_id"];
            isOneToOne: false;
            referencedRelation: "show_stats";
            referencedColumns: ["show_id"];
          },
          {
            foreignKeyName: "logs_show_id_fkey";
            columns: ["show_id"];
            isOneToOne: false;
            referencedRelation: "shows";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      looks: {
        Row: {
          id: string;
          image_url: string | null;
          look_number: number;
          notes: string | null;
          photographer_credit: string | null;
          show_id: string;
        };
        ComputedFields: never;
        Insert: {
          id?: string;
          image_url?: string | null;
          look_number: number;
          notes?: string | null;
          photographer_credit?: string | null;
          show_id: string;
        };
        Update: {
          id?: string;
          image_url?: string | null;
          look_number?: number;
          notes?: string | null;
          photographer_credit?: string | null;
          show_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "looks_show_id_fkey";
            columns: ["show_id"];
            isOneToOne: false;
            referencedRelation: "show_stats";
            referencedColumns: ["show_id"];
          },
          {
            foreignKeyName: "looks_show_id_fkey";
            columns: ["show_id"];
            isOneToOne: false;
            referencedRelation: "shows";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          username: string;
        };
        ComputedFields: never;
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          username?: string;
        };
        Relationships: [];
      };
      shows: {
        Row: {
          brand_id: string;
          cover_image_url: string | null;
          created_at: string;
          description: string | null;
          event: string | null;
          id: string;
          licence_status: Database["public"]["Enums"]["licence_status"];
          season: string | null;
          show_date: string | null;
          slug: string;
          title: string;
          video_url: string | null;
          year: number | null;
        };
        ComputedFields: never;
        Insert: {
          brand_id: string;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          event?: string | null;
          id?: string;
          licence_status?: Database["public"]["Enums"]["licence_status"];
          season?: string | null;
          show_date?: string | null;
          slug: string;
          title: string;
          video_url?: string | null;
          year?: number | null;
        };
        Update: {
          brand_id?: string;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          event?: string | null;
          id?: string;
          licence_status?: Database["public"]["Enums"]["licence_status"];
          season?: string | null;
          show_date?: string | null;
          slug?: string;
          title?: string;
          video_url?: string | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "shows_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
        ];
      };
      watchlist: {
        Row: {
          added_at: string;
          show_id: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          added_at?: string;
          show_id: string;
          user_id: string;
        };
        Update: {
          added_at?: string;
          show_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "watchlist_show_id_fkey";
            columns: ["show_id"];
            isOneToOne: false;
            referencedRelation: "show_stats";
            referencedColumns: ["show_id"];
          },
          {
            foreignKeyName: "watchlist_show_id_fkey";
            columns: ["show_id"];
            isOneToOne: false;
            referencedRelation: "shows";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "watchlist_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      show_stats: {
        Row: {
          avg_rating: number | null;
          like_count: number | null;
          rating_count: number | null;
          show_id: string;
        };
        ComputedFields: never;
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      brand_type: "graduate" | "label";
      licence_status: "none" | "embed_only" | "licensed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      brand_type: ["graduate", "label"],
      licence_status: ["none", "embed_only", "licensed"],
    },
  },
} as const;
