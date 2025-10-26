'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { 
  MessageCircle, 
  Users, 
  Heart, 
  Share2, 
  Search,
  Filter,
  Plus,
  Star,
  MapPin,
  Calendar
} from 'lucide-react'

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    verified: boolean
    location: string
  }
  category: 'breeding' | 'training' | 'health' | 'equipment' | 'events'
  likes: number
  comments: number
  createdAt: string
  tags: string[]
}

interface UserMatch {
  id: string
  name: string
  avatar: string
  location: string
  interests: string[]
  horses: string[]
  compatibility: number
  lastActive: string
}

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('forums')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: '1',
      title: 'Best Breeding Combinations for Barrel Racing',
      content: 'Looking for advice on breeding combinations that produce successful barrel racing horses. Any recommendations?',
      author: {
        name: 'Sarah Johnson',
        avatar: '/placeholder-avatar.jpg',
        verified: true,
        location: 'Texas, USA'
      },
      category: 'breeding',
      likes: 24,
      comments: 8,
      createdAt: '2024-01-20',
      tags: ['breeding', 'barrel-racing', 'quarter-horse']
    },
    {
      id: '2',
      title: 'Training Tips for Young Horses',
      content: 'Sharing some techniques that have worked well for training 2-3 year old horses. What methods do you use?',
      author: {
        name: 'Mike Chen',
        avatar: '/placeholder-avatar.jpg',
        verified: true,
        location: 'Oklahoma, USA'
      },
      category: 'training',
      likes: 18,
      comments: 12,
      createdAt: '2024-01-19',
      tags: ['training', 'young-horses', 'techniques']
    }
  ])

  const [userMatches, setUserMatches] = useState<UserMatch[]>([
    {
      id: '1',
      name: 'Jessica Martinez',
      avatar: '/placeholder-avatar.jpg',
      location: 'California, USA',
      interests: ['barrel-racing', 'breeding', 'training'],
      horses: ['Dash Ta Fame', 'First Down Dash'],
      compatibility: 95,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Tom Wilson',
      avatar: '/placeholder-avatar.jpg',
      location: 'Texas, USA',
      interests: ['quarter-horse', 'breeding', 'performance'],
      horses: ['Sudden Fame', 'Dash For Cash'],
      compatibility: 87,
      lastActive: '1 day ago'
    }
  ])

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'breeding', name: 'Breeding' },
    { id: 'training', name: 'Training' },
    { id: 'health', name: 'Health' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'events', name: 'Events' }
  ]

  const tabs = [
    { id: 'forums', name: 'Forums', icon: MessageCircle },
    { id: 'matches', name: 'Matches', icon: Users },
    { id: 'events', name: 'Events', icon: Calendar }
  ]

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Horse.AI Community</h1>
          <p className="text-gray-600">Find riders, breeders, and horse owners near you (Coming Soon)</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Forums Tab */}
        {activeTab === 'forums' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Post
                  </Button>
                </div>
              </div>
            </div>

            {/* Forum Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            {post.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span>By {post.author.name}</span>
                          {post.author.verified && (
                            <span className="text-green-600">✓ Verified</span>
                          )}
                          <span>{post.author.location}</span>
                          <span>{post.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{post.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Share</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Find Your Perfect Match</h2>
              <Button className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter Matches
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userMatches.map((match) => (
                <Card key={match.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
                      <h3 className="font-semibold text-lg">{match.name}</h3>
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4" />
                        {match.location}
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{match.compatibility}% Match</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-1">Interests</h4>
                        <div className="flex flex-wrap gap-1">
                          {match.interests.map((interest, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-1">Horses</h4>
                        <div className="flex flex-wrap gap-1">
                          {match.horses.map((horse, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-xs rounded">
                              {horse}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-xs text-gray-500">Active {match.lastActive}</span>
                        <Button size="sm">Connect</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Event
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Barrel Racing Championship</h3>
                      <p className="text-gray-600 mb-3">Annual championship event featuring top barrel racing horses</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Feb 15, 2024</span>
                        <span>Houston, TX</span>
                        <span>150 attendees</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Breeding Seminar</h3>
                      <p className="text-gray-600 mb-3">Learn about advanced breeding techniques and bloodline analysis</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Mar 2, 2024</span>
                        <span>Oklahoma City, OK</span>
                        <span>75 attendees</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
