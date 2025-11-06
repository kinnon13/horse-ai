'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase-client'

interface ChatSidebarProps {
  onNewChat: () => void
}

export function ChatSidebar({ onNewChat }: ChatSidebarProps) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<any[]>([])

  useEffect(() => {
    loadConversations()
  }, [user])

  const loadConversations = async () => {
    if (!user) {
      // Demo conversations for non-logged-in users
      setConversations([
        { id: 'demo1', title: 'Sign in to see history', date: 'Demo mode', demo: true }
      ])
      return
    }

    try {
      const { data, error } = await supabase
        .from('conversation_history')
        .select('id, title, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(10)

      if (error) throw error

      const formatted = (data || []).map(c => ({
        id: c.id,
        title: c.title || 'Untitled conversation',
        date: getRelativeTime(c.updated_at || c.created_at)
      }))

      setConversations(formatted.length > 0 ? formatted : [
        { id: 'empty', title: 'No conversations yet', date: 'Start chatting!', empty: true }
      ])
    } catch (error) {
      console.error('Error loading conversations:', error)
      setConversations([
        { id: 'demo1', title: 'Recent conversations', date: 'Loading...', demo: true }
      ])
    }
  }

  const getRelativeTime = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return then.toLocaleDateString()
  }

  const deleteConversation = async (id: string) => {
    if (!user) return
    
    try {
      await supabase
        .from('conversation_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
      
      setConversations(conversations.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
          HorseGPT
        </h1>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-xl font-semibold transition-all shadow-lg"
        >
          + New Chat
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="mb-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
            Menu
          </div>
          <Link href="/chat" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors mb-1">
            <span className="mr-3">💬</span>
            <span>Chat</span>
          </Link>
          <Link href="/horses" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors mb-1">
            <span className="mr-3">🐴</span>
            <span>My Horses</span>
          </Link>
          <Link href="/business/dashboard" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors mb-1">
            <span className="mr-3">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/competitions" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors mb-1">
            <span className="mr-3">🏆</span>
            <span>Competitions</span>
          </Link>
          <Link href="/breeding" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors mb-1">
            <span className="mr-3">🧬</span>
            <span>Breeding</span>
          </Link>
        </div>

        {/* Chat History */}
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
            Recent Chats
          </div>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors mb-1 group relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 cursor-pointer">
                  <div className="text-sm truncate">{conv.title}</div>
                  <div className="text-xs text-gray-500">{conv.date}</div>
                </div>
                {!conv.demo && !conv.empty && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Delete this conversation?')) {
                        deleteConversation(conv.id)
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 ml-2 text-gray-500 hover:text-red-400 transition-opacity"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-gray-700">
        <Link href="/settings" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          <span className="mr-3">⚙️</span>
          <span>Settings</span>
        </Link>
        <Link href="/pricing" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          <span className="mr-3">💎</span>
          <span>Upgrade</span>
        </Link>
      </div>
    </div>
  )
}

