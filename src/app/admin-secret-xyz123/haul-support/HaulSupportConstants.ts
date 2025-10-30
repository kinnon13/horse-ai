export const HAUL_SUPPORT_TYPES = [
  { value: 'truck_stop', label: 'Truck Stop' },
  { value: 'rest_area', label: 'Rest Area' },
  { value: 'parking_lot', label: 'Parking Lot' },
  { value: 'fairgrounds', label: 'Fairgrounds' },
  { value: 'arena', label: 'Arena' },
  { value: 'other', label: 'Other' }
] as const

export const SAFETY_SCORE_COLORS = {
  1: 'bg-red-100 text-red-800',
  2: 'bg-orange-100 text-orange-800',
  3: 'bg-yellow-100 text-yellow-800',
  4: 'bg-blue-100 text-blue-800',
  5: 'bg-green-100 text-green-800'
} as const

export function formatSafetyScore(score: number): string {
  const colors = {
    1: 'text-red-600',
    2: 'text-orange-600',
    3: 'text-yellow-600',
    4: 'text-blue-600',
    5: 'text-green-600'
  }
  return colors[score as keyof typeof colors] || 'text-gray-600'
}

export function formatLocation(city: string, state: string): string {
  return `${city}, ${state}`
}



