import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ServiceProvider } from '@/lib/HorseData.repo'

interface ServiceDirectoryResultsListProps {
  vets: ServiceProvider[]
}

export function ServiceDirectoryResultsList({ vets }: ServiceDirectoryResultsListProps) {
  return (
    <div className="grid gap-4">
      {vets.map(vet => (
        <Card key={vet.id}>
          <CardHeader>
            <CardTitle>{vet.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{vet.city}, {vet.state}</p>
            <p>Phone: {vet.phone}</p>
            <p>Type: {vet.type}</p>
            {vet.verified && <p className="text-green-600">✓ Verified</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

