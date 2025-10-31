import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase-types'

async function getSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseClient()
  await supabase.from('system_config').upsert({
    key: 'kill_switch_active',
    value: true,
    updated_at: new Date().toISOString(),
    updated_by: 'FOUNDER'
  })
  await supabase.from('system_config').upsert([
    { key: 'ai_mode', value: 'off' },
    { key: 'auto_deploy_enabled', value: false },
    { key: 'auto_code_gen_enabled', value: false },
    { key: 'auto_sales_enabled', value: false },
    { key: 'auto_data_acquisition_enabled', value: false }
  ])
  return NextResponse.json({
    success: true,
    message: 'KILL SWITCH ACTIVATED'
  })
}

