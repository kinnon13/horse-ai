'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { 
  ArrowRight,
  HelpCircle,
  Paperclip,
  Globe,
  BookOpen,
  Mic,
  ChevronDown,
  Building2
} from 'lucide-react'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with query:', query)
    if (query.trim()) {
      console.log('Redirecting to chat with query:', query.trim())
      // Redirect to chat page with the query
      router.push(`/chat?q=${encodeURIComponent(query.trim())}`)
    } else {
      console.log('Empty query, not redirecting')
    }
  }
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar - ChatGPT Style */}
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left Side - Logo */}
        <div className="flex items-center gap-3">
          <div className="w-20 h-20">
            <img src="/horsegpt-logo-transparent.png" alt="HorseGPT" className="w-full h-full" />
          </div>
          <span className="text-xl font-bold text-gray-900">HorseGPT</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
          <Link href="/auth/signin">
            <Button variant="outline" size="sm" className="text-gray-900 border-gray-300 hover:bg-gray-50">
              Log in
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800">
              Sign up for free
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Central Question */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
          What's on the agenda today?
        </h1>

        {/* Input Field */}
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mb-6">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about horses..."
              className="w-full px-6 py-4 pr-16 bg-gray-50 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:border-gray-300 transition-colors"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm text-gray-700">
            <Paperclip className="w-4 h-4" />
            <span>Attach</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm text-gray-700">
            <Globe className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm text-gray-700">
            <BookOpen className="w-4 h-4" />
            <span>Study</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm text-gray-700">
            <Mic className="w-4 h-4" />
            <span>Voice</span>
          </button>
          <Link href="/pricing" className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm text-gray-700">
            <Building2 className="w-4 h-4" />
            <span>For Businesses</span>
          </Link>
        </div>
      </div>

      {/* Footer - ChatGPT Style */}
      <div className="px-4 py-6">
        <p className="text-center text-sm text-gray-600">
          By messaging HorseGPT, you agree to our{' '}
          <Link href="/legal/terms" className="text-blue-600 hover:underline">
            Terms
          </Link>{' '}
          and have read our{' '}
          <Link href="/legal/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}