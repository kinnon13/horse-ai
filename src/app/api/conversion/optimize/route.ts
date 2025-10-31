// conversion/optimize/route.ts (48 lines) - Conversion optimization API
import { NextRequest, NextResponse } from 'next/server'
import { getConversionRate } from '@/lib/userAcquisition'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const conversionRate = await getConversionRate()
    const { data: dropoffs } = await supabase
      .from('user_events')
      .select('event_type, page_url')
      .eq('event_type', 'page_exit')
      .limit(100)
    
    const exitPages: Record<string, number> = {}
    dropoffs?.forEach((row: any) => {
      const page = row.page_url || 'unknown'
      exitPages[page] = (exitPages[page] || 0) + 1
    })
    
    const topDropoff = Object.entries(exitPages)
      .sort(([, a], [, b]) => b - a)[0]
    
    return NextResponse.json({
      success: true,
      conversionRate,
      topDropoffPage: topDropoff ? { page: topDropoff[0], count: topDropoff[1] } : null,
      recommendations: conversionRate.rate < 0.05 ? [
        'Add testimonials to landing page',
        'Reduce signup friction',
        'Offer free trial'
      ] : ['Monitor and maintain']
    })
  } catch (error) {
    console.error('Conversion optimization error:', error)
    return NextResponse.json({ error: 'Failed to optimize' }, { status: 500 })
  }
}

