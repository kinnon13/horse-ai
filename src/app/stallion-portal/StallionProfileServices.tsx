import { StallionProfileServicesProps } from './StallionProfileTypes'
import { BreedingMethodsList } from './BreedingMethodsList'
import { AdditionalServicesList } from './AdditionalServicesList'

export function StallionProfileServices({ station }: StallionProfileServicesProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Breeding Methods</h4>
          <BreedingMethodsList breedingMethods={station.breeding_methods} />
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Additional Services</h4>
          <AdditionalServicesList station={station} />
        </div>
      </div>
    </div>
  )
}