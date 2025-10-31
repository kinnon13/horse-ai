import { NextRequest, NextResponse } from 'next/server'
import { generateDailyPlan, getContactRecommendations } from '../../../lib/goalEngine'

export async function GET(req: NextRequest) {
  try {
    const missionStatus = await generateDailyPlan()
    const contacts = await getContactRecommendations(missionStatus.redLights)
    
    return NextResponse.json({
      success: true,
      status: missionStatus,
      contacts,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Mission control error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
