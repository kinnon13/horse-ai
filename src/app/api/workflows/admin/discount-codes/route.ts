import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/isAdmin'
import { listPromotionCodes, updatePromotionCode } from '@/app/api/admin/discount-codes/DiscountCodeOperations'

export async function GET(req: NextRequest) {
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const codes = await listPromotionCodes()
    return NextResponse.json({ codes })
  } catch (error) {
    console.error('Discount codes error:', error)
    return NextResponse.json({ error: 'Failed to fetch codes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { code, validate } = await req.json()
    
    if (validate) {
      // Validate existing code
      const codes = await listPromotionCodes()
      const found = codes.find(c => c.code === code)
      return NextResponse.json({ valid: !!found, code: found })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

