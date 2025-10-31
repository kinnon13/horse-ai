// HeroMessageQueries.tsx (20 lines) - Sample query buttons
'use client'

interface HeroMessageQueriesProps {
  onQueryClick: (query: string) => void
}

export function HeroMessageQueries({ onQueryClick }: HeroMessageQueriesProps) {
  const sampleQueries = [
    "Is this mare actually worth 40k or is she lame?",
    "Find me a farrier in Stephenville who does corrective work",
    "Should I breed this mare to Dash Ta Fame or Frenchmans Guy?",
    "What's the best feed for a 12-year-old gelding?",
    "My horse is limping - what should I do?",
    "Find a vet near me who specializes in lameness"
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {sampleQueries.map((query, index) => (
        <button
          key={index}
          onClick={() => onQueryClick(query)}
          className="text-left p-3 bg-white rounded-lg border hover:border-green-500 hover:bg-green-50 transition-colors text-sm"
        >
          "{query}"
        </button>
      ))}
    </div>
  )
}
