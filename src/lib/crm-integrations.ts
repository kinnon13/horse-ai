import { google } from 'googleapis'
import { supabase } from './supabase'
import { ExportGenerator } from './export-generator'

export interface CRMContact {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  tags: string[]
  lastContact: Date
  notes: string
  horses: string[]
  totalEarnings: number
}

export interface HexicodeContact {
  name: string
  email: string
  phone?: string
  company?: string
  customFields: {
    horseCount: number
    totalEarnings: number
    primaryDiscipline: string
    lastActivity: string
  }
}

export class CRMIntegrations {
  private exportGenerator: ExportGenerator

  constructor() {
    this.exportGenerator = new ExportGenerator()
  }

  // Google Drive Integration
  async uploadToGoogleDrive(
    userId: string, 
    fileName: string, 
    content: string | Buffer, 
    mimeType: string
  ): Promise<string> {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/drive.file']
      })

      const drive = google.drive({ version: 'v3', auth })

      const fileMetadata = {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID || 'root']
      }

      const media = {
        mimeType,
        body: Buffer.isBuffer(content) ? content : Buffer.from(content)
      }

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id,webViewLink'
      })

      return response.data.webViewLink || ''
    } catch (error) {
      console.error('Failed to upload to Google Drive:', error)
      throw error
    }
  }

  async syncToGoogleDrive(userId: string): Promise<void> {
    try {
      // Generate CSV export
      const csvContent = await this.exportGenerator.generateCSVExport(userId, {
        includeScrapedData: true,
        includeLinkedEntities: true
      })

      // Upload to Google Drive
      const driveUrl = await this.uploadToGoogleDrive(
        userId,
        `horse-ai-export-${Date.now()}.csv`,
        csvContent,
        'text/csv'
      )

      // Store sync record
      await supabase
        .from('sync_records')
        .insert({
          user_id: userId,
          sync_type: 'google_drive',
          file_url: driveUrl,
          synced_at: new Date().toISOString()
        })

      console.log(`Data synced to Google Drive: ${driveUrl}`)
    } catch (error) {
      console.error('Failed to sync to Google Drive:', error)
      throw error
    }
  }

  // Hexicode.ai Integration
  async exportToHexicode(userId: string): Promise<void> {
    try {
      // Get user's horse data
      const { data: horses } = await supabase
        .from('horses')
        .select('*')
        .eq('user_id', userId)

      const { data: linkedEntities } = await supabase
        .from('linked_entities')
        .select('*')
        .eq('user_id', userId)

      if (!horses || !linkedEntities) return

      // Create contacts from linked entities
      const contacts: HexicodeContact[] = linkedEntities.map(entity => {
        const entityHorses = horses.filter(h => 
          h.owner_name === entity.name || 
          h.rider_name === entity.name
        )

        return {
          name: entity.name,
          email: '', // Would need to be collected separately
          company: entity.type === 'owner' ? 'Horse Owner' : 'Rider',
          customFields: {
            horseCount: entityHorses.length,
            totalEarnings: entityHorses.reduce((sum, h) => sum + (h.earnings || 0), 0),
            primaryDiscipline: entityHorses[0]?.discipline || 'Unknown',
            lastActivity: new Date().toISOString()
          }
        }
      })

      // Send to Hexicode webhook
      const webhookUrl = process.env.HEXICODE_WEBHOOK_URL
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.HEXICODE_API_KEY}`
          },
          body: JSON.stringify({
            userId,
            contacts,
            syncType: 'horse_ai_export',
            timestamp: new Date().toISOString()
          })
        })
      }

      // Store sync record
      await supabase
        .from('sync_records')
        .insert({
          user_id: userId,
          sync_type: 'hexicode',
          contacts_count: contacts.length,
          synced_at: new Date().toISOString()
        })

      console.log(`Exported ${contacts.length} contacts to Hexicode`)
    } catch (error) {
      console.error('Failed to export to Hexicode:', error)
      throw error
    }
  }

  // Advanced Segmentation
  async segmentUsers(): Promise<any[]> {
    try {
      const { data: users } = await supabase
        .from('users')
        .select(`
          id,
          subscription_tier,
          points,
          created_at,
          horses:horse_count,
          search_analytics:search_count
        `)

      if (!users) return []

      const segments = []

      // High-value users (Pro tier, high points, active)
      const highValue = users.filter(user => 
        user.subscription_tier === 'pro' && 
        user.points > 1000
      )
      if (highValue.length > 0) {
        segments.push({
          name: 'High-Value Users',
          criteria: 'Pro tier, 1000+ points',
          count: highValue.length,
          users: highValue.map(u => u.id),
          recommendedAction: 'VIP support, exclusive features'
        })
      }

      // At-risk users (Free tier, low activity)
      const atRisk = users.filter(user => 
        user.subscription_tier === 'free' && 
        user.points < 100 &&
        new Date(user.created_at) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      )
      if (atRisk.length > 0) {
        segments.push({
          name: 'At-Risk Users',
          criteria: 'Free tier, low activity, 30+ days old',
          count: atRisk.length,
          users: atRisk.map(u => u.id),
          recommendedAction: 'Re-engagement campaign, upgrade incentives'
        })
      }

      // Power users (High search activity)
      const powerUsers = users.filter(user => 
        (user as any).search_count > 50
      )
      if (powerUsers.length > 0) {
        segments.push({
          name: 'Power Users',
          criteria: '50+ searches',
          count: powerUsers.length,
          users: powerUsers.map(u => u.id),
          recommendedAction: 'Advanced features, beta access'
        })
      }

      return segments
    } catch (error) {
      console.error('Failed to segment users:', error)
      return []
    }
  }

  // Automated Campaign Triggers
  async triggerCampaigns(): Promise<void> {
    try {
      const segments = await this.segmentUsers()

      for (const segment of segments) {
        if (segment.name === 'At-Risk Users') {
          await this.triggerReEngagementCampaign(segment.users)
        } else if (segment.name === 'High-Value Users') {
          await this.triggerVIPCampaign(segment.users)
        } else if (segment.name === 'Power Users') {
          await this.triggerFeatureCampaign(segment.users)
        }
      }
    } catch (error) {
      console.error('Failed to trigger campaigns:', error)
    }
  }

  private async triggerReEngagementCampaign(userIds: string[]): Promise<void> {
    // Send re-engagement notifications
    for (const userId of userIds) {
      try {
        await fetch('/api/notifications/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            notification: {
              title: 'We Miss You!',
              body: 'Your horses are waiting for you. Check out new AI insights!',
              data: { campaign: 'reengagement' }
            }
          })
        })
      } catch (error) {
        console.error(`Failed to send re-engagement to ${userId}:`, error)
      }
    }
  }

  private async triggerVIPCampaign(userIds: string[]): Promise<void> {
    // Send VIP exclusive notifications
    for (const userId of userIds) {
      try {
        await fetch('/api/notifications/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            notification: {
              title: 'VIP Exclusive: New Features',
              body: 'Get early access to advanced breeding analytics!',
              data: { campaign: 'vip' }
            }
          })
        })
      } catch (error) {
        console.error(`Failed to send VIP notification to ${userId}:`, error)
      }
    }
  }

  private async triggerFeatureCampaign(userIds: string[]): Promise<void> {
    // Send feature update notifications
    for (const userId of userIds) {
      try {
        await fetch('/api/notifications/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            notification: {
              title: 'New Feature: Advanced Analytics',
              body: 'Discover trends in your data with our new analytics dashboard!',
              data: { campaign: 'features' }
            }
          })
        })
      } catch (error) {
        console.error(`Failed to send feature notification to ${userId}:`, error)
      }
    }
  }
}
