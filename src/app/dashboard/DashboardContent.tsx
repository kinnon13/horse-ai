// DashboardContent.tsx - User profile and dashboard UI
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { loadUserContext, UserContext } from '@/lib/hyperMemory'

export default function DashboardContent() {
  const { user } = useAuth()
  const [context, setContext] = useState<UserContext | null>(null)
  useEffect(() => { if (user?.id) loadUserContext(user.id).then(setContext) }, [user?.id])
  if (!context) return <div>Loading...</div>
  
  const stats = { q: context.conversations.length, h: context.horses.length, i: context.conversations.filter(c => c.metadata?.type === 'insight').length }
  const engagement = stats.q > 50 ? 'highly engaged! 🎯' : stats.q > 20 ? 'engaged! 👍' : 'getting started! 🌱'
  
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold">{context.user?.email?.split('@')[0] || 'User'}</h1>
        <p className="text-gray-600">{context.user?.email}</p>
        <p className="mt-2 text-green-600 font-semibold">You're {engagement}</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4"><div className="text-2xl font-bold">{stats.q}</div><div className="text-sm text-gray-600">Questions asked</div></div>
        <div className="bg-white rounded-lg shadow p-4"><div className="text-2xl font-bold">{stats.h}</div><div className="text-sm text-gray-600">Horses tracked</div></div>
        <div className="bg-white rounded-lg shadow p-4"><div className="text-2xl font-bold">{stats.i}</div><div className="text-sm text-gray-600">Insights</div></div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">My Horses</h2>
        <div className="grid grid-cols-3 gap-4">{context.horses.map(h => (
          <div key={h.id} className="border rounded p-4"><div className="w-full h-32 bg-gray-200 rounded mb-2"></div><div className="font-semibold">{h.name}</div><div className="text-sm text-gray-600">{h.sex} • {h.year || 'N/A'}</div></div>
        ))}</div>
        <Link href="/horses/new" className="mt-4 inline-block text-blue-600 hover:underline">+ Add Horse</Link>
      </div>
      {context.businesses.length > 0 && <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Businesses</h2>
        {context.businesses.map((b, i) => <div key={i} className="flex justify-between py-2 border-b"><span className="font-semibold">{b.business_name}</span><span className="text-gray-600">{b.service_type}</span></div>)}
      </div>}
      <div className="flex gap-4">
        <Link href="/chat" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Start Chat</Link>
        <Link href="/subscription" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Upgrade</Link>
      </div>
    </div>
  )
}
