export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      grocery: {
        Row: {
          category: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          category: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          category?: string
          id?: string
          name?: string
          user_id?: string
        }
      }
      meal: {
        Row: {
          id: string
          name: string
          notes: string | null
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          notes?: string | null
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          notes?: string | null
          user_id?: string
        }
      }
      meal_grocery: {
        Row: {
          grocery_id: string
          meal_id: string
          user_id: string
        }
        Insert: {
          grocery_id: string
          meal_id: string
          user_id: string
        }
        Update: {
          grocery_id?: string
          meal_id?: string
          user_id?: string
        }
      }
      plan: {
        Row: {
          date: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          date: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          date?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
      }
      plan_meal: {
        Row: {
          meal_id: string
          plan_id: string
          user_id: string
        }
        Insert: {
          meal_id: string
          plan_id: string
          user_id: string
        }
        Update: {
          meal_id?: string
          plan_id?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
