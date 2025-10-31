'use client'
import { useState } from 'react'

export default function VideoUploadPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [processing, setProcessing] = useState(false)
  const [insights, setInsights] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)

  const processVideo = async (videoUrl: string) => {
    setProcessing(true)
    setInsights(null)
    try {
      const res = await fetch('/api/video/process', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ videoUrl, intervalSeconds: 5, maxFrames: 10 }) })
      const data = await res.json()
      setInsights(data)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) processVideo(URL.createObjectURL(file))
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '30px' }}>Video Upload & Analysis</h1>
      <div onDragOver={(e) => { e.preventDefault(); setDragActive(true) }} onDragLeave={() => setDragActive(false)} onDrop={handleDrop} style={{ border: `2px dashed ${dragActive ? '#0f0' : '#ccc'}`, padding: '40px', textAlign: 'center', borderRadius: '8px', marginBottom: '20px' }}>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>Drag & drop video file here</p>
        <input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && processVideo(URL.createObjectURL(e.target.files[0]))} style={{ marginBottom: '20px' }} />
        <div style={{ marginTop: '30px' }}>
          <input type="text" placeholder="Or paste YouTube URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} style={{ padding: '10px', width: '400px', marginRight: '10px' }} />
          <button onClick={() => youtubeUrl && processVideo(youtubeUrl)} disabled={processing} style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px' }}>Analyze</button>
        </div>
      </div>
      {processing && <div style={{ padding: '20px', textAlign: 'center', fontSize: '18px' }}>Analyzing video...</div>}
      {insights && <div style={{ marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Extracted Insights:</h2>
        <p>Frames: {insights.frameCount}</p>
        {insights.frames?.map((f: any, i: number) => <div key={i} style={{ marginTop: '10px' }}>Frame {i + 1}: {f.url || 'Processed'}</div>)}
      </div>}
    </div>
  )
}
