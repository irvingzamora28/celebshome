export interface Database {
  public: {
    Tables: {
      celebrities: {
        Row: {
          id: number;
          name: string;
          date_of_birth: string;
          date_of_death?: string | null;
          zodiac_sign: string;
          gender: string;
          nationality: string;
          profession: string;
          biography: string;
          image_url: string;
          social_links: string;
          popularity_score: number;
          additional_data?: Record<string, unknown>;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: number;
          name: string;
          date_of_birth: string;
          date_of_death?: string | null;
          zodiac_sign: string;
          gender: string;
          nationality: string;
          profession: string;
          biography: string;
          image_url: string;
          social_links: string;
          popularity_score: number;
          additional_data?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          date_of_birth?: string;
          date_of_death?: string | null;
          zodiac_sign?: string;
          gender?: string;
          nationality?: string;
          profession?: string;
          biography?: string;
          image_url?: string;
          social_links?: string;
          popularity_score?: number;
          additional_data?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
