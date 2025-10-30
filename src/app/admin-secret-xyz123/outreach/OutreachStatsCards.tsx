import React from 'react'
import { OutreachStats } from './OutreachData'

interface OutreachStatsCardsProps {
  stats: OutreachStats
}

export function OutreachStatsCards({ stats }: OutreachStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalMessages}</div>
          <div className="text-sm text-gray-600">Total Messages</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingMessages}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.sentMessages}</div>
          <div className="text-sm text-gray-600">Sent</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.repliedMessages}</div>
          <div className="text-sm text-gray-600">Replied</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.responseRate}%</div>
          <div className="text-sm text-gray-600">Response Rate</div>
        </div>
      </div>
    </div>
  )
}