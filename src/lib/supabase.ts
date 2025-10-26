import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if we have real credentials (not placeholder values)
const hasRealCredentials = supabaseUrl && 
                           supabaseAnonKey && 
                           supabaseUrl !== 'your_supabase_url' &&
                           supabaseAnonKey !== 'your_supabase_anon_key' &&
                           supabaseUrl.startsWith('http')

// Create a dummy client if no real credentials are provided (for development)
export const supabase = hasRealCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder')

export type Database = {
  public: {
    Tables: {
      horses: {
        Row: {
          id: string
          name: string
          breed: string
          sire: string | null
          dam: string | null
          earnings: number
          reg_number: string | null
          owner_name: string | null
          rider_name: string | null
          breeder_name: string | null
          discipline: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          breed: string
          sire?: string | null
          dam?: string | null
          earnings?: number
          reg_number?: string | null
          owner_name?: string | null
          rider_name?: string | null
          breeder_name?: string | null
          discipline?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          breed?: string
          sire?: string | null
          dam?: string | null
          earnings?: number
          reg_number?: string | null
          owner_name?: string | null
          rider_name?: string | null
          breeder_name?: string | null
          discipline?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          subscription_tier: 'free' | 'intro' | 'pro'
          points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          subscription_tier?: 'free' | 'intro' | 'pro'
          points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          subscription_tier?: 'free' | 'intro' | 'pro'
          points?: number
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          name: string
          date: string
          discipline: string
          location: string | null
          prize_money: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          date: string
          discipline: string
          location?: string | null
          prize_money?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          date?: string
          discipline?: string
          location?: string | null
          prize_money?: number
          created_at?: string
          updated_at?: string
        }
      }
      audits: {
        Row: {
          id: string
          horse_id: string
          audit_type: 'csv_upload' | 'ai_verification' | 'data_correction'
          status: 'pending' | 'verified' | 'flagged' | 'corrected'
          details: string
          created_at: string
        }
        Insert: {
          id?: string
          horse_id: string
          audit_type: 'csv_upload' | 'ai_verification' | 'data_correction'
          status?: 'pending' | 'verified' | 'flagged' | 'corrected'
          details: string
          created_at?: string
        }
        Update: {
          id?: string
          horse_id?: string
          audit_type?: 'csv_upload' | 'ai_verification' | 'data_correction'
          status?: 'pending' | 'verified' | 'flagged' | 'corrected'
          details?: string
          created_at?: string
        }
      }
    }
  }
}
