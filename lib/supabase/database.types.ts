export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string;
          facebook_url: string | null;
          id: string;
          line_id: string | null;
          location: string | null;
          slug: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name: string;
          facebook_url?: string | null;
          id: string;
          line_id?: string | null;
          location?: string | null;
          slug: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      listings: {
        Row: {
          box_condition: string | null;
          brand: string;
          car_condition: string;
          contact_method: string;
          created_at: string;
          currency: string;
          defects: string | null;
          delivery_preference: string | null;
          id: string;
          listing_mode: "sale" | "trade" | "sale_or_trade";
          location: string | null;
          model_name: string;
          price: number | null;
          scale: string | null;
          seller_id: string;
          series: string | null;
          status: "available" | "reserved" | "sold";
          title: string;
          updated_at: string;
          visibility: "draft" | "public" | "archived";
        };
        Insert: {
          box_condition?: string | null;
          brand: string;
          car_condition: string;
          contact_method: string;
          created_at?: string;
          currency?: string;
          defects?: string | null;
          delivery_preference?: string | null;
          id?: string;
          listing_mode: "sale" | "trade" | "sale_or_trade";
          location?: string | null;
          model_name: string;
          price?: number | null;
          scale?: string | null;
          seller_id: string;
          series?: string | null;
          status?: "available" | "reserved" | "sold";
          title: string;
          updated_at?: string;
          visibility?: "draft" | "public" | "archived";
        };
        Update: Partial<Database["public"]["Tables"]["listings"]["Insert"]>;
        Relationships: [];
      };
      listing_photos: {
        Row: {
          alt_text: string | null;
          created_at: string;
          id: string;
          listing_id: string;
          seller_id: string;
          sort_order: number;
          storage_path: string;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          id?: string;
          listing_id: string;
          seller_id: string;
          sort_order?: number;
          storage_path: string;
        };
        Update: Partial<Database["public"]["Tables"]["listing_photos"]["Insert"]>;
        Relationships: [];
      };
      transactions: {
        Row: {
          buyer_email: string | null;
          buyer_id: string | null;
          confirmed_at: string | null;
          confirmation_token_hash: string | null;
          created_at: string;
          expires_at: string;
          id: string;
          listing_id: string;
          seller_id: string;
          status: "pending_buyer_confirmation" | "confirmed" | "expired" | "cancelled";
          transaction_type: "sale" | "exchange";
          updated_at: string;
        };
        Insert: {
          buyer_email?: string | null;
          buyer_id?: string | null;
          confirmed_at?: string | null;
          confirmation_token_hash?: string | null;
          created_at?: string;
          expires_at: string;
          id?: string;
          listing_id: string;
          seller_id: string;
          status?: "pending_buyer_confirmation" | "confirmed" | "expired" | "cancelled";
          transaction_type: "sale" | "exchange";
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
        Relationships: [];
      };
      listing_events: {
        Row: {
          created_at: string;
          event_type: "listing_view" | "seller_profile_view" | "contact_click" | "share_click";
          id: string;
          listing_id: string | null;
          referrer: string | null;
          seller_id: string | null;
          session_id: string | null;
        };
        Insert: {
          created_at?: string;
          event_type: "listing_view" | "seller_profile_view" | "contact_click" | "share_click";
          id?: string;
          listing_id?: string | null;
          referrer?: string | null;
          seller_id?: string | null;
          session_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["listing_events"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
