'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  TrendingUp,
  DollarSign,
  Heart,
  Users,
  Award,
  Target,
  Calendar,
  Zap
} from 'lucide-react'

interface StallionPerformanceTrackerSectionProps {stallions: any[]
  loading: boolean
}

export default function StallionPerformanceTrackerSection({ 
  stallions, 
  loading 
}: StallionPerformanceTrackerSectionProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalStallions = stallions.length
  const totalBreedings = stallions.reduce((sum, stallion) => sum + (stallion.total_breedings || 0), 0)
  const totalSuccessfulBreedings = stallions.reduce((sum, stallion) => sum + (stallion.successful_breedings || 0), 0)
  const totalEarnings = stallions.reduce((sum, stallion) => sum + (stallion.performance_earnings || 0), 0)
  const averagePregnancyRate = stallions.length > 0 
    ? stallions.reduce((sum, stallion) => sum + (stallion.pregnancy_rate || 0), 0) / stallions.length 
    : 0
  const averageFoalRate = stallions.length > 0 
    ? stallions.reduce((sum, stallion) => sum + (stallion.foal_rate || 0), 0) / stallions.length 
    : 0

  const topPerformingStallion = stallions.reduce((top, stallion) => {
    return !top || stallion.performance_earnings > top.performance_earnings ? stallion : top
  }, null)

  const mostBredStallion = stallions.reduce((most, stallion) => {
    return !most || stallion.total_breedings > most.total_breedings ? stallion : most
  }, null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Total Stallions</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{totalStallions}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Total Breedings</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{totalBreedings}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Successful</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{totalSuccessfulBreedings}</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Total Earnings</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">${totalEarnings.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Avg Pregnancy Rate</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">{averagePregnancyRate.toFixed(1)}%</p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">Avg Foal Rate</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{averageFoalRate.toFixed(1)}%</p>
          </div>
        </div>

        {topPerformingStallion && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Top Performing Stallion</h3>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">{topPerformingStallion.stallion_name}</h4>
                  {topPerformingStallion.registered_name && (
                    <p className="text-sm text-gray-600">{topPerformingStallion.registered_name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-800">
                    ${topPerformingStallion.performance_earnings?.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-yellow-700">Total Earnings</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {mostBredStallion && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Most Bred Stallion</h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">{mostBredStallion.stallion_name}</h4>
                  {mostBredStallion.registered_name && (
                    <p className="text-sm text-gray-600">{mostBredStallion.registered_name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-800">
                    {mostBredStallion.total_breedings || 0}
                  </p>
                  <p className="text-sm text-green-700">Total Breedings</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

