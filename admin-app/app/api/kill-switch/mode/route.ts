import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { mode } = await req.json()
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  const config = {
    safe: {
      ai_mode: 'safe',
      auto_deploy_enabled: false,
      auto_code_gen_enabled: false,
      auto_sales_enabled: false,
      auto_data_acquisition_enabled: true
    },
    war: {
      ai_mode: 'war',
      auto_deploy_enabled: true,
      auto_code_gen_enabled: true,
      auto_sales_enabled: true,
      auto_data_acquisition_enabled: true
    },
    off: {
      ai_mode: 'off',
      auto_deploy_enabled: false,
      auto_code_gen_enabled: false,
      auto_sales_enabled: false,
      auto_data_acquisition_enabled: false
    }
  }

  const settings = config[mode as keyof typeof config]
  for (const [key, value] of Object.entries(settings)) {
    await supabase.from('system_config').upsert({ key, value })
  }
  return NextResponse.json({ success: true, mode })
}

