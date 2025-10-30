import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { ProducerHorse } from './types'

interface ProducerHorsesSectionProps {horses: ProducerHorse[]
}

export function ProducerHorsesSection({ horses }: ProducerHorsesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Horses ({horses.length})</span>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Horse
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {horses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No horses added yet.</p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Horse
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {horses.map((horse) => (
              <div key={horse.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{horse.horse_name}</h3>
                    {horse.registered_name && (
                      <p className="text-gray-600 text-sm">{horse.registered_name}</p>
                    )}
                    
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-500">Breed:</span> {horse.breed}</div>
                      <div><span className="text-gray-500">Born:</span> {horse.year_born}</div>
                      <div><span className="text-gray-500">Sex:</span> {horse.sex}</div>
                      <div><span className="text-gray-500">Color:</span> {horse.color}</div>
                    </div>

                    {(horse.sire || horse.dam) && (
                      <div className="mt-2 text-sm">
                        {horse.sire && <div><span className="text-gray-500">Sire:</span> {horse.sire}</div>}
                        {horse.dam && <div><span className="text-gray-500">Dam:</span> {horse.dam}</div>}
                      </div>
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
