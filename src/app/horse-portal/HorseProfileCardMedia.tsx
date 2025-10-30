import { HorseProfile } from './HorseProfileTypes'
import { Camera, Video } from 'lucide-react'

interface HorseProfileCardMediaProps {
  horse: HorseProfile
}

export function HorseProfileCardMedia({ horse }: HorseProfileCardMediaProps) {
  return (
    <div className="flex items-center gap-4">
      {horse.profile_photo_url && (
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-gray-500" />
          <span className="text-sm">Photo</span>
        </div>
      )}
      {horse.video_url && (
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-gray-500" />
          <span className="text-sm">Video</span>
        </div>
      )}
      {horse.photo_gallery.length > 0 && (
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{horse.photo_gallery.length} photos</span>
        </div>
      )}
    </div>
  )
}



