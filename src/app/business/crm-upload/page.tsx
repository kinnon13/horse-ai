'use client'

import { useState } from 'react'

export default function CRMUploadPage() {
  const [matchCount, setMatchCount] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/business/crm-upload', { method: 'POST', body: formData })
      const data = await response.json()
      setMatchCount(data.matchCount || 0)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Upload Customer List</h1>
      <p className="text-gray-600 mb-4">Upload your customer list (CSV/Excel)</p>
      <p className="text-sm text-gray-500 mb-6">We'll match customers with HorseGPT users</p>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
        <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} disabled={uploading} className="mb-4" />
        {uploading && <p className="text-blue-600">Processing...</p>}
      </div>
      {matchCount !== null && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-lg font-semibold text-green-800">Match count: {matchCount} customers already use HorseGPT</p>
        </div>
      )}
      <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700">Connect with them → Upgrade to Business</button>
    </div>
  )
}
