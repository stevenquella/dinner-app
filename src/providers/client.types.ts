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
      meal: {
        Row: {
          id: string
          created_on: string | null
          name: string
          user_id: string
        }
        Insert: {
          id?: string
          created_on?: string | null
          name: string
          user_id: string
        }
        Update: {
          id?: string
          created_on?: string | null
          name?: string
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
