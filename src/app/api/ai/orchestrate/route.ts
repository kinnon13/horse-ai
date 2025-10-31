import { NextRequest, NextResponse } from 'next/server';
import { trackAIAccuracy, getTopRankedAI, getAIRankings } from '@/lib/aiRanking';
import { getAIResponse } from './routeHelpers';

export async function POST(request: NextRequest) {
  try {
    const { prompt, topic, userId } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }

    // Get top-ranked AI provider for this topic
    await getTopRankedAI(topic);
    
    const { response, provider } = await getAIResponse(prompt);

    // Track accuracy (will be updated based on user feedback)
    await trackAIAccuracy(provider, prompt, true, topic, userId);

    return NextResponse.json({
      response,
      provider,
      rankings: await getAIRankings(topic)
    });
  } catch (error) {
    console.error('Orchestration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
