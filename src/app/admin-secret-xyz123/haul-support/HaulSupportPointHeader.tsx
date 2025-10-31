import React from 'react'
import { HaulSupportPoint } from './HaulSupportTypes'
import { SAFETY_SCORE_COLORS, formatLocation } from './HaulSupportConstants'

interface HaulSupportPointHeaderProps {
  point: HaulSupportPoint
}

export function HaulSupportPointHeader({ point }: HaulSupportPointHeaderProps) {
  return (
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-900">{point.name}</h3>
      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
        <span>{point.type}</span>
        <span>{formatLocation(point.city, point.state)}</span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${SAFETY_SCORE_COLORS[point.safety_score as keyof typeof SAFETY_SCORE_COLORS]}`}>
          Safety: {point.safety_score}/5
        </span>
      </div>
    </div>
  )
}

