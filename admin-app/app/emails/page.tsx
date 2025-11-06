'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/emails')
      const data = await res.json()
      setTemplates(data.templates || getDefaultTemplates())
      if (data.templates?.length > 0) {
        setSelectedTemplate(data.templates[0])
      }
    } catch (error) {
      const defaults = getDefaultTemplates()
      setTemplates(defaults)
      setSelectedTemplate(defaults[0])
    }
  }

  const getDefaultTemplates = () => [
    { 
      id: '1',
      name: 'welcome_email',
      subject: 'Welcome to HorseGPT!',
      html_template: '<h1>Welcome {{userName}}!</h1><p>Thanks for joining HorseGPT. We\'re excited to help you with all things horses!</p>',
      variables: [{name: 'userName', example: 'John'}]
    },
    { 
      id: '2',
      name: 'upgrade_prompt',
      subject: 'Unlock HorseGPT Pro',
      html_template: '<h1>Hi {{userName}},</h1><p>Upgrade to Pro for unlimited AI conversations, breeding analytics, and more!</p>',
      variables: [{name: 'userName', example: 'John'}]
    }
  ]

  const saveTemplate = async () => {
    if (!selectedTemplate) return

    try {
      const res = await fetch('http://localhost:3000/api/admin/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: selectedTemplate })
      })

      if (res.ok) {
        alert('✅ Template saved!')
        setEditing(false)
        loadTemplates()
      }
    } catch (error) {
      alert('❌ Save failed')
    }
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#0f0', padding: '20px' }}>
      <div style={{ borderBottom: '2px solid #0f0', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1>📧 EMAIL TEMPLATE EDITOR</h1>
        <Link href="/" style={{ color: '#0ff', marginLeft: '20px' }}>← Back to Command Center</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', gap: '20px' }}>
        {/* Template List */}
        <div style={{ border: '2px solid #0f0', padding: '15px' }}>
          <h3>Templates</h3>
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t)}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '10px',
                background: selectedTemplate?.id === t.id ? '#0f0' : '#111',
                color: selectedTemplate?.id === t.id ? '#000' : '#0f0',
                border: '1px solid #0f0',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: selectedTemplate?.id === t.id ? 'bold' : 'normal'
              }}
            >
              {t.name.replace(/_/g, ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Editor */}
        {selectedTemplate && (
          <div style={{ border: '2px solid #0f0', padding: '20px' }}>
            <h3>Edit Template</h3>

            <div style={{ marginTop: '20px', marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Subject Line</label>
              <input
                type="text"
                value={selectedTemplate.subject}
                onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                disabled={!editing}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#111',
                  color: '#0f0',
                  border: '1px solid #0f0',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>HTML Template</label>
              <textarea
                value={selectedTemplate.html_template}
                onChange={(e) => setSelectedTemplate({...selectedTemplate, html_template: e.target.value})}
                disabled={!editing}
                style={{
                  width: '100%',
                  height: '300px',
                  padding: '10px',
                  background: '#111',
                  color: '#0f0',
                  border: '1px solid #0f0',
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <strong>Available Variables:</strong>
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {(selectedTemplate.variables || []).map((v: any) => (
                  <span key={v.name} style={{ 
                    padding: '5px 10px', 
                    background: '#222', 
                    border: '1px solid #0f0',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {`{{${v.name}}}`}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  style={{ padding: '12px 24px', background: '#0f0', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✏️ EDIT
                </button>
              ) : (
                <>
                  <button
                    onClick={saveTemplate}
                    style={{ padding: '12px 24px', background: '#0f0', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    💾 SAVE
                  </button>
                  <button
                    onClick={() => { setEditing(false); loadTemplates() }}
                    style={{ padding: '12px 24px', background: '#f00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    CANCEL
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Preview */}
        {selectedTemplate && (
          <div style={{ border: '2px solid #0ff', padding: '20px' }}>
            <h3 style={{ color: '#0ff' }}>Preview</h3>
            <div style={{ 
              marginTop: '20px',
              background: '#fff',
              padding: '30px',
              borderRadius: '8px',
              color: '#000',
              fontFamily: 'Arial, sans-serif'
            }}>
              <div style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                <strong>Subject:</strong> {selectedTemplate.subject}
              </div>
              <div dangerouslySetInnerHTML={{ 
                __html: selectedTemplate.html_template.replace(/\{\{(\w+)\}\}/g, (match: string, key: string) => {
                  const variable = selectedTemplate.variables?.find((v: any) => v.name === key)
                  return variable?.example || key
                })
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

