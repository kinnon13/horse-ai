// API route - exempt from single-task audit
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { query, user_id } = await request.json()

    if (!query || !user_id) {
      return NextResponse.json({ error: 'Query and user_id are required' }, { status: 400 })
    }

    // Check user subscription tier
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user_id)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only allow Plus tier users to use web search
    if (user.subscription_tier !== 'plus') {
      return NextResponse.json({ 
        error: 'Web search is only available for Plus tier subscribers',
        upgradeRequired: true 
      }, { status: 403 })
    }

    // Use DuckDuckGo Instant Answer API for web search
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    
    const response = await fetch(searchUrl)
    const data = await response.json()

    // Extract relevant information
    const results = {
      abstract: data.Abstract,
      abstractText: data.AbstractText,
      abstractSource: data.AbstractSource,
      abstractURL: data.AbstractURL,
      answer: data.Answer,
      answerType: data.AnswerType,
      definition: data.Definition,
      definitionSource: data.DefinitionSource,
      definitionURL: data.DefinitionURL,
      relatedTopics: data.RelatedTopics?.slice(0, 5) || [],
      results: data.Results?.slice(0, 5) || []
    }

    return NextResponse.json({ 
      success: true, 
      results,
      query 
    })

  } catch (error) {
    console.error('Web search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}