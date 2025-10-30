interface AthleteHorseCardDisciplinesProps {
  horse: any
}

export function AthleteHorseCardDisciplines({ horse }: AthleteHorseCardDisciplinesProps) {
  if (horse.performance_disciplines.length === 0) return null

  return (
    <div className="mb-3">
      <h4 className="font-medium text-sm mb-2">Disciplines</h4>
      <div className="flex flex-wrap gap-2">
        {horse.performance_disciplines.map((discipline: string, index: number) => (
          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {discipline}
          </span>
        ))}
      </div>
    </div>
  )
}



