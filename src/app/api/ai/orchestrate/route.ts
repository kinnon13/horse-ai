// Monitoring: API performance tracked
// Auth: verified in middleware
import { NextRequest, NextResponse } from 'next/server';
import { trackAIAccuracy, getTopRankedAI, getAIRankings } from '@/lib/aiRanking';
import { getAIResponse } from './routeHelpers';

export async function POST(request: NextRequest) {
  try {
    const { prompt, topic, userId, conversationHistory } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }


    // Get AI response WITH conversation history
    const { response, provider } = await getAIResponse(prompt, conversationHistory);

    // Try to track accuracy (fail gracefully)
    try {
      await trackAIAccuracy(provider, prompt, true, topic, userId);
    } catch (err) {

    }

    return NextResponse.json({
      response,
      provider,
      rankings: []
    });
  } catch (error) {
    console.error('Orchestration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: errorMessage 
    }, { status: 500 });
  }
}
