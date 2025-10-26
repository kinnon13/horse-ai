'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Star,
  Shield,
  CheckCircle
} from 'lucide-react'

interface MarketplaceItem {
  id: string
  title: string
  description: string
  price: number
  location: string
  category: 'horse' | 'equipment' | 'services' | 'breeding'
  verified: boolean
  images: string[]
  seller: {
    name: string
    rating: number
    verified: boolean
  }
  createdAt: string
}

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [items, setItems] = useState<MarketplaceItem[]>([
    {
      id: '1',
      title: 'Dash Ta Fame Colt - 2 Year Old',
      description: 'Beautiful 2-year-old colt by Dash Ta Fame, ready for training. Excellent bloodlines, great conformation.',
      price: 15000,
      location: 'Texas, USA',
      category: 'horse',
      verified: true,
      images: ['/placeholder-horse.jpg'],
      seller: {
        name: 'Elite Quarter Horses',
        rating: 4.9,
        verified: true
      },
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Professional Barrel Racing Saddle',
      description: 'Custom-made barrel racing saddle, used by professional riders. Excellent condition.',
      price: 2500,
      location: 'Oklahoma, USA',
      category: 'equipment',
      verified: true,
      images: ['/placeholder-saddle.jpg'],
      seller: {
        name: 'Racing Equipment Pro',
        rating: 4.8,
        verified: true
      },
      createdAt: '2024-01-14'
    }
  ])

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'horse', name: 'Horses' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'services', name: 'Services' },
    { id: 'breeding', name: 'Breeding' }
  ]

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Horse.AI Marketplace</h1>
          <p className="text-gray-600">Buy, sell, and trade horses, equipment, and services with verified sellers</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search horses, equipment, services..."
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
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Verified Listings</p>
                  <p className="text-2xl font-bold text-green-600">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">AI Verified</p>
                  <p className="text-2xl font-bold text-blue-600">98.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Avg Rating</p>
                  <p className="text-2xl font-bold text-purple-600">4.8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Total Value</p>
                  <p className="text-2xl font-bold text-orange-600">$2.4M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={item.images[0] || '/placeholder.jpg'}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                {item.verified && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <span className="text-lg font-bold text-primary-600">
                    ${item.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{item.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.seller.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500">{item.seller.rating}</span>
                        {item.seller.verified && (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Listing Button */}
        <div className="fixed bottom-6 right-6">
          <Button className="rounded-full p-4 shadow-lg">
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
