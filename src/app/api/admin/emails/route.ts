import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('email_templates_dynamic')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error

    return NextResponse.json({ templates: data || [] })
  } catch (error) {
    console.error('Email templates load error:', error)
    return NextResponse.json({ templates: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { template } = await req.json()

    const { error } = await supabase
      .from('email_templates_dynamic')
      .upsert({
        name: template.name,
        subject: template.subject,
        html_template: template.html_template,
        variables: template.variables,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'name'
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email template save error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

