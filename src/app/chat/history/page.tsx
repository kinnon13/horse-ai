// TODO: Add try-catch - wrap async operations for production
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ChatHistory() {
  const [conversations, setConversations] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('knowledge_embeddings')
        .select('*').order('created_at', { ascending: false }).limit(50)
      setConversations(data || [])
      setLoading(false)
    })()
  }, [])
  
  const filtered = conversations.filter(c => 
    c.content?.toLowerCase().includes(search.toLowerCase()) ||
    c.horse_name?.toLowerCase().includes(search.toLowerCase())
  )
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Conversation History</h1>
      <input type="text" placeholder="Search conversations..." value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }} />
      {loading ? <p>Loading...</p> : filtered.map((conv) => (
        <div key={conv.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px' }}>
          <strong>{new Date(conv.created_at).toLocaleDateString()}</strong>
          {conv.horse_name && <span> • Horse: {conv.horse_name}</span>}
          <p>{conv.content?.substring(0, 100)}...</p>
          <button onClick={() => window.location.href = `/chat?continue=${conv.id}`}>
            Continue conversation
          </button>
        </div>
      ))}
    </div>
  )
}