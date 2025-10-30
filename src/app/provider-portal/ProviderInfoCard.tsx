'use client'

import React from 'react'
import { ProviderProfileTypes } from './edit/ProviderProfileTypes'

interface ProviderInfoCardProps {provider: ProviderProfileTypes.Provider | null
  onEditProfile: () => void
}

export function ProviderInfoCard({ provider, onEditProfile }: ProviderInfoCardProps) {
  if (!provider) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Provider Profile Not Found</h2>
          <p className="text-gray-600 mb-4">You need to create a provider profile first.</p>
          <button
            onClick={onEditProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold">{provider.business_name || 'Unnamed Business'}</h2>
          <p className="text-gray-600">{provider.business_type || 'Individual'}</p>
        </div>
        <button
          onClick={onEditProfile}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
          <div className="space-y-1 text-sm text-gray-600">
            {provider.phone && <p>Phone: {provider.phone}</p>}
            {provider.email && <p>Email: {provider.email}</p>}
            {provider.website && (
              <p>
                Website: <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{provider.website}</a>
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">Services & Experience</h3>
          <div className="space-y-1 text-sm text-gray-600">
            {provider.services_offered && provider.services_offered.length > 0 && (
              <p>Services: {provider.services_offered.join(', ')}</p>
            )}
            {provider.service_areas && provider.service_areas.length > 0 && (
              <p>Areas: {provider.service_areas.join(', ')}</p>
            )}
            {provider.years_experience && (
              <p>Experience: {provider.years_experience} years</p>
            )}
          </div>
        </div>
      </div>

      {provider.description && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-600">{provider.description}</p>
        </div>
      )}

      {provider.certifications && provider.certifications.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-900 mb-2">Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {provider.certifications.map((cert, index) => (
              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            provider.is_verified 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {provider.is_verified ? 'Verified' : 'Pending Verification'}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Updated: {provider.updated_at ? new Date(provider.updated_at).toLocaleDateString() : 'Never'}
        </div>
      </div>
    </div>
  )
}