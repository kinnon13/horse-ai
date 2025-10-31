import { LineageStatsCardProps } from './HorseLineageTypes'

export function LineageStatsCard({ title, value, icon: Icon, bgColor, textColor, iconColor }: LineageStatsCardProps) {
  return (
    <div className={`${bgColor} p-4 rounded-lg`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <span className={`text-sm font-medium ${textColor}`}>{title}</span>
      </div>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  )
}




