import { getSupabaseClient } from './oracleHelpers'

export async function getStrategicInsights() {
  const supabase = await getSupabaseClient()
  const { data: users } = await supabase.from('users').select('*')
  const { data: paid } = await supabase.from('users').select('*').eq('subscription_status', 'active')
  const { data: horses } = await supabase.from('horses_master').select('discipline')

  const disciplines = horses?.reduce((acc: any, h: any) => {
    const disc = h.discipline || 'unknown'
    acc[disc] = (acc[disc] || 0) + 1
    return acc
  }, {})

  return {
    users: { total: users?.length || 0, paid: paid?.length || 0 },
    disciplines: Object.entries(disciplines || {}).map(([d, c]) => ({ discipline: d, count: c }))
  }
}

export async function askOracle(question: string, context: any) {
  const systemPrompt = `Strategic advisor for HorseGPT ($1B goal). Users: ${context.users.total} (${context.users.paid} paid).`

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: question }]
    })
  })
  const data = await response.json()
  return data.choices[0].message.content
}
