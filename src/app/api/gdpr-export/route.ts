// src/app/api/gdpr-export/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { dataRetentionManager } from '@/lib/data-retention'

export async function POST(request: Request) {
  try {
    const { userId, dataTypes } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user's data based on requested types
    const exportData: any = {
      user_id: userId,
      export_date: new Date().toISOString(),
      data_types: dataTypes || ['chats', 'public_records', 'scrubbed_expansions', 'personal_data']
    }

    // Export chat history if requested
    if (dataTypes?.includes('chats') || !dataTypes) {
      const { data: chats, error: chatError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (chatError) {
        console.error('Error fetching chat data:', chatError)
      } else {
        exportData.chat_history = chats
      }
    }

    // Export public records (performance data)
    if (dataTypes?.includes('public_records') || !dataTypes) {
      const { data: horses, error: horseError } = await supabase
        .from('horses')
        .select(`
          *,
          events (
            event_name,
            event_date,
            placement,
            earnings,
            discipline
          )
        `)
        .eq('user_id', userId)

      if (horseError) {
        console.error('Error fetching horse data:', horseError)
      } else {
        exportData.performance_records = horses
      }
    }

    // Export scrubbed expansions
    if (dataTypes?.includes('scrubbed_expansions') || !dataTypes) {
      const { data: scrapedData, error: scrapedError } = await supabase
        .from('scraped_data')
        .select('*')
        .eq('user_id', userId)

      if (scrapedError) {
        console.error('Error fetching scraped data:', scrapedError)
      } else {
        exportData.scrubbed_expansions = scrapedData
      }
    }

    // Export personal data
    if (dataTypes?.includes('personal_data') || !dataTypes) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error fetching profile data:', profileError)
      } else {
        exportData.personal_data = {
          subscription_tier: profile.subscription_tier,
          points: profile.points,
          created_at: profile.created_at,
          last_active: profile.last_active
          // Note: Sensitive data like email/phone excluded for privacy
        }
      }
    }

    // Get data retention summary
    const retentionSummary = await dataRetentionManager.getDataRetentionSummary(userId)

    exportData.retention_policy = {
      summary: retentionSummary,
      policies: {
        chats: 'User-controlled (default indefinite, auto-delete inactive 2 years)',
        public_records: 'Indefinite (factual/sport data)',
        scrubbed_expansions: '1-5 years (update on new info)',
        personal_data: 'Anonymized after 1 year of inactivity'
      }
    }

    // Log the export request
    await supabase.from('data_export_logs').insert({
      user_id: userId,
      export_types: dataTypes || ['all'],
      export_date: new Date().toISOString(),
      status: 'completed'
    })

    return NextResponse.json({
      success: true,
      data: exportData,
      message: 'Data export completed successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Error in GDPR export:', error)
    return NextResponse.json({ 
      error: 'Failed to export user data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId, dataTypes } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Handle data deletion based on retention policies
    const deletionResult = await dataRetentionManager.handleDataDeletionRequest(
      userId, 
      dataTypes || ['chats', 'personal_data']
    )

    // Log the deletion request
    await supabase.from('data_deletion_logs').insert({
      user_id: userId,
      deletion_types: dataTypes || ['chats', 'personal_data'],
      deletion_date: new Date().toISOString(),
      status: deletionResult.success ? 'completed' : 'failed',
      details: {
        deleted: deletionResult.deleted,
        retained: deletionResult.retained,
        anonymized: deletionResult.anonymized
      }
    })

    return NextResponse.json({
      success: deletionResult.success,
      message: 'Data deletion request processed',
      details: {
        deleted: deletionResult.deleted,
        retained: deletionResult.retained,
        anonymized: deletionResult.anonymized
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error in GDPR deletion:', error)
    return NextResponse.json({ 
      error: 'Failed to delete user data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}