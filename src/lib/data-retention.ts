// src/lib/data-retention.ts
import { supabase } from './supabase'
import { Database } from './supabase'

type DataType = 'chats' | 'public_records' | 'scrubbed_expansions' | 'personal_data'
type RetentionPolicy = 'user_controlled' | 'indefinite' | 'archived' | 'anonymized'

export interface DataRetentionPolicy {
  dataType: DataType
  retention: RetentionPolicy
  retentionPeriod?: number // in years
  deletionImpact: string
  example: string
}

export const DATA_RETENTION_POLICIES: Record<DataType, DataRetentionPolicy> = {
  chats: {
    dataType: 'chats',
    retention: 'user_controlled',
    retentionPeriod: 2, // auto-delete inactive after 2 years
    deletionImpact: 'Only removes query history; no DB change',
    example: '"What cross for Heavens Sakes?" deleted, but AI recs remain accessible.'
  },
  public_records: {
    dataType: 'public_records',
    retention: 'indefinite',
    deletionImpact: 'Can\'t delete (public domain); flag/anonymize personal links',
    example: 'Earnings ($77K total), events (BFA World Champ Fut $4,527), owners (Lieblong/Brooks) stay.'
  },
  scrubbed_expansions: {
    dataType: 'scrubbed_expansions',
    retention: 'archived',
    retentionPeriod: 5, // update on new info, archive old versions
    deletionImpact: 'Update only; old versions archived for audits',
    example: 'Progeny from JL Dash Ta Heaven ($9M+ earnings) persists for matching.'
  },
  personal_data: {
    dataType: 'personal_data',
    retention: 'anonymized',
    retentionPeriod: 1, // anonymize after 1 year of inactivity
    deletionImpact: 'PII removed, performance data anonymized',
    example: 'Phone/email removed, but "Owner of Heavens Sakes" performance data remains.'
  }
}

export class DataRetentionManager {
  /**
   * Handle user data deletion request (GDPR/CCPA compliance)
   */
  async handleDataDeletionRequest(userId: string, dataTypes: DataType[]): Promise<{
    success: boolean
    deleted: string[]
    retained: string[]
    anonymized: string[]
  }> {
    const results = {
      success: true,
      deleted: [] as string[],
      retained: [] as string[],
      anonymized: [] as string[]
    }

    for (const dataType of dataTypes) {
      const policy = DATA_RETENTION_POLICIES[dataType]
      
      switch (policy.retention) {
        case 'user_controlled':
          // Delete user's chat history
          await this.deleteUserChats(userId)
          results.deleted.push(`Chat history for user ${userId}`)
          break
          
        case 'indefinite':
          // Cannot delete public records, but can anonymize personal links
          await this.anonymizePersonalLinks(userId)
          results.retained.push(`Public performance records (cannot delete)`)
          break
          
        case 'archived':
          // Archive old versions, keep current
          await this.archiveOldVersions(userId)
          results.retained.push(`Current scrubbed data (archived old versions)`)
          break
          
        case 'anonymized':
          // Remove PII, keep performance data
          await this.anonymizePersonalData(userId)
          results.anonymized.push(`Personal data anonymized for user ${userId}`)
          break
      }
    }

    return results
  }

  /**
   * Delete user chat history
   */
  private async deleteUserChats(userId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error deleting user chats:', error)
      throw new Error('Failed to delete chat history')
    }
  }

  /**
   * Anonymize personal links in public records
   */
  private async anonymizePersonalLinks(userId: string): Promise<void> {
    // Remove user's contact info from public records
    const { error } = await supabase
      .from('user_profiles')
      .update({
        email: null,
        phone: null,
        do_not_contact: true
      })
      .eq('id', userId)
    
    if (error) {
      console.error('Error anonymizing personal links:', error)
      throw new Error('Failed to anonymize personal links')
    }
  }

  /**
   * Archive old versions of scrubbed data
   */
  private async archiveOldVersions(userId: string): Promise<void> {
    // Move old scraped data to archive table
    const { error } = await supabase
      .from('scraped_data_archive')
      .insert(
        await supabase
          .from('scraped_data')
          .select('*')
          .eq('user_id', userId)
          .lt('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
      )
    
    if (error) {
      console.error('Error archiving old versions:', error)
      throw new Error('Failed to archive old versions')
    }
  }

  /**
   * Anonymize personal data while keeping performance records
   */
  private async anonymizePersonalData(userId: string): Promise<void> {
    // Remove PII from user profile
    await supabase
      .from('user_profiles')
      .update({
        email: null,
        phone: null,
        name: 'Anonymous User',
        do_not_contact: true
      })
      .eq('id', userId)

    // Keep performance data but remove personal identifiers
    await supabase
      .from('horses')
      .update({
        owner_name: 'Anonymous Owner',
        contact_info: null
      })
      .eq('user_id', userId)
  }

  /**
   * Get data retention summary for a user
   */
  async getDataRetentionSummary(userId: string): Promise<{
    dataTypes: DataType[]
    retentionPolicies: DataRetentionPolicy[]
    canDelete: string[]
    cannotDelete: string[]
  }> {
    const dataTypes: DataType[] = ['chats', 'public_records', 'scrubbed_expansions', 'personal_data']
    const retentionPolicies = dataTypes.map(type => DATA_RETENTION_POLICIES[type])
    
    const canDelete = dataTypes
      .filter(type => DATA_RETENTION_POLICIES[type].retention === 'user_controlled')
      .map(type => DATA_RETENTION_POLICIES[type].dataType)
    
    const cannotDelete = dataTypes
      .filter(type => DATA_RETENTION_POLICIES[type].retention === 'indefinite')
      .map(type => DATA_RETENTION_POLICIES[type].dataType)

    return {
      dataTypes,
      retentionPolicies,
      canDelete,
      cannotDelete
    }
  }

  /**
   * Auto-cleanup inactive data based on retention policies
   */
  async performAutoCleanup(): Promise<void> {
    const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000)
    
    // Delete inactive chat history
    const { error: chatError } = await supabase
      .from('chat_messages')
      .delete()
      .lt('created_at', twoYearsAgo.toISOString())
      .eq('user_id', (await supabase
        .from('user_profiles')
        .select('id')
        .lt('last_active', twoYearsAgo.toISOString())
      ).data?.[0]?.id)
    
    if (chatError) {
      console.error('Error in auto-cleanup of chats:', chatError)
    }

    // Archive old scrubbed data
    const { error: archiveError } = await supabase
      .from('scraped_data_archive')
      .insert(
        await supabase
          .from('scraped_data')
          .select('*')
          .lt('created_at', new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString())
      )
    
    if (archiveError) {
      console.error('Error in auto-cleanup of scrubbed data:', archiveError)
    }
  }
}

export const dataRetentionManager = new DataRetentionManager()
