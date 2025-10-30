import React from 'react'
import { HaulSupportPoint } from './HaulSupportTypes'

interface HaulSupportPointFeaturesProps {
  point: HaulSupportPoint
}

export function HaulSupportPointFeatures({ point }: HaulSupportPointFeaturesProps) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {point.overnight_ok && <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Overnight OK</span>}
      {point.has_cameras && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Cameras</span>}
      {point.lit_at_night && <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Lit</span>}
      {point.has_hookups && <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Hookups</span>}
      {point.stall_available && <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">Stalls</span>}
      {point.emergency_ok && <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Emergency OK</span>}
    </div>
  )
}
