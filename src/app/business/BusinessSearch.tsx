'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Search, Filter, Plus, Building2 } from 'lucide-react'
import { Business } from './BusinessTypes'

interface BusinessSearchProps {searchTerm: string
  setSearchTerm: (term: string) => void
  selectedService: string
  setSelectedService: (service: string) => void
  onAddBusiness: () => void
}

export function BusinessSearch({ searchTerm, setSearchTerm, selectedService, setSelectedService, onAddBusiness }: BusinessSearchProps) {
  const services = ['All', 'Training', 'Lessons', 'Horse Sales', 'Breeding', 'Veterinary', 'Farrier', 'Equipment', 'Boarding', 'Transportation', 'Event Planning', 'Photography']

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-6 w-6 mr-2 text-blue-600" />
          Business Directory
        </CardTitle>
        <p className="text-gray-600">Find horse-related businesses in your area</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {services.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filter by service type</span>
            </div>
            <Button onClick={onAddBusiness}>
              <Plus className="h-4 w-4 mr-2" />
              List Your Business
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

