import { supabaseAdmin } from '@/lib/supabase'

export class UserMemoryService {
  async getUserMemory(userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: userMemory, error } = await supabaseAdmin
      .from('user_memory')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return userMemory || null
  }

  async createUserMemory(memoryData: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: userMemory, error } = await supabaseAdmin
      .from('user_memory')
      .insert([{
        ...memoryData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return userMemory
  }

  async updateUserMemory(userId: string, updates: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: userMemory, error } = await supabaseAdmin
      .from('user_memory')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return userMemory
  }

  async deleteUserMemory(userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { error } = await supabaseAdmin
      .from('user_memory')
      .delete()
      .eq('user_id', userId)

    if (error) throw error
    return { success: true }
  }

  async addMemoryItem(userId: string, item: any) {
    const existingMemory = await this.getUserMemory(userId)
    
    if (existingMemory) {
      const updatedItems = [...(existingMemory.items || []), item]
      return await this.updateUserMemory(userId, { items: updatedItems })
    } else {
      return await this.createUserMemory({user_id: userId,
        items: [item]
      })
    }
  }

  async removeMemoryItem(userId: string, itemId: string) {
    const existingMemory = await this.getUserMemory(userId)
    
    if (existingMemory && existingMemory.items) {
      const updatedItems = existingMemory.items.filter((item: any) => item.id !== itemId)
      return await this.updateUserMemory(userId, { items: updatedItems })
    }
    
    return existingMemory
  }
}

