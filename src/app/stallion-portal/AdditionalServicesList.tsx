import { StallionStationProfile } from './StallionProfileInterfaces'

export function AdditionalServicesList({ station }: { station: StallionStationProfile }) {
  return (
    <div className="space-y-2">
      {station.ai_services && (
        <div className="flex items-center text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          AI Services
        </div>
      )}
      {station.live_cover_services && (
        <div className="flex items-center text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Live Cover Services
        </div>
      )}
      {station.mare_care && (
        <div className="flex items-center text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Mare Care
        </div>
      )}
      {station.foaling_services && (
        <div className="flex items-center text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Foaling Services
        </div>
      )}
    </div>
  )
}




