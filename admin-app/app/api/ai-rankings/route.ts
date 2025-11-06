import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { data: rankings, error } = await supabase
      .from('ai_provider_rankings')
      .select('*')
      .order('accuracy', { ascending: false })

    if (error) throw error

    return NextResponse.json({ rankings: rankings || [] })
  } catch (error) {
    console.error('AI rankings error:', error)
    // Mock data fallback
    return NextResponse.json({
      rankings: [
        { provider: 'grok', accuracy: 0.94, total_queries: 4521, avg_confidence: 0.89 },
        { provider: 'openai', accuracy: 0.91, total_queries: 3890, avg_confidence: 0.87 },
        { provider: 'gemini', accuracy: 0.88, total_queries: 2340, avg_confidence: 0.85 },
        { provider: 'perplexity', accuracy: 0.86, total_queries: 1890, avg_confidence: 0.83 }
      ],
      demo: true
    })
  }
}

