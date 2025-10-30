import React from 'react'
import { HaulSupportStats } from './HaulSupportTypes'

interface HaulSupportStatsCardsProps {
  stats: HaulSupportStats
}

export function HaulSupportStatsCards({ stats }: HaulSupportStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalPoints}</div>
          <div className="text-sm text-gray-600">Total Points</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.approvedPoints}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.avgSafetyScore}</div>
          <div className="text-sm text-gray-600">Avg Safety</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalFeedback}</div>
          <div className="text-sm text-gray-600">Feedback</div>
        </div>
      </div>
    </div>
  )
}



