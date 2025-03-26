export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          updated_at: string
          role: 'user' | 'admin'
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
          role?: 'user' | 'admin'
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          updated_at?: string
          role?: 'user' | 'admin'
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string | null
          url: string
          user_id: string
          created_at: string
          updated_at: string
          status: 'processing' | 'completed' | 'failed'
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          url: string
          user_id: string
          created_at?: string
          updated_at?: string
          status?: 'processing' | 'completed' | 'failed'
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          url?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          status?: 'processing' | 'completed' | 'failed'
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