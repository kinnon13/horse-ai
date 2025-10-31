// MemoryQueryHelpers.ts (30 lines) - Single responsibility: Query helper functions
import { UserMemory } from './MemoryTypes'

export class MemoryQueryHelpers {
  static async executeQuery(url: string, errorMessage: string): Promise<any> {
    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(errorMessage)
      }
      
      return response.json()
    } catch (error) {
      console.error(`Error: ${errorMessage}`, error)
      return null
    }
  }

  static async executeArrayQuery(url: string, errorMessage: string): Promise<any[]> {
    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(errorMessage)
      }
      
      return response.json()
    } catch (error) {
      console.error(`Error: ${errorMessage}`, error)
      return []
    }
  }

  static buildUserMemoryUrl(userId: string): string {
    return `/api/user-memory?user_id=${userId}`
  }

  static buildPerformancesUrl(userId: string): string {
    return `/api/user-memory/performances?user_id=${userId}`
  }

  static buildBreedingUrl(userId: string): string {
    return `/api/user-memory/breeding?user_id=${userId}`
  }
}

