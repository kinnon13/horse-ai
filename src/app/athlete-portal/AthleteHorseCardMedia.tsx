import { Camera, Video } from 'lucide-react'

interface AthleteHorseCardMediaProps {
  horse: any
}

export function AthleteHorseCardMedia({ horse }: AthleteHorseCardMediaProps) {
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
      {horse.performance_videos && horse.performance_videos.length > 0 && (
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{horse.performance_videos.length} videos</span>
        </div>
      )}
    </div>
  )
}




