'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MapPin, Phone, Mail, Globe, Star, CheckCircle, Clock } from 'lucide-react'
import { Business } from './BusinessTypes'

interface BusinessCardProps {business: Business
  onContact: (business: Business) => void
}

export function BusinessCard({ business, onContact }: BusinessCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{business.business_name}</CardTitle>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{business.location}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {business.status === 'taking_clients' ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Taking Clients</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-xs">Not Taking Clients</span>
              </div>
            )}
            {business.rating && (
              <div className="flex items-center text-yellow-600">
                <Star className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{business.rating}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Services</h4>
            <div className="flex flex-wrap gap-2">
              {business.services.map((service) => (
                <span key={service} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {business.description && (
            <p className="text-gray-600 text-sm">{business.description}</p>
          )}

          <div className="space-y-2">
            {business.contact_info.phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">{business.contact_info.phone}</span>
              </div>
            )}
            {business.contact_info.email && (
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">{business.contact_info.email}</span>
              </div>
            )}
            {business.contact_info.website && (
              <div className="flex items-center text-gray-600">
                <Globe className="h-4 w-4 mr-2" />
                <span className="text-sm">{business.contact_info.website}</span>
              </div>
            )}
          </div>

          <Button
            onClick={() => onContact(business)}
            className="w-full"
            disabled={business.status === 'not_taking_clients'}
          >
            Contact Business
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

