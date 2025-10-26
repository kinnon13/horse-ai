'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { 
  Heart, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Activity,
  Shield,
  TrendingUp
} from 'lucide-react'

interface HealthRecord {
  id: string
  type: 'vaccination' | 'injury' | 'checkup' | 'treatment'
  title: string
  description: string
  date: string
  vet: string
  cost: number
  status: 'completed' | 'pending' | 'overdue'
  aiPrediction?: string
}

interface GPSTrack {
  id: string
  date: string
  distance: number
  duration: number
  avgSpeed: number
  route: string
  notes: string
}

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    {
      id: '1',
      type: 'vaccination',
      title: 'Annual Vaccination',
      description: 'Core vaccines: EEE, WEE, Tetanus, West Nile',
      date: '2024-01-15',
      vet: 'Dr. Sarah Johnson',
      cost: 150,
      status: 'completed',
      aiPrediction: 'Next due: Jan 2025'
    },
    {
      id: '2',
      type: 'injury',
      title: 'Minor Lameness',
      description: 'Slight limp in front left leg, possible stone bruise',
      date: '2024-01-10',
      vet: 'Dr. Mike Chen',
      cost: 75,
      status: 'completed',
      aiPrediction: 'Monitor for 48 hours, likely to resolve'
    }
  ])

  const [gpsTracks, setGpsTracks] = useState<GPSTrack[]>([
    {
      id: '1',
      date: '2024-01-20',
      distance: 5.2,
      duration: 45,
      avgSpeed: 6.9,
      route: 'Morning Training Loop',
      notes: 'Good pace, horse felt strong'
    }
  ])

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'health', name: 'Health Records', icon: Heart },
    { id: 'gps', name: 'GPS Tracking', icon: MapPin },
    { id: 'predictions', name: 'AI Predictions', icon: TrendingUp }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccination': return Shield
      case 'injury': return AlertTriangle
      case 'checkup': return Heart
      case 'treatment': return CheckCircle
      default: return Heart
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health & Operations</h1>
          <p className="text-gray-600">Track health records, GPS rides, and get AI-powered predictions</p>
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Health Score</p>
                      <p className="text-2xl font-bold text-green-600">95%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Next Checkup</p>
                      <p className="text-2xl font-bold text-blue-600">15 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Total Miles</p>
                      <p className="text-2xl font-bold text-purple-600">247</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">AI Predictions</p>
                      <p className="text-2xl font-bold text-orange-600">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthRecords.slice(0, 3).map((record) => {
                    const Icon = getTypeIcon(record.type)
                    return (
                      <div key={record.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded-lg">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{record.title}</h4>
                          <p className="text-sm text-gray-600">{record.description}</p>
                          <p className="text-xs text-gray-500">{record.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                          {record.aiPrediction && (
                            <p className="text-xs text-blue-600 mt-1">{record.aiPrediction}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Health Records Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Health Records</h2>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Record
              </Button>
            </div>

            <div className="space-y-4">
              {healthRecords.map((record) => {
                const Icon = getTypeIcon(record.type)
                return (
                  <Card key={record.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Icon className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{record.title}</h3>
                            <p className="text-gray-600 mb-2">{record.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Date: {record.date}</span>
                              <span>Vet: {record.vet}</span>
                              <span>Cost: ${record.cost}</span>
                            </div>
                            {record.aiPrediction && (
                              <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <strong>AI Prediction:</strong> {record.aiPrediction}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* GPS Tracking Tab */}
        {activeTab === 'gps' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">GPS Tracking</h2>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Start Ride
              </Button>
            </div>

            <div className="space-y-4">
              {gpsTracks.map((track) => (
                <Card key={track.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <MapPin className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{track.route}</h3>
                          <p className="text-gray-600">{track.notes}</p>
                          <p className="text-sm text-gray-500">{track.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-primary-600">{track.distance} mi</p>
                            <p className="text-xs text-gray-500">Distance</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-primary-600">{track.duration} min</p>
                            <p className="text-xs text-gray-500">Duration</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-primary-600">{track.avgSpeed} mph</p>
                            <p className="text-xs text-gray-500">Avg Speed</p>
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

        {/* AI Predictions Tab */}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">AI Health Predictions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Injury Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Overall Risk</span>
                      <span className="text-green-600 font-semibold">Low (15%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Based on recent activity and health records, your horse shows low risk for injury.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Next Vaccination
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Due Date</span>
                      <span className="text-blue-600 font-semibold">Jan 15, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Days Remaining</span>
                      <span className="text-gray-600">15 days</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Annual vaccination due. Schedule with your vet to maintain optimal health.
                    </p>
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
