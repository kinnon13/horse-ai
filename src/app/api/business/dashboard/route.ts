import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get business ID from query params (for MVP, later add auth)
    const businessId = request.nextUrl.searchParams.get('businessId')
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 })
    }

    // Get business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (businessError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Calculate overall rank
    const { data: allBusinesses } = await supabase
      .from('businesses')
      .select('id, business_name, ranking_score')
      .order('ranking_score', { ascending: false })

    const businessRanks = allBusinesses || []
    const overallRank = businessRanks.findIndex(b => b.id === business.id) + 1
    const totalBusinesses = businessRanks.length
    const percentile = Math.round((1 - (overallRank / totalBusinesses)) * 100)

    // Get category rank (same business_type)
    const { data: categoryBusinesses } = await supabase
      .from('businesses')
      .select('id, ranking_score')
      .eq('business_type', business.business_type)
      .order('ranking_score', { ascending: false })

    const categoryRank = (categoryBusinesses || []).findIndex(b => b.id === business.id) + 1

    // Get state rank
    const { data: stateBusinesses } = await supabase
      .from('businesses')
      .select('id, ranking_score')
      .eq('state', business.state)
      .order('ranking_score', { ascending: false })

    const stateRank = (stateBusinesses || []).findIndex(b => b.id === business.id) + 1

    // Get top 5 competitors (businesses ranked near you)
    const startIdx = Math.max(0, overallRank - 3)
    const competitors = businessRanks.slice(startIdx, startIdx + 5).map((b, idx) => ({
      business_name: b.business_name || 'Unknown Business',
      ranking_score: b.ranking_score || 0,
      rank: startIdx + idx + 1
    }))

    // Get match analytics
    const { data: matchData } = await supabase
      .from('search_matches')
      .select('clicked_business_id, converted')
      .contains('matched_business_ids', [business.id])
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    const matches = matchData || []
    const totalMatches = matches.length
    const totalClicks = matches.filter(m => m.clicked_business_id === business.id).length
    const totalConversions = matches.filter(m => m.clicked_business_id === business.id && m.converted).length
    const conversionRate = totalClicks > 0 ? Math.round((totalConversions / totalClicks) * 100) : 0

    // Get recent matches
    const { data: recentMatches } = await supabase
      .from('search_matches')
      .select('query_text, created_at, clicked_business_id, converted')
      .contains('matched_business_ids', [business.id])
      .order('created_at', { ascending: false })
      .limit(5)

    const formattedRecentMatches = (recentMatches || []).map(m => ({
      query_text: m.query_text,
      created_at: m.created_at,
      clicked: m.clicked_business_id === business.id,
      converted: m.clicked_business_id === business.id && m.converted
    }))

    // Return dashboard data
    return NextResponse.json({
      business: {
        id: business.id,
        business_name: business.business_name,
        ranking_score: business.ranking_score || 0,
        verified: business.verified || false,
        crm_uploaded: business.crm_uploaded || false,
        total_contacts_uploaded: business.total_contacts_uploaded || 0,
        verified_contacts_count: business.verified_contacts_count || 0,
        search_matches_30d: business.search_matches_30d || 0
      },
      rankings: {
        overall_rank: overallRank,
        total_businesses: totalBusinesses,
        category_rank: categoryRank,
        state_rank: stateRank,
        percentile
      },
      competitors,
      matches: {
        total_matches: totalMatches,
        total_clicks: totalClicks,
        total_conversions: totalConversions,
        conversion_rate: conversionRate
      },
      recentMatches: formattedRecentMatches
    })
  } catch (err) {
    console.error('Dashboard error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}

