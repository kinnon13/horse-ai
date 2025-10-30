import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DollarSign, Calendar, Users, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import { ProducerProfile, ProducerHorse, ProducerEvent } from './types'

interface ProducerStatsSectionProps {profile: ProducerProfile
  horses: ProducerHorse[]
  events: ProducerEvent[]
}

export function ProducerStatsSection({ profile, horses, events }: ProducerStatsSectionProps) {
  const upcomingEvents = events.filter(event => new Date(event.event_date) > new Date()).length
  const recentEvents = events.filter(event => {
    const eventDate = new Date(event.event_date)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return eventDate >= thirtyDaysAgo && eventDate <= new Date()
  }).length

  const stats = [{ label: 'Total Mares', value: profile.total_mares },
    { label: 'Total Stallions', value: profile.total_stallions },
    { label: 'Annual Foals', value: profile.annual_foals },
    { label: 'Horses Listed', value: horses.length }]

  const eventStats = [{ label: 'Upcoming Events', value: upcomingEvents, color: 'text-blue-600' },
    { label: 'Recent Events (30 days)', value: recentEvents, color: 'text-green-600' },
    { label: 'Total Events', value: events.length }]

  const statusItems = [{ label: 'Verified', status: profile.verified },
    { label: 'Featured', status: profile.featured },
    { label: 'Taking Clients', status: profile.taking_clients }]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Business Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <span className="font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {eventStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <span className={`font-semibold ${stat.color || ''}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                {item.status ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
            ))}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subscription</span>
              <span className="text-sm font-medium capitalize">{profile.subscription_tier}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
