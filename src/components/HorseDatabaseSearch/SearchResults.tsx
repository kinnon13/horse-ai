import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Trophy, DollarSign, Users, MapPin } from 'lucide-react'
import { HorseSearchResult } from './types'

interface SearchResultsProps {results: HorseSearchResult[]
  onHorseSelect: (horse: HorseSearchResult) => void
}

export function SearchResults({ results, onHorseSelect }: SearchResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No horses found matching your search criteria.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Search Results ({results.length})</h3>
      
      {results.map((horse) => (
        <Card key={horse.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold">{horse.name}</h4>
                {horse.registered_name && (
                  <p className="text-sm text-gray-600">{horse.registered_name}</p>
                )}
              </div>
              <Button size="sm" onClick={() => onHorseSelect(horse)}>
                Select
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Breed:</span> {horse.breed}
              </div>
              <div>
                <span className="text-gray-500">Born:</span> {horse.year_born}
              </div>
              <div>
                <span className="text-gray-500">Sex:</span> {horse.sex}
              </div>
              <div>
                <span className="text-gray-500">Color:</span> {horse.color}
              </div>
            </div>

            {(horse.sire || horse.dam) && (
              <div className="mt-3 pt-3 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {horse.sire && (
                    <div>
                      <span className="text-gray-500">Sire:</span> {horse.sire}
                    </div>
                  )}
                  {horse.dam && (
                    <div>
                      <span className="text-gray-500">Dam:</span> {horse.dam}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center gap-4 text-sm">
                {horse.stud_fee && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-gray-500">Stud Fee:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(horse.stud_fee)}
                    </span>
                  </div>
                )}
                
                {horse.offspring_count && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-500">Offspring:</span>
                    <span className="font-semibold">{horse.offspring_count}</span>
                  </div>
                )}
                
                {horse.earnings && (
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                    <span className="text-gray-500">Earnings:</span>
                    <span className="font-semibold">{formatCurrency(horse.earnings)}</span>
                  </div>
                )}
                
                {horse.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-500">{horse.location}</span>
                  </div>
                )}
              </div>
            </div>

            {horse.achievements && horse.achievements.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-1 mb-2">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">Achievements</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {horse.achievements.map((achievement, index) => (
                    <span
                      key={index}
                      className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

