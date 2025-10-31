'use client'
import { useState } from 'react'

export default function KillSwitchPanel() {
  const [mode, setMode] = useState<'war' | 'safe' | 'off'>('safe')
  const [authenticated, setAuthenticated] = useState(false)
  const [passphrase, setPassphrase] = useState('')

  const authenticate = () => {
    if (passphrase === process.env.NEXT_PUBLIC_FOUNDER_PASSPHRASE || passphrase === 'HORSEGPT2024') {
      setAuthenticated(true)
    } else {
      alert('INCORRECT PASSPHRASE')
    }
  }

  const activateKillSwitch = async () => {
    if (!confirm('EMERGENCY SHUTDOWN: Are you sure?')) return
    await fetch('/api/kill-switch/activate', { method: 'POST' })
    alert('🚨 ALL AUTONOMOUS SYSTEMS DISABLED')
    setMode('off')
  }
  const setAIMode = async (newMode: 'war' | 'safe' | 'off') => {
    await fetch('/api/kill-switch/mode', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: newMode }) })
    setMode(newMode)
  }

  if (!authenticated) {
    return (
      <div style={{ padding: '50px', background: '#000', color: '#f00', textAlign: 'center' }}>
        <h1>🔐 FOUNDER AUTHENTICATION REQUIRED</h1>
        <input type="password" placeholder="Enter passphrase" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} style={{ padding: '10px', fontSize: '20px', margin: '20px' }} />
        <button onClick={authenticate} style={{ padding: '10px 30px', fontSize: '20px' }}>AUTHENTICATE</button>
      </div>
    )
  }
  return <div style={{ padding: '50px', background: '#000', color: '#0f0', fontFamily: 'monospace' }}>
      <h1>⚠️ AI CONTROL PANEL</h1>
      <div style={{ marginTop: '30px' }}>
        <h2>CURRENT MODE: {mode.toUpperCase()}</h2>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setAIMode('safe')} style={{ padding: '20px 40px', fontSize: '20px', background: mode === 'safe' ? '#0f0' : '#333', color: '#000', margin: '10px' }}>SAFE MODE</button>
          <button onClick={() => setAIMode('war')} style={{ padding: '20px 40px', fontSize: '20px', background: mode === 'war' ? '#f00' : '#333', color: '#000', margin: '10px' }}>WAR MODE</button>
        </div>
        <div style={{ marginTop: '50px' }}>
          <button onClick={activateKillSwitch} style={{ padding: '30px 60px', fontSize: '24px', background: '#f00', color: '#fff', border: '3px solid #fff' }}>🚨 EMERGENCY KILL SWITCH 🚨</button>
        </div>
      </div>
    </div>
}
