import { NextRequest, NextResponse } from 'next/server'
import { CRMIntegrations } from '@/lib/crm-integrations'

export async function POST(request: NextRequest) {
  try {
    const { userId, syncType } = await request.json()

    if (!userId || !syncType) {
      return NextResponse.json({ error: 'User ID and sync type required' }, { status: 400 })
    }

    const crm = new CRMIntegrations()

    switch (syncType) {
      case 'google_drive':
        await crm.syncToGoogleDrive(userId)
        return NextResponse.json({
          success: true,
          message: 'Data synced to Google Drive successfully'
        })

      case 'hexicode':
        await crm.exportToHexicode(userId)
        return NextResponse.json({
          success: true,
          message: 'Data exported to Hexicode successfully'
        })

      case 'segment':
        const segments = await crm.segmentUsers()
        return NextResponse.json({
          success: true,
          data: segments
        })

      case 'campaigns':
        await crm.triggerCampaigns()
        return NextResponse.json({
          success: true,
          message: 'Campaigns triggered successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid sync type' }, { status: 400 })
    }

  } catch (error) {
    console.error('CRM sync error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to sync CRM data'
    }, { status: 500 })
  }
}
