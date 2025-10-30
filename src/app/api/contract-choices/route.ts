import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/contract-choices - Save contract choice
export async function POST(request: NextRequest) {
  try {
    const { user_id, context_type, selection } = await request.json()
    
    if (!user_id || !context_type || !selection) {
      return NextResponse.json({ error: 'User ID, context type, and selection required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('contract_choices')
      .insert({
        user_id,
        context_type,
        selection
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving contract choice:', error)
      return NextResponse.json({ error: 'Failed to save contract choice' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Contract choice saved successfully',
      choice: data 
    })
  } catch (error) {
    console.error('Error in POST /api/contract-choices:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/contract-choices - Get user's contract choices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('contract_choices')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching contract choices:', error)
      return NextResponse.json({ error: 'Failed to fetch contract choices' }, { status: 500 })
    }

    return NextResponse.json({ choices: data || [] })
  } catch (error) {
    console.error('Error in GET /api/contract-choices:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
