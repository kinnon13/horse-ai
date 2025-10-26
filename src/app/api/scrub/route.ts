import { NextRequest, NextResponse } from 'next/server'
import { ScrapingAgents } from '@/lib/scraping-agents'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { horseName, userId } = await request.json()

    if (!horseName || !userId) {
      return NextResponse.json({ error: 'Horse name and user ID required' }, { status: 400 })
    }

    const agents = new ScrapingAgents()
    const scrapedData = await agents.triggerHorseScrub(horseName, userId)

    return NextResponse.json({
      success: true,
      message: `Successfully scrubbed data for ${horseName}`,
      data: scrapedData
    })

  } catch (error) {
    console.error('Scrub error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to scrub horse data'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user's scraped data
    const { data: scrapedData, error } = await supabase
      .from('scraped_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: scrapedData
    })

  } catch (error) {
    console.error('Get scraped data error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve scraped data'
    }, { status: 500 })
  }
}
