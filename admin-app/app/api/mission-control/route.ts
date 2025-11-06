import { NextRequest, NextResponse } from 'next/server'
import { getRealMetrics } from '../../../lib/metrics'

export async function GET(req: NextRequest) {
  try {
    // Try to get real metrics from database
    const realMetrics = await getRealMetrics()
    
    const missionStatus = {
      current: realMetrics && realMetrics.hasRealData ? {
        totalUsers: realMetrics.totalUsers,
        activeUsers: realMetrics.activeUsers,
        premiumUsers: realMetrics.premiumUsers,
        monthlyRevenue: realMetrics.monthlyRevenue,
        dailySignups: Math.floor(realMetrics.totalUsers / 30), // Estimate
        conversionRate: realMetrics.conversionRate,
        churnRate: 0.03 // Will calculate when we have historical data
      } : {
        // Fallback to demo data if database not setup
        totalUsers: 1247,
        activeUsers: 892,
        premiumUsers: 124,
        monthlyRevenue: 18400,
        dailySignups: 34,
        conversionRate: 0.12,
        churnRate: 0.03
      },
      target: {
        targetUsers: 10000,
        targetRevenue: 150000,
        targetConversion: 0.15,
        daysRemaining: 23
      },
      redLights: [] as Array<{ metric: string; current: number; target: number; solution: string }>
    }

    // Check for red lights
    if (missionStatus.current.totalUsers < missionStatus.target.targetUsers * 0.5) {
      missionStatus.redLights.push({
        metric: 'Users',
        current: missionStatus.current.totalUsers,
        target: missionStatus.target.targetUsers,
        solution: 'Email 5K from barrel racing list + activate partnerships'
      })
    }

    if (missionStatus.current.monthlyRevenue < missionStatus.target.targetRevenue * 0.5) {
      missionStatus.redLights.push({
        metric: 'Revenue',
        current: missionStatus.current.monthlyRevenue,
        target: missionStatus.target.targetRevenue,
        solution: 'Push upgrade campaigns to free users + business tier'
      })
    }

    const contacts = [
      { name: 'AQHA President', reason: 'Data partnership approval', priority: 'high' },
      { name: 'Taylor Sheridan', reason: 'Follow-up on Yellowstone integration', priority: 'high' },
      { name: 'Top 10 Barrel Racers', reason: 'Testimonial requests', priority: 'medium' }
    ]

    const plan = Array.from({length: 24}, (_, i) => ({
      time: new Date(Date.now() + i * 3600000).toISOString(),
      action: i === 8 ? 'Morning: Review metrics + Oracle AI consult' :
              i === 10 ? 'Call AQHA President' :
              i === 14 ? 'Send marketing campaign' :
              i === 17 ? 'Review user feedback' :
              'Monitor system + respond to leads'
    }))
    
    return NextResponse.json({
      success: true,
      status: { ...missionStatus, plan },
      contacts,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Mission control error:', error)
    return NextResponse.json({ error: 'Failed', details: error }, { status: 500 })
  }
}
