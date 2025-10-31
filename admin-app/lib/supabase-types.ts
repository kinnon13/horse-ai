// Database types for admin app
export interface Database {
  public: {
    Tables: {
      users: any
      user_horses: any
      [key: string]: any
    }
  }
}

