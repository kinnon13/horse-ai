'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ContentManager() {
  const [blocks, setBlocks] = useState<any[]>([])
  const [selectedBlock, setSelectedBlock] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadBlocks()
  }, [])

  const loadBlocks = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/content')
      const data = await res.json()
      setBlocks(data.blocks || getDefaultBlocks())
      if (data.blocks?.length > 0) {
        setSelectedBlock(data.blocks[0])
      }
    } catch (error) {
      const defaults = getDefaultBlocks()
      setBlocks(defaults)
      setSelectedBlock(defaults[0])
    }
  }

  const getDefaultBlocks = () => [
    { block_key: 'home_hero_title', content: { text: 'AI for Horse People' }, page: 'home', section: 'hero' },
    { block_key: 'home_hero_subtitle', content: { text: 'Your intelligent assistant for training, breeding, and care' }, page: 'home', section: 'hero' },
    { block_key: 'chat_welcome_title', content: { text: 'Hey there! I\'m HorseGPT' }, page: 'chat', section: 'welcome' },
    { block_key: 'chat_welcome_subtitle', content: { text: 'Your AI expert for all equine disciplines' }, page: 'chat', section: 'welcome' },
    { block_key: 'pricing_headline', content: { text: 'Choose Your Plan' }, page: 'pricing', section: 'hero' }
  ]

  const saveBlock = async () => {
    if (!selectedBlock) return

    setSaving(true)
    try {
      const res = await fetch('http://localhost:3000/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block: selectedBlock })
      })

      if (res.ok) {
        alert('✅ Content saved! Changes will appear on next page load.')
        loadBlocks()
      }
    } catch (error) {
      alert('❌ Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#0f0', padding: '20px' }}>
      <div style={{ borderBottom: '2px solid #0f0', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1>📝 CONTENT MANAGER</h1>
        <Link href="/" style={{ color: '#0ff', marginLeft: '20px' }}>← Back to Command Center</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Editor */}
        <div style={{ border: '2px solid #0f0', padding: '20px' }}>
          <h3>Content Blocks</h3>

          <div style={{ marginTop: '20px' }}>
            {blocks.map(block => (
              <button
                key={block.block_key}
                onClick={() => setSelectedBlock(block)}
                style={{
                  width: '100%',
                  padding: '15px',
                  marginBottom: '10px',
                  background: selectedBlock?.block_key === block.block_key ? '#0f0' : '#111',
                  color: selectedBlock?.block_key === block.block_key ? '#000' : '#0f0',
                  border: '1px solid #0f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>
                  {block.block_key.replace(/_/g, ' ').toUpperCase()}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
                  {block.page} / {block.section}
                </div>
              </button>
            ))}
          </div>

          {selectedBlock && (
            <div style={{ marginTop: '30px', padding: '20px', background: '#111', borderRadius: '8px' }}>
              <h4>Edit: {selectedBlock.block_key}</h4>
              <textarea
                value={selectedBlock.content.text || ''}
                onChange={(e) => setSelectedBlock({
                  ...selectedBlock, 
                  content: { ...selectedBlock.content, text: e.target.value }
                })}
                style={{
                  width: '100%',
                  height: '150px',
                  marginTop: '15px',
                  padding: '15px',
                  background: '#000',
                  color: '#0f0',
                  border: '2px solid #0f0',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
              <button
                onClick={saveBlock}
                disabled={saving}
                style={{
                  width: '100%',
                  marginTop: '15px',
                  padding: '15px',
                  background: '#0f0',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {saving ? 'SAVING...' : '💾 SAVE CONTENT'}
              </button>
            </div>
          )}
        </div>

        {/* Preview */}
        <div style={{ border: '2px solid #0ff', padding: '20px' }}>
          <h3 style={{ color: '#0ff' }}>Preview</h3>
          
          {selectedBlock && (
            <div style={{
              marginTop: '20px',
              background: '#fff',
              padding: '40px',
              borderRadius: '12px',
              color: '#000'
            }}>
              {selectedBlock.block_key.includes('title') || selectedBlock.block_key.includes('headline') ? (
                <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
                  {selectedBlock.content.text}
                </h1>
              ) : (
                <p style={{ fontSize: '20px', lineHeight: '1.6' }}>
                  {selectedBlock.content.text}
                </p>
              )}
            </div>
          )}

          <div style={{ marginTop: '20px', padding: '15px', background: '#111', borderRadius: '8px', color: '#ff0' }}>
            <strong>💡 TIP:</strong> Changes appear on next page load. For instant updates, refresh the user-facing app after saving.
          </div>
        </div>
      </div>
    </div>
  )
}

