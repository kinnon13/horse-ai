import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/isAdmin'

export async function POST(req: NextRequest) {
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { action, contractId, partnerId, renewalDate } = await req.json()

    switch (action) {
      case 'create_contract':
        // Create partnership contract
        console.log('Contract created:', { contractId, partnerId })
        return NextResponse.json({ 
          success: true, 
          contractId: contractId || `contract_${Date.now()}` 
        })
      
      case 'track_renewal':
        // Track contract renewal dates
        return NextResponse.json({ 
          success: true, 
          renewalDate,
          daysUntilRenewal: renewalDate ? 
            Math.ceil((new Date(renewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
            null
        })
      
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Extended diplomacy error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

