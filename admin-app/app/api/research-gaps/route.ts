import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    // Get unanswered questions and low-confidence responses
    const { data: gaps } = await supabase
      .from('ai_accuracy_log')
      .select('question, topic, confidence')
      .or('was_correct.eq.false,confidence.lt.0.7')
      .order('created_at', { ascending: false })
      .limit(50)

    // Group by topic to identify gaps
    const gapsByTopic = (gaps || []).reduce((acc: any, gap) => {
      const topic = gap.topic || 'general'
      if (!acc[topic]) {
        acc[topic] = { topic, count: 0, questions: [] }
      }
      acc[topic].count++
      if (acc[topic].questions.length < 5) {
        acc[topic].questions.push(gap.question)
      }
      return acc
    }, {})

    const sortedGaps = Object.values(gapsByTopic)
      .sort((a: any, b: any) => b.count - a.count)

    return NextResponse.json({ gaps: sortedGaps })
  } catch (error) {
    console.error('Research gaps error:', error)
    // Mock data fallback
    return NextResponse.json({
      gaps: [
        { 
          topic: 'Nutrition', 
          count: 47, 
          questions: [
            'Best feed for senior horses?',
            'How much protein for barrel horses?',
            'Supplements for hoof health?'
          ]
        },
        { 
          topic: 'Health', 
          count: 32, 
          questions: [
            'Signs of Lyme disease?',
            'Colic prevention strategies?',
            'Vaccine schedules for foals?'
          ]
        }
      ],
      demo: true
    })
  }
}

