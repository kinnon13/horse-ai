import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are Horse.AI, an expert assistant for barrel racing, horse breeding, and equine data analysis. Provide helpful, accurate information about horses, breeding, events, and performance analytics. Be concise but informative.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        model: 'grok-4-latest',
        stream: false,
        temperature: 0.7
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Grok API error:', response.status, errorText)
      throw new Error(`Grok API error: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json({ message: data.choices[0].message.content })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 })
  }
}