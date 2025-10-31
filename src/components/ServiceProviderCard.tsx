import React from 'react'
import { ServiceProvider } from '@/lib/HorseData.repo'

interface ServiceProviderCardProps {
  provider: ServiceProvider
  onSelect: (provider: ServiceProvider) => void
}

export function ServiceProviderCard({ provider, onSelect }: ServiceProviderCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{provider.name}</h3>
          <p className="text-gray-600 capitalize">{provider.service_type}</p>
          {provider.city && provider.state && (
            <p className="text-sm text-gray-500">
              📍 {provider.city}, {provider.state}
            </p>
          )}
          {provider.phone && (
            <p className="text-sm text-gray-500">📞 {provider.phone}</p>
          )}
          {provider.rating && (
            <p className="text-sm text-yellow-600">
              ⭐ {provider.rating}/5
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          {provider.verified && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              Verified
            </span>
          )}
          <button
            onClick={() => onSelect(provider)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  )
}

