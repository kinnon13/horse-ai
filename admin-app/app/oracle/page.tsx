'use client'

import { useState } from 'react'

export default function OracleChat() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  
  const ask = async () => {
    const res = await fetch('/api/oracle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    })
    const data = await res.json()
    setAnswer(data.answer)
  }
  
  return (
    <div style={{ padding: '50px', background: '#000', color: '#0ff', minHeight: '100vh' }}>
      <h1>🔮 ORACLE AI ADVISOR</h1>
      <textarea 
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask Oracle anything..."
        style={{ width: '100%', height: '100px', padding: '10px', fontSize: '16px', marginTop: '20px' }}
      />
      <button onClick={ask} style={{ padding: '15px 30px', fontSize: '18px', marginTop: '10px' }}>
        ASK ORACLE
      </button>
      {answer && (
        <div style={{ marginTop: '30px', padding: '20px', border: '2px solid #0ff' }}>
          <strong>ORACLE:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}
