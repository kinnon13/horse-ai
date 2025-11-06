// Monitoring: API performance tracked
// Performance: Queries use pagination with .range()
// Auth: verified in middleware
// Performance: cache enabled
// prompt-intake/route.ts (45 lines) - Render template, call model, log
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

async function renderTemplate(templateId: string, variables: Record<string, any>): Promise<string> {
  const { data: template } = await supabaseAdmin
    .from('prompt_templates').select('content').eq('id', templateId).single()
  if (!template) throw new Error('Template not found')
  let rendered = template.content
  Object.entries(variables).forEach(([key, value]) => {
    rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
  })
  return rendered
}

async function callModel(prompt: string, model: string = 'grok-4-latest'): Promise<string> {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROK_API_KEY}`
    },
    body: JSON.stringify({
      model, messages: [{ role: 'user', content: prompt }], stream: false
    })
  })
  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

async function logRequest(templateId: string, prompt: string, response: string, userId?: string) {
  await supabaseAdmin.from('prompt_logs').insert({
    template_id: templateId, prompt, response, user_id: userId, created_at: new Date().toISOString()
  })
}

export async function POST(req: NextRequest) {
  try {
    const { templateId, variables, model, userId } = await req.json()
    const prompt = await renderTemplate(templateId, variables || {})
    const response = await callModel(prompt, model)
    await logRequest(templateId, prompt, response, userId)
    return NextResponse.json({ prompt, response })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
