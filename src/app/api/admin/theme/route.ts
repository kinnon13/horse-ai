import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('ui_config')
      .select('key, value')
      .in('category', ['theme', 'branding', 'content'])

    if (error) throw error

    // Transform to theme object
    const theme: Record<string, any> = {}
    const items = data || []
    items.forEach((item: any) => {
      const key = item.key.replace(/_/g, '').replace('color', 'Color').replace('family', 'Family')
      theme[key] = item.value?.color || item.value?.font || item.value?.text || item.value
    })

    return NextResponse.json({ theme })
  } catch (error) {
    console.error('Theme load error:', error)
    return NextResponse.json({ 
      theme: {
        primaryColor: '#0ea5e9',
        secondaryColor: '#f59e0b',
        fontFamily: 'Inter'
      }
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { theme } = await req.json()

    // Save each theme property to ui_config
    const updates = [
      { key: 'primary_color', value: { color: theme.primaryColor }, type: 'color', category: 'theme', label: 'Primary Color' },
      { key: 'secondary_color', value: { color: theme.secondaryColor }, type: 'color', category: 'theme', label: 'Secondary Color' },
      { key: 'font_family', value: { font: theme.fontFamily }, type: 'text', category: 'theme', label: 'Font Family' },
      { key: 'site_name', value: { text: theme.siteName }, type: 'text', category: 'branding', label: 'Site Name' },
      { key: 'hero_headline', value: { text: theme.heroHeadline }, type: 'text', category: 'content', label: 'Hero Headline' },
      { key: 'chat_placeholder', value: { text: theme.chatPlaceholder }, type: 'text', category: 'content', label: 'Chat Placeholder' }
    ]

    for (const update of updates) {
      const { error } = await supabase
        .from('ui_config')
        .upsert({
          ...update,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        })

      if (error) {
        console.error('Failed to save', update.key, error)
      }
    }

    return NextResponse.json({ success: true, message: 'Theme saved successfully!' })
  } catch (error) {
    console.error('Theme save error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save theme' 
    }, { status: 500 })
  }
}

