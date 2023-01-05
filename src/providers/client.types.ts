export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      grocery: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          name: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          name: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          name?: string;
        };
      };
      meal: {
        Row: {
          id: string;
          name: string;
          user_id: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          user_id: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          user_id?: string;
          notes?: string | null;
        };
      };
      meal_grocery: {
        Row: {
          user_id: string;
          meal_id: string;
          grocery_id: string;
          order: number | null;
        };
        Insert: {
          user_id: string;
          meal_id: string;
          grocery_id: string;
          order?: number | null;
        };
        Update: {
          user_id?: string;
          meal_id?: string;
          grocery_id?: string;
          order?: number | null;
        };
      };
      plan: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          notes?: string | null;
        };
      };
      plan_grocery: {
        Row: {
          user_id: string;
          plan_id: string;
          grocery_id: string;
          count: number;
        };
        Insert: {
          user_id: string;
          plan_id: string;
          grocery_id: string;
          count?: number;
        };
        Update: {
          user_id?: string;
          plan_id?: string;
          grocery_id?: string;
          count?: number;
        };
      };
      plan_meal: {
        Row: {
          user_id: string;
          plan_id: string;
          meal_id: string;
          order: number | null;
        };
        Insert: {
          user_id: string;
          plan_id: string;
          meal_id: string;
          order?: number | null;
        };
        Update: {
          user_id?: string;
          plan_id?: string;
          meal_id?: string;
          order?: number | null;
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
