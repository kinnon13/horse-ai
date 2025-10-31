// User horses table types
export interface UserHorsesTable {
  Row: {
    id: string
    user_id: string
    horse_name: string
    horse_type: string
    breed: string
    value?: number
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    user_id: string
    horse_name: string
    horse_type: string
    breed: string
    value?: number
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    horse_name?: string
    horse_type?: string
    breed?: string
    value?: number
    created_at?: string
    updated_at?: string
  }
}

