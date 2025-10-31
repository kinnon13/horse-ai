import { NextRequest, NextResponse } from 'next/server'
import { getStrategicInsights, askOracle } from './route.helpers'

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()
    const context = await getStrategicInsights()
    const answer = await askOracle(question, context)
    return NextResponse.json({ success: true, answer, context })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const insights = await getStrategicInsights()
    return NextResponse.json({ success: true, insights })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
