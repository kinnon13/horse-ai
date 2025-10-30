import { UserTable } from './supabase-users'
import { UserHorsesTable } from './supabase-horses'

// Database types
export interface Database {
  public: {
    Tables: {
      users: UserTable
      user_horses: UserHorsesTable
    }
  }
}
