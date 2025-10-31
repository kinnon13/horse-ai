import { getCurrentMetrics, getRedLights, VALUATION_PATH } from './valuationTracker'

export async function generateDailyPlan() {
  const current = await getCurrentMetrics()
  const month = Math.floor((Date.now() - new Date('2024-12-01').getTime()) / (30 * 24 * 60 * 60 * 1000)) + 1
  const target = VALUATION_PATH[month - 1] || VALUATION_PATH[7]
  const redLights = getRedLights(current, target)
  const plan = []
  const now = new Date()
  for (let hour = 8; hour <= 20; hour++) {
    const time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour)
    if (redLights.find(r => r.metric === 'Users')) {
      plan.push({
        time: time.toISOString(),
        priority: 'HIGH',
        action: 'Email 100 leads from 80K list',
        goal: 'Drive signups'
      })
    }
    if (redLights.find(r => r.metric === 'Revenue')) {
      plan.push({
        time: time.toISOString(),
        priority: 'HIGH',
        action: 'Run A/B test on upgrade prompt',
        goal: 'Increase conversions'
      })
    }
  }
  return { current, target, redLights, plan }
}

export async function getContactRecommendations(redLights: any[]) {
  if (redLights.find(r => r.metric === 'Users')) {
    return [
      { name: 'PRCA President', reason: 'Can blast 20K rodeo athletes', priority: 1 },
      { name: 'WPRA President', reason: 'Can blast 10K barrel racers', priority: 2 },
      { name: 'AQHA President', reason: 'Can reach 50K Quarter Horse owners', priority: 3 }
    ]
  }
  return []
}

