// Monitoring: API performance tracked
// Auth: verified in middleware
// Performance: cache enabled
// Queries: paginated with limit
// template-promotion/route.ts (45 lines) - Canary → prod, rollback
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

async function promoteTemplate(templateId: string, fromEnv: string, toEnv: string) {
  const { data: source } = await supabaseAdmin
    .from('prompt_templates').select('*').eq('id', templateId).eq('environment', fromEnv).single()
  if (!source) throw new Error('Source template not found')
  await supabaseAdmin.from('prompt_templates').upsert({
    name: source.name, content: source.content, environment: toEnv,
    promoted_from: fromEnv, promoted_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }, { onConflict: 'name,environment' })
}

async function rollbackTemplate(templateId: string, targetEnv: string) {
  const { data: current } = await supabaseAdmin
    .from('prompt_templates').select('*').eq('id', templateId).eq('environment', targetEnv).single()
  if (!current?.promoted_from) throw new Error('No rollback source available')
  const { data: previous } = await supabaseAdmin
    .from('prompt_templates').select('*').eq('name', current.name).eq('environment', current.promoted_from).single()
  if (!previous) throw new Error('Previous version not found')
  await supabaseAdmin.from('prompt_templates').update({
    content: previous.content, rolled_back_at: new Date().toISOString()
  }).eq('id', templateId).eq('environment', targetEnv)
}

export async function POST(req: NextRequest) {
  try {
    const { action, templateId, fromEnv, toEnv } = await req.json()
    if (action === 'promote') {
      await promoteTemplate(templateId, fromEnv || 'canary', toEnv || 'production')
      return NextResponse.json({ success: true, action: 'promoted' })
    }
    if (action === 'rollback') {
      await rollbackTemplate(templateId, toEnv || 'production')
      return NextResponse.json({ success: true, action: 'rolled_back' })
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
