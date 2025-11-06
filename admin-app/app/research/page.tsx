'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ResearchControl() {
  const [topic, setTopic] = useState('')
  const [status, setStatus] = useState('')
  const [gaps, setGaps] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const addResearchTopic = async () => {
    setLoading(true)
    setStatus('Researching ' + topic + '...')
    
    try {
      const res = await fetch('http://localhost:3000/api/research/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })
      const data = await res.json()
      setStatus('✅ Research complete! Stored in knowledge base.')
      setTopic('')
    } catch (error) {
      setStatus('❌ Research failed: ' + error)
    }
    setLoading(false)
  }

  const analyzeGaps = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/gaps/identify')
      const data = await res.json()
      setGaps(data.gaps || [])
      setStatus(`Found ${data.gaps?.length || 0} knowledge gaps`)
    } catch (error) {
      setStatus('❌ Failed to analyze gaps')
    }
    setLoading(false)
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#0f0', padding: '20px' }}>
      <div style={{ borderBottom: '2px solid #0f0', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1>🔬 RESEARCH CONTROL PANEL</h1>
        <Link href="/" style={{ color: '#0ff', marginLeft: '20px' }}>← Back to Command Center</Link>
      </div>

      {/* Manual Research Input */}
      <div style={{ marginBottom: '40px', padding: '20px', border: '2px solid #0f0' }}>
        <h2>📝 Manual Research</h2>
        <p>Tell HorseGPT to research a specific topic and store it in the knowledge base.</p>
        <input 
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic (e.g., 'barrel racing turn techniques')"
          style={{ 
            width: '100%', 
            padding: '15px', 
            fontSize: '16px', 
            marginTop: '10px',
            background: '#111',
            color: '#0f0',
            border: '1px solid #0f0'
          }}
        />
        <button 
          onClick={addResearchTopic}
          disabled={!topic || loading}
          style={{ 
            padding: '15px 30px', 
            fontSize: '18px', 
            marginTop: '15px',
            background: '#0f0',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'RESEARCHING...' : '🔬 START RESEARCH'}
        </button>
        {status && <p style={{ marginTop: '15px', color: '#ff0' }}>{status}</p>}
      </div>

      {/* Gap Analysis */}
      <div style={{ marginBottom: '40px', padding: '20px', border: '2px solid #f00' }}>
        <h2>🎯 Knowledge Gaps</h2>
        <p>Identify what HorseGPT doesn't know well (low confidence answers, downvoted responses).</p>
        <button 
          onClick={analyzeGaps}
          disabled={loading}
          style={{ 
            padding: '15px 30px', 
            fontSize: '18px', 
            marginTop: '15px',
            background: '#f00',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'ANALYZING...' : '🔍 ANALYZE GAPS'}
        </button>
        
        {gaps.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Found {gaps.length} Gaps:</h3>
            {gaps.map((gap, i) => (
              <div key={i} style={{ 
                padding: '15px', 
                marginTop: '10px', 
                background: '#111',
                border: '1px solid #f00'
              }}>
                <strong>Topic:</strong> {gap.topic || gap.description}
                <br />
                <strong>Priority:</strong> {gap.priority} users affected
                <br />
                <strong>Source:</strong> {gap.source}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auto-Research Queue */}
      <div style={{ marginBottom: '40px', padding: '20px', border: '2px solid #0ff' }}>
        <h2>🤖 Autonomous Research Queue</h2>
        <p>HorseGPT automatically researches gaps and fills knowledge base.</p>
        <div style={{ marginTop: '15px', padding: '15px', background: '#111' }}>
          <p>✅ Gap Identifier: ACTIVE</p>
          <p>✅ Research Engine: ACTIVE</p>
          <p>✅ Knowledge Store: ACTIVE</p>
          <p>⏳ Auto-research runs every hour (or trigger manually above)</p>
        </div>
      </div>
    </div>
  )
}

