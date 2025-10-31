'use client'

import { useMissionControl } from './useMissionControl'

export default function MissionControl() {
  const status = useMissionControl()
  
  if (!status) return <div>Loading...</div>
  
  const { current, target, redLights, plan } = status.status
  
  return (
    <div style={{ padding: '20px', background: '#000', color: '#0f0', fontFamily: 'monospace' }}>
      <h1>🚀 MISSION: $1B VALUATION</h1>
      
      <div style={{ marginTop: '20px' }}>
        <div style={{ color: redLights.find((r: any) => r.metric === 'Users') ? '#f00' : '#0f0' }}>
          <h2>USERS: {current.totalUsers} / {target.targetUsers}</h2>
          {redLights.find((r: any) => r.metric === 'Users') && (
            <p>{redLights.find((r: any) => r.metric === 'Users').solution}</p>
          )}
        </div>
        
        <div style={{ color: redLights.find((r: any) => r.metric === 'Revenue') ? '#f00' : '#0f0' }}>
          <h2>REVENUE: ${current.monthlyRevenue} / ${target.targetRevenue}</h2>
          {redLights.find((r: any) => r.metric === 'Revenue') && (
            <p>{redLights.find((r: any) => r.metric === 'Revenue').solution}</p>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>📞 WHO TO CALL TODAY:</h2>
        {status.contacts.map((c: any) => (
          <div key={c.name}><strong>{c.name}</strong>: {c.reason}</div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>📅 HOURLY PLAN:</h2>
        {plan.slice(0, 10).map((p: any, i: number) => (
          <div key={i}>{new Date(p.time).getHours()}:00 — {p.action}</div>
        ))}
      </div>
    </div>
  )
}
