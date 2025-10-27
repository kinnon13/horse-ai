'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Button } from '@/components/ui/Button'
import { 
  Send, 
  Loader2,
  Plus,
  Search,
  History,
  Crown,
  Zap,
  X,
  Upload,
  Menu,
  Settings,
  User,
  LogOut
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface UserProfile {
  subscription_tier: 'free' | 'mid' | 'pro'
  messages_used: number
  messages_limit: number
  last_reset: Date
}

interface UpsellPrompt {
  show: boolean
  tier: 'pro' | 'mid'
  message: string
}

const SAMPLE_QUERIES = [
  "What are the best breeding combinations for barrel racing?",
  "Who won the Pink Buckle last night?",
  "What events are coming up this weekend?",
  "How is my horse performing compared to others?",
  "What's the latest news in barrel racing?",
  "Find horses for sale in Texas",
  "What's the weather like for the NFR?",
  "Tell me about Dash Ta Fame's offspring"
]

export default function ChatPage() {
  const { user, loading } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    subscription_tier: 'free',
    messages_used: 0,
    messages_limit: 10,
    last_reset: new Date()
  })
  const [upsellPrompt, setUpsellPrompt] = useState<UpsellPrompt>({
    show: false,
    tier: 'pro',
    message: ''
  })
  const [showHistory, setShowHistory] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update user profile based on subscription tier
  useEffect(() => {
    if (user) {
      // Mock user profile - in real app, fetch from Supabase
      const mockProfile: UserProfile = {
        subscription_tier: 'free', // This would come from user data
        messages_used: 3,
        messages_limit: userProfile.subscription_tier === 'pro' ? 999 : 
                       userProfile.subscription_tier === 'mid' ? 50 : 10,
        last_reset: new Date()
      }
      setUserProfile(mockProfile)
    }
  }, [user])

  // Check if user has hit their limit
  const hasHitLimit = userProfile.messages_used >= userProfile.messages_limit

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    // Check message limits
    if (hasHitLimit) {
      setUpsellPrompt({
        show: true,
        tier: 'mid',
        message: "You've reached your message limit! Upgrade to get more messages."
      })
      return
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')
    setIsLoading(true)

    // Update message count
    const newCount = userProfile.messages_used + 1
    setUserProfile(prev => ({ ...prev, messages_used: newCount }))

    // Show upsell prompt before limit
    if (newCount === 9 && prev.subscription_tier === 'free') {
      setUpsellPrompt({
        show: true,
        tier: 'mid',
        message: "Last message! Get 50 more messages with Mid for just $9.99/mo!"
      })
    }

    try {
      // Call real Grok API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }
      
      const data = await response.json()
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSampleQuery = (query: string) => {
    sendMessage(query)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Handle file upload logic here
      console.log('File uploaded:', file.name)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading HorseGPT...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Welcome to HorseGPT</h1>
          <p className="text-gray-600 mb-6">
            ChatGPT for horses. Ask anything about barrel racing, breeding, training, and more.
          </p>
          <Button className="w-full">
            Sign In to Start Chatting
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* ChatGPT-style Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">H</span>
            </div>
            <h1 className="text-lg font-semibold">HorseGPT</h1>
          </div>
          <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Recent</div>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                Barrel Racing Tips
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                Horse Breeding Advice
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                Training Techniques
              </button>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.email}</div>
              <div className="text-xs text-gray-400 capitalize">{userProfile.subscription_tier}</div>
            </div>
            <button className="p-1 hover:bg-gray-800 rounded">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">HorseGPT</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{userProfile.messages_used}/{userProfile.messages_limit} messages</span>
              {userProfile.subscription_tier === 'free' && (
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🐴</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Welcome to HorseGPT</h3>
              <p className="text-gray-600 mb-6">Ask me anything about horses, barrel racing, breeding, training, and more!</p>
              
              {/* Sample Queries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {SAMPLE_QUERIES.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleQuery(query)}
                    className="p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🐴</span>
                  </div>
                )}
                <div
                  className={`max-w-3xl px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🐴</span>
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-gray-600">HorseGPT is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          {upsellPrompt.show && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Upgrade to {upsellPrompt.tier === 'pro' ? 'Pro' : 'Mid'}</h4>
                  <p className="text-blue-700 text-sm mb-3">{upsellPrompt.message}</p>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                      Pro - $19.99/mo
                    </button>
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium">
                      Mid - $9.99/mo
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setUpsellPrompt({ show: false, tier: 'pro', message: '' })}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask HorseGPT anything about horses..."
                className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                disabled={isLoading || hasHitLimit}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".csv,.xlsx,.pdf"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 hover:bg-gray-200 rounded"
                  disabled={isLoading}
                >
                  <Upload className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading || hasHitLimit}
              className="px-4 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            HorseGPT can make mistakes. Check important information.
          </div>
        </div>
      </div>
    </div>
  )
}