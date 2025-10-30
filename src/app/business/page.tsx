'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { Business } from './BusinessTypes'
import { MOCK_BUSINESSES } from './BusinessConstants'
import { BusinessSearch } from './BusinessSearch'
import { BusinessCard } from './BusinessCard'

function BusinessPageContent() {
  const { user } = useAuth()
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedService, setSelectedService] = useState('All')
  const searchParams = useSearchParams()

  useEffect(() => {
    const service = searchParams.get('service')
    if (service) {
      setSelectedService(service)
    }
  }, [searchParams])

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesService = selectedService === 'All' || business.services.includes(selectedService)
    return matchesSearch && matchesService
  })

  const handleContact = (business: Business) => {
    // Navigate to contact page or open modal
    console.log('Contact business:', business.business_name)
  }

  const handleAddBusiness = () => {
    // Navigate to add business page
    window.location.href = '/business/list'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <BusinessSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            onAddBusiness={handleAddBusiness}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {filteredBusinesses.length} businesses found
              </h2>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No businesses found matching your criteria.</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredBusinesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onContact={handleContact}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function BusinessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <BusinessPageContent />
    </Suspense>
  )
}