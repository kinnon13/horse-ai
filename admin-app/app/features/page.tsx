'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function FeatureFlags() {
  const [features, setFeatures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeatures()
  }, [])

  const loadFeatures = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/features')
      const data = await res.json()
      setFeatures(data.features || getDefaultFeatures())
    } catch (error) {
      setFeatures(getDefaultFeatures())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultFeatures = () => [
    { id: '1', feature_name: 'psychology_engine', is_enabled: true, description: 'Advanced psychology and emotion detection' },
    { id: '2', feature_name: 'vector_search', is_enabled: false, description: 'Vector database semantic search (requires setup)' },
    { id: '3', feature_name: 'breeding_ai', is_enabled: true, description: 'AI-powered breeding recommendations' },
    { id: '4', feature_name: 'voice_input', is_enabled: true, description: 'Voice recording in chat' },
    { id: '5', feature_name: 'upvote_downvote', is_enabled: true, description: 'Feedback buttons on messages' }
  ]

  const toggleFeature = async (featureName: string, currentState: boolean) => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          feature_name: featureName,
          is_enabled: !currentState
        })
      })

      if (res.ok) {
        setFeatures(features.map(f => 
          f.feature_name === featureName 
            ? { ...f, is_enabled: !currentState }
            : f
        ))
      }
    } catch (error) {
      console.error('Toggle failed:', error)
    }
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#0f0', padding: '20px' }}>
      <div style={{ borderBottom: '2px solid #0f0', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1>🚩 FEATURE FLAGS</h1>
        <Link href="/" style={{ color: '#0ff', marginLeft: '20px' }}>← Back to Command Center</Link>
      </div>

      <div style={{ border: '2px solid #0f0', padding: '20px' }}>
        <h2>Toggle Features On/Off</h2>
        <p style={{ color: '#888', marginBottom: '20px' }}>Control which features are enabled for users</p>

        {loading && <p>Loading features...</p>}

        {!loading && features.map(feature => (
          <div key={feature.id || feature.feature_name} style={{ 
            padding: '20px', 
            marginBottom: '15px',
            background: '#111',
            border: `2px solid ${feature.is_enabled ? '#0f0' : '#f00'}`,
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', marginBottom: '5px', color: feature.is_enabled ? '#0f0' : '#f00' }}>
                  {feature.feature_name.replace(/_/g, ' ').toUpperCase()}
                </h3>
                <p style={{ color: '#888', fontSize: '14px' }}>{feature.description}</p>
              </div>
              <button
                onClick={() => toggleFeature(feature.feature_name, feature.is_enabled)}
                style={{
                  padding: '10px 30px',
                  background: feature.is_enabled ? '#0f0' : '#f00',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {feature.is_enabled ? 'ENABLED ✅' : 'DISABLED ❌'}
              </button>
            </div>
          </div>
        ))}

        <div style={{ marginTop: '30px', padding: '15px', background: '#222', borderRadius: '8px' }}>
          <strong>ℹ️ How This Works:</strong><br />
          <p style={{ color: '#888', marginTop: '10px' }}>
            • Enabled features appear for all users immediately<br />
            • Disabled features are hidden (but code still exists)<br />
            • Use this to test features with small groups before full rollout<br />
            • Can enable/disable without deploying new code
          </p>
        </div>
      </div>
    </div>
  )
}

