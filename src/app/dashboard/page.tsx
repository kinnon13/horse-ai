'use client'

import React from 'react'
import { useAuth } from '../../components/AuthProvider'
import { Button } from '../../components/ui/Button'
import { 
  Database, 
  Upload, 
  Brain, 
  TrendingUp, 
  FileText,
  BarChart3,
  Mic,
  Send,
  Search,
  Edit,
  Grid3x3,
  Bookmark,
  Clock,
  ChevronDown,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DashboardStats {
  totalHorses: number
  totalEvents: number
  totalEarnings: number
  aiQueriesUsed: number
  aiQueriesLimit: number
  points: number
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalHorses: 0,
    totalEvents: 0,
    totalEarnings: 0,
    aiQueriesUsed: 0,
    aiQueriesLimit: 10,
    points: 0
  })

  useEffect(() => {
    // TODO: When Supabase is connected, fetch real data:
    // const fetchStats = async () => {
    //   const { data: horses } = await supabase.from('horses').select('count')
    //   const { data: events } = await supabase.from('events').select('count')
    //   // etc...
    // }
    
    // For now, we'll use mock data
    setStats({
      totalHorses: 12,
      totalEvents: 8,
      totalEarnings: 45000,
      aiQueriesUsed: 3,
      aiQueriesLimit: 10, // Match chat page limit
      points: 250
    })
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
        <Link href="/auth/signin">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Left Sidebar */}
      <div className="hidden md:flex w-16 border-r border-gray-200 flex-col items-center py-4">
        <div className="mb-8">
          <Database className="w-6 h-6 text-gray-900" />
        </div>
        <div className="flex flex-col gap-4">
          <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
          <Edit className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
          <div className="relative">
            <Grid3x3 className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <Bookmark className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
          <Clock className="w-5 h-5 text-blue-600 bg-blue-50 p-2 rounded-lg cursor-pointer" />
        </div>
        <div className="mt-auto">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            KP
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 relative min-h-screen">
        {/* Top Right - Private Badge */}
        <div className="absolute top-4 md:top-6 right-4 md:right-6 flex items-center gap-2 text-sm text-gray-600">
          <span>Private</span>
          <div className="w-5 h-5 rounded-full bg-gray-200"></div>
        </div>

        {/* Logo */}
        <div className="mb-8 md:mb-12 flex items-center gap-2">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
            <img src="/horsegpt-logo-transparent.png" alt="HorseGPT" className="w-full h-full object-contain" />
          </div>
           <h1 className="text-3xl md:text-4xl font-bold text-gray-900">HorseGPT</h1>
        </div>

        {/* Main Input Field */}
        <div className="w-full max-w-3xl mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask HorseGPT anything about horses..."
              className="w-full px-4 md:px-5 py-3 md:py-4 pr-24 md:pr-32 bg-gray-100 rounded-2xl text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 md:gap-2">
              <Mic className="w-4 h-4 md:w-5 md:h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <div className="hidden md:flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-white rounded-lg text-xs md:text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
                <Zap className="w-3 h-3 md:w-4 md:h-4" />
                <span>Auto</span>
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <Send className="w-4 h-4 md:w-5 md:h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8">
          <button className="flex items-center justify-center gap-2 px-3 md:px-5 py-2 md:py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors group">
            <Database className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-gray-900" />
            <span className="text-xs md:text-sm font-medium text-gray-700">DeepSearch</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 md:px-5 py-2 md:py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors group">
            <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-gray-900" />
            <span className="text-xs md:text-sm font-medium text-gray-700">Upload Data</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 md:px-5 py-2 md:py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors group">
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-gray-900" />
            <span className="text-xs md:text-sm font-medium text-gray-700">Reports</span>
            <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
          </button>
          <button className="flex items-center justify-center gap-2 px-3 md:px-5 py-2 md:py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors group">
            <Brain className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-gray-900" />
            <span className="text-xs md:text-sm font-medium text-gray-700">AI Chat</span>
            <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
          </button>
        </div>

        {/* Stats Overview - Minimal */}
        <div className="w-full max-w-3xl flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3 md:w-4 md:h-4" />
            <span>{stats.totalHorses} Horses</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span>${(stats.totalEarnings / 1000).toFixed(0)}K Earnings</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-3 h-3 md:w-4 md:h-4" />
            <span>{stats.aiQueriesUsed}/{stats.aiQueriesLimit} Queries</span>
          </div>
        </div>

        {/* Upgrade Prompt - Bottom Right - Always Visible */}
        <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 bg-gradient-to-br from-blue-900 to-blue-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-lg z-50 max-w-[280px] md:max-w-none">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
            <div>
              <h3 className="font-semibold text-base md:text-lg">Upgrade to HorseGPT Pro</h3>
              <p className="text-xs md:text-sm text-blue-100">Unlock extended capabilities</p>
            </div>
            <button className="w-full md:w-auto px-3 md:px-4 py-1.5 md:py-2 bg-white text-blue-900 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
