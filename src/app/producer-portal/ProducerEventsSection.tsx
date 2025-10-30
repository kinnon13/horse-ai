import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Calendar, MapPin, Edit, Trash2 } from 'lucide-react'
import { ProducerEvent } from './types'

interface ProducerEventsSectionProps {events: ProducerEvent[]
}

export function ProducerEventsSection({ events }: ProducerEventsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Events ({events.length})</span>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No events scheduled yet.</p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Event
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{event.event_name}</h3>
                    
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {event.event_type}
                        </span>
                      </div>
                    </div>

                    {event.location && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}

                    {event.description && (
                      <p className="mt-2 text-sm text-gray-600">{event.description}</p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

