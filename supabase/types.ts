export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PlanType = "FREE" | "STARTER" | "PREMIUM" | "ENTREPRISE"

export const PLAN_LIMITS: Record<PlanType, number> = {
  "FREE": 5,
  "STARTER": 10,
  "PREMIUM": 25,
  "ENTREPRISE": 100
}

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
      user_quotas: {
        Row: {
          id: string
          user_id: string
          video_count: number
          max_videos: number
          reset_date: string
          plan: PlanType
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_count?: number
          max_videos: number
          reset_date: string
          plan: PlanType
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_count?: number
          max_videos?: number
          reset_date?: string
          plan?: PlanType
          created_at?: string
          updated_at?: string
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