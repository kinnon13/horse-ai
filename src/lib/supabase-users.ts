// User table types
export interface UserTable {
  Row: {
    id: string
    email: string
    phone?: string
    tier: 'guest' | 'free' | 'basic' | 'plus'
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    email: string
    phone?: string
    tier?: 'guest' | 'free' | 'basic' | 'plus'
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    email?: string
    phone?: string
    tier?: 'guest' | 'free' | 'basic' | 'plus'
    created_at?: string
    updated_at?: string
  }
}

