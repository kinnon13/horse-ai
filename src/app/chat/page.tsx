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
  Upload
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
        tier: 'pro',
        message: `You've used all ${userProfile.messages_limit} messages. Upgrade to Pro for unlimited access!`
      })
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Update usage count
    setUserProfile(prev => {
      const newCount = prev.messages_used + 1
      
      // Trigger upsells at specific message counts
      if (newCount === 8 && prev.subscription_tier === 'free') {
        setUpsellPrompt({
          show: true,
          tier: 'pro',
          message: "You're almost at your limit! Upgrade to Pro for unlimited access to everything barrel racing!"
        })
      } else if (newCount === 9 && prev.subscription_tier === 'free') {
        setUpsellPrompt({
          show: true,
          tier: 'mid',
          message: "Last message! Get 50 more messages with Mid for just $9.99/mo!"
        })
      }
      
      return {
        ...prev,
        messages_used: newCount
      }
    })

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
    setInput(query)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Handle CSV file upload
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const csvData = event.target?.result as string
        // Send CSV to AI for processing
        sendMessage(`Upload CSV file: ${file.name}\n\n${csvData.substring(0, 500)}...`)
      }
      reader.readAsText(file)
    } else {
      sendMessage(`Uploaded file: ${file.name}`)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Allow testing without auth (temporary for development)
  const testUser = true // Set to false when ready for production

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Minimal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">🐴 Horse.AI</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {userProfile.messages_used}/{userProfile.messages_limit}
          </span>
          {userProfile.subscription_tier !== 'pro' && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Horse.AI</h2>
              <p className="text-gray-600 mb-8 text-center">Ask me anything about barrel racing, breeding, events, or horses</p>
              
              {/* Simple query suggestions */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-2xl">
                {SAMPLE_QUERIES.slice(0, 4).map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleQuery(query)}
                    className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl text-sm transition-all hover:shadow-sm border border-gray-200"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-6 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="bg-gray-100 rounded-2xl px-5 py-4 flex items-center">
                <Loader2 className="w-5 h-5 animate-spin mr-3 text-gray-600" />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 px-6 py-4">
          {upsellPrompt.show && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-blue-900">{upsellPrompt.message}</p>
                <button
                  onClick={() => setUpsellPrompt({ show: false, tier: 'pro', message: '' })}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  Pro - $19.99/mo
                </button>
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium">
                  Mid - $9.99/mo
                </button>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Horse.AI..."
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                rows={1}
                disabled={isLoading || hasHitLimit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || hasHitLimit}
              className="p-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              title="Upload CSV"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button 
              type="submit" 
              disabled={isLoading || !input.trim() || hasHitLimit}
              className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          
          {hasHitLimit && (
            <p className="text-xs text-gray-500 mt-3 text-center">
              You've used all {userProfile.messages_limit} messages. Upgrade for unlimited access!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
