import { StallionStationProfile } from './StallionProfileInterfaces'

export interface StallionProfileSectionProps {
  station: StallionStationProfile | null
  loading: boolean
  onEdit: () => void
  onViewStallions: () => void
}

export interface StallionProfileContentProps {
  station: StallionStationProfile
  onEdit: () => void
  onViewStallions: () => void
}

export interface StallionProfileStatsProps {
  station: StallionStationProfile
}

export interface StallionProfileServicesProps {
  station: StallionStationProfile
}

export interface StallionProfileContactProps {
  station: StallionStationProfile
}

export interface StallionProfileActionsProps {
  onEdit: () => void
  onViewStallions: () => void
}