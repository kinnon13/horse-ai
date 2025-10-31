// vision/route.ts (45 lines) - Image/video analysis using OpenAI Vision
import { NextRequest, NextResponse } from 'next/server'
import { analyzeImage, validateImageInput } from './helpers'

export async function POST(req: NextRequest) {
  try {
    const { image, prompt, userId } = await req.json()
    
    if (!image) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 })
    }
    
    const validation = validateImageInput(image)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    
    const analysisPrompt = prompt || 'Analyze this image focusing on equine features. Provide detailed observations about the horse, its condition, conformation, and any notable characteristics.'
    
    const result = await analyzeImage(image, analysisPrompt)
    
    return NextResponse.json({
      success: true,
      analysis: result,
      userId: userId || null,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('Vision API error:', error)
    return NextResponse.json({ error: error.message || 'Failed to analyze image' }, { status: 500 })
  }
}
