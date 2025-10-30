import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/isAdmin'
import { generateReferralCode, createTestProvider, createTestHaulPoint, sendTestNotification, getSystemStats } from './AdminQuickActionsService'

export async function POST(req: Request) {
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { action, ...params } = body

    switch (action) {
      case 'generate_referral_code':
        return NextResponse.json(await generateReferralCode(params))
      
      case 'create_test_provider':
        return NextResponse.json(await createTestProvider(params))
      
      case 'create_test_haul_point':
        return NextResponse.json(await createTestHaulPoint(params))
      
      case 'send_test_notification':
        return NextResponse.json(await sendTestNotification(params))
      
      case 'get_system_stats':
        return NextResponse.json(await getSystemStats())
      
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (err: any) {
    console.error('Admin quick action error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
