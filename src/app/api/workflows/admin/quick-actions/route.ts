import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/isAdmin'
import { 
  generateReferralCode, 
  createTestProvider, 
  getSystemStats 
} from '@/app/api/admin/quick-actions/AdminQuickActionsService'

export async function POST(req: NextRequest) {
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { action, batch, ...params } = await req.json()

    if (batch && Array.isArray(batch)) {
      // Batch operations
      const results = await Promise.all(
        batch.map(item => handleAction(item.action, item))
      )
      return NextResponse.json({ results })
    }

    const result = await handleAction(action, params)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Quick action error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

async function handleAction(action: string, params: any) {
  switch (action) {
    case 'generate_referral_code': return generateReferralCode(params)
    case 'create_test_provider': return createTestProvider(params)
    case 'get_system_stats': return getSystemStats()
    default: throw new Error('Unknown action')
  }
}

