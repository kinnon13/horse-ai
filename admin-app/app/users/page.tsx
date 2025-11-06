'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function UserMonitoring() {
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, active: 0, premium: 0, atRisk: 0 })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    // Mock data for now - will connect to real API
    setStats({ total: 1247, active: 892, premium: 124, atRisk: 45 })
    setUsers([
      { id: '1', email: 'user@example.com', tier: 'free', lastActive: '2 hours ago', engagementScore: 85, churnRisk: 'low' },
      { id: '2', email: 'premium@example.com', tier: 'pro', lastActive: '1 day ago', engagementScore: 45, churnRisk: 'medium' },
      { id: '3', email: 'inactive@example.com', tier: 'free', lastActive: '7 days ago', engagementScore: 15, churnRisk: 'high' },
    ])
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#0f0', padding: '20px' }}>
      <div style={{ borderBottom: '2px solid #0f0', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1>👥 USER MONITORING</h1>
        <Link href="/" style={{ color: '#0ff', marginLeft: '20px' }}>← Back to Command Center</Link>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', border: '2px solid #0f0', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.total}</div>
          <div style={{ color: '#888' }}>Total Users</div>
        </div>
        <div style={{ padding: '20px', border: '2px solid #0f0', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0f0' }}>{stats.active}</div>
          <div style={{ color: '#888' }}>Active (7 days)</div>
        </div>
        <div style={{ padding: '20px', border: '2px solid #ff0', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ff0' }}>{stats.premium}</div>
          <div style={{ color: '#888' }}>Premium</div>
        </div>
        <div style={{ padding: '20px', border: '2px solid #f00', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f00' }}>{stats.atRisk}</div>
          <div style={{ color: '#888' }}>At Risk</div>
        </div>
      </div>

      {/* User List */}
      <div style={{ border: '2px solid #0f0', padding: '20px' }}>
        <h2>Recent Users</h2>
        {users.map(user => (
          <div key={user.id} style={{ 
            padding: '15px', 
            marginTop: '10px', 
            background: '#111',
            border: '1px solid #333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>{user.email}</strong>
              <div style={{ color: '#888', fontSize: '14px' }}>Last active: {user.lastActive}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: user.tier === 'pro' ? '#ff0' : '#888' }}>
                {user.tier.toUpperCase()}
              </div>
              <div style={{ fontSize: '12px' }}>
                Engagement: {user.engagementScore}/100
              </div>
              <div style={{ 
                fontSize: '12px',
                color: user.churnRisk === 'high' ? '#f00' : user.churnRisk === 'medium' ? '#ff0' : '#0f0'
              }}>
                Churn Risk: {user.churnRisk}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

