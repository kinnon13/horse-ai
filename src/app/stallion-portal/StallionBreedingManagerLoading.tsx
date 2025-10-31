import { StallionProfile } from './StallionProfileTypes'

interface StallionBreedingManagerLoadingProps {
  stallionCount: number
}

export function StallionBreedingManagerLoading({ stallionCount }: StallionBreedingManagerLoadingProps) {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  )
}




