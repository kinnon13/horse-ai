interface GrokMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface GrokResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

export class GrokAPI {
  private apiKey: string
  private apiUrl: string

  constructor() {
    this.apiKey = process.env.GROK_API_KEY!
    this.apiUrl = process.env.GROK_API_URL || 'https://api.x.ai/v1/chat/completions'
  }

  async query(messages: GrokMessage[]): Promise<string> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`Grok API error: ${response.statusText}`)
      }

      const data: GrokResponse = await response.json()
      return data.choices[0]?.message.content || 'No response from Grok'
    } catch (error) {
      console.error('Grok API error:', error)
      throw error
    }
  }

  async verifyHorseData(horseData: any): Promise<{
    verified: boolean
    corrections: string[]
    confidence: number
  }> {
    const systemPrompt = `You are an expert equine data auditor. Analyze horse data for accuracy and completeness. 
    Focus on: earnings verification, pedigree accuracy, breed standards, and data consistency.`
    
    const userPrompt = `Please verify this horse data and suggest any corrections:
    ${JSON.stringify(horseData, null, 2)}`

    const response = await this.query([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])

    // Parse the response (this would need more sophisticated parsing in production)
    return {
      verified: response.toLowerCase().includes('verified'),
      corrections: response.split('\n').filter(line => line.includes('correction')),
      confidence: 0.85 // This would be calculated from the response
    }
  }

  async getBreedingRecommendations(sire: string, dam: string): Promise<string> {
    const systemPrompt = `You are an expert equine breeding consultant. Provide detailed breeding recommendations based on pedigree analysis.`
    
    const userPrompt = `Analyze this breeding combination and provide recommendations:
    Sire: ${sire}
    Dam: ${dam}
    
    Consider: bloodline compatibility, performance potential, genetic diversity, and market trends.`

    return await this.query([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])
  }

  async analyzePerformanceTrends(horseData: any[]): Promise<string> {
    const systemPrompt = `You are an equine performance analyst. Analyze trends in horse performance data.`
    
    const userPrompt = `Analyze these performance trends:
    ${JSON.stringify(horseData, null, 2)}
    
    Provide insights on: performance patterns, improvement areas, and predictive indicators.`

    return await this.query([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])
  }
}
