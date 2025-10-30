import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { AthletePerformanceAnalyticsHeader } from './AthletePerformanceAnalyticsHeader'
import { AthletePerformanceAnalyticsLoading } from './AthletePerformanceAnalyticsLoading'
import { AthletePerformanceAnalyticsStats } from './AthletePerformanceAnalyticsStats'
import { AthletePerformanceAnalyticsTopHorse } from './AthletePerformanceAnalyticsTopHorse'
import { AthletePerformanceAnalyticsRecentEvents } from './AthletePerformanceAnalyticsRecentEvents'
import { useAthletePerformanceAnalyticsData } from './useAthletePerformanceAnalyticsData'

interface AthletePerformanceAnalyticsSectionProps {
  horses: any[]
  events: any[]
  loading: boolean
}

export default function AthletePerformanceAnalyticsSection({ 
  horses, 
  events, 
  loading 
}: AthletePerformanceAnalyticsSectionProps) {
  const analyticsData = useAthletePerformanceAnalyticsData(horses, events)

  if (loading) return <AthletePerformanceAnalyticsLoading />

  return (
    <Card>
      <AthletePerformanceAnalyticsHeader />
      <CardContent>
        <AthletePerformanceAnalyticsStats analyticsData={analyticsData} />
        
        <AthletePerformanceAnalyticsTopHorse topPerformingHorse={analyticsData.topPerformingHorse} />
        
        <AthletePerformanceAnalyticsRecentEvents recentEvents={analyticsData.recentEvents} />
      </CardContent>
    </Card>
  )
}