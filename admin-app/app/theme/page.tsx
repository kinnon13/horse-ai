'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ThemeEditor() {
  const [theme, setTheme] = useState({
    primaryColor: '#0ea5e9',
    secondaryColor: '#f59e0b',
    fontFamily: 'Inter',
    siteName: 'HorseGPT',
    heroHeadline: 'AI for Horse People',
    chatPlaceholder: 'Ask me anything about horses...'
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/theme')
      const data = await res.json()
      if (data.theme) {
        setTheme(data.theme)
      }
    } catch (error) {
      console.log('Using default theme')
    }
  }

  const saveTheme = async () => {
    setSaving(true)
    try {
      const res = await fetch('http://localhost:3000/api/admin/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme })
      })

      if (!res.ok) throw new Error('Save failed')

      setMessage('✅ Theme saved! Refresh main app to see changes.')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('❌ Save failed - Database may not be setup yet')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#0f0', padding: '20px' }}>
      <div style={{ borderBottom: '2px solid #0f0', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1>🎨 THEME EDITOR</h1>
        <Link href="/" style={{ color: '#0ff', marginLeft: '20px' }}>← Back to Command Center</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Editor */}
        <div style={{ border: '2px solid #0f0', padding: '20px' }}>
          <h2>Theme Settings</h2>
          
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Primary Color</label>
            <input 
              type="color"
              value={theme.primaryColor}
              onChange={(e) => setTheme({...theme, primaryColor: e.target.value})}
              style={{ width: '100%', height: '50px', border: '2px solid #0f0' }}
            />
            <span style={{ fontSize: '12px', color: '#888' }}>{theme.primaryColor}</span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Secondary Color (Gold)</label>
            <input 
              type="color"
              value={theme.secondaryColor}
              onChange={(e) => setTheme({...theme, secondaryColor: e.target.value})}
              style={{ width: '100%', height: '50px', border: '2px solid #0f0' }}
            />
            <span style={{ fontSize: '12px', color: '#888' }}>{theme.secondaryColor}</span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Font Family</label>
            <select 
              value={theme.fontFamily}
              onChange={(e) => setTheme({...theme, fontFamily: e.target.value})}
              style={{ width: '100%', padding: '10px', background: '#111', color: '#0f0', border: '1px solid #0f0' }}
            >
              <option value="Inter">Inter (Modern, Clean)</option>
              <option value="Roboto">Roboto (Google, Professional)</option>
              <option value="Poppins">Poppins (Friendly, Rounded)</option>
              <option value="Georgia">Georgia (Serif, Classic)</option>
              <option value="Courier New">Courier New (Monospace)</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Site Name</label>
            <input 
              type="text"
              value={theme.siteName}
              onChange={(e) => setTheme({...theme, siteName: e.target.value})}
              style={{ width: '100%', padding: '10px', background: '#111', color: '#0f0', border: '1px solid #0f0' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Hero Headline</label>
            <input 
              type="text"
              value={theme.heroHeadline}
              onChange={(e) => setTheme({...theme, heroHeadline: e.target.value})}
              style={{ width: '100%', padding: '10px', background: '#111', color: '#0f0', border: '1px solid #0f0' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Chat Placeholder</label>
            <input 
              type="text"
              value={theme.chatPlaceholder}
              onChange={(e) => setTheme({...theme, chatPlaceholder: e.target.value})}
              style={{ width: '100%', padding: '10px', background: '#111', color: '#0f0', border: '1px solid #0f0' }}
            />
          </div>

          {message && (
            <div style={{ 
              padding: '15px', 
              marginBottom: '20px', 
              background: message.includes('✅') ? '#0f4' : '#f04',
              color: '#000',
              borderRadius: '8px'
            }}>
              {message}
            </div>
          )}

          <button 
            onClick={saveTheme}
            disabled={saving}
            style={{ 
              width: '100%',
              padding: '15px',
              background: '#0f0',
              color: '#000',
              border: 'none',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {saving ? 'SAVING...' : '💾 SAVE & APPLY'}
          </button>
        </div>

        {/* Live Preview */}
        <div style={{ border: '2px solid #0ff', padding: '20px' }}>
          <h2 style={{ color: '#0ff' }}>Live Preview</h2>
          
          <div style={{ 
            marginTop: '20px',
            background: '#fff',
            padding: '40px',
            borderRadius: '12px',
            fontFamily: theme.fontFamily
          }}>
            <h1 style={{ 
              fontSize: '48px',
              fontWeight: 'bold',
              background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px'
            }}>
              {theme.heroHeadline}
            </h1>

            <p style={{ color: '#666', fontSize: '20px', marginBottom: '30px' }}>
              Your intelligent assistant for training, breeding, and care
            </p>

            <button style={{
              padding: '15px 30px',
              background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Try {theme.siteName}
            </button>

            <div style={{ marginTop: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '12px' }}>
              <input 
                type="text"
                placeholder={theme.chatPlaceholder}
                style={{
                  width: '100%',
                  padding: '15px',
                  border: `2px solid ${theme.primaryColor}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: theme.fontFamily
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', background: '#111', borderRadius: '8px', color: '#ff0' }}>
            <strong>⚠️ PREVIEW ONLY</strong><br />
            Click "SAVE & APPLY" to make changes live on main site.
          </div>
        </div>
      </div>
    </div>
  )
}

