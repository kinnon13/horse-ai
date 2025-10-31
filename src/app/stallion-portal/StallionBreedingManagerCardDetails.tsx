import { StallionProfile } from './StallionProfileTypes'

interface StallionBreedingManagerCardDetailsProps {
  stallion: StallionProfile
}

export function StallionBreedingManagerCardDetails({ stallion }: StallionBreedingManagerCardDetailsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <span className="text-gray-600">Breed:</span>
        <p className="font-medium">{stallion.breed || 'N/A'}</p>
      </div>
      <div>
        <span className="text-gray-600">Year:</span>
        <p className="font-medium">{stallion.yob || 'N/A'}</p>
      </div>
      <div>
        <span className="text-gray-600">Status:</span>
        <p className="font-medium">{stallion.status || 'Active'}</p>
      </div>
      <div>
        <span className="text-gray-600">Fee:</span>
        <p className="font-medium">{stallion.breeding_fee ? `$${stallion.breeding_fee}` : 'N/A'}</p>
      </div>
    </div>
  )
}




