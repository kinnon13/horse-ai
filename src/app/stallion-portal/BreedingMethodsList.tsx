import { StallionStationProfile } from './StallionProfileInterfaces'

export function BreedingMethodsList({ breedingMethods }: { breedingMethods: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {breedingMethods.map((method) => (
        <span key={method} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
          {method}
        </span>
      ))}
    </div>
  )
}




