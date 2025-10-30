import React from 'react'

interface CalendarStatsProps {
  events: any[]
}

export function CalendarStats({ events }: CalendarStatsProps) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {events.filter(e => e.event_type === 'show_date').length}
          </div>
          <div className="text-sm text-gray-600">Shows</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {events.filter(e => e.event_type === 'entry_deadline').length}
          </div>
          <div className="text-sm text-gray-600">Deadlines</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {events.filter(e => e.event_type === 'reminder').length}
          </div>
          <div className="text-sm text-gray-600">Reminders</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {events.filter(e => e.event_type === 'haul_date').length}
          </div>
          <div className="text-sm text-gray-600">Travel</div>
        </div>
      </div>
    </div>
  )
}

