interface AthleteEventCardNotesProps {
  event: any
}

export function AthleteEventCardNotes({ event }: AthleteEventCardNotesProps) {
  if (!event.notes) return null

  return (
    <div className="mt-3 pt-3 border-t">
      <p className="text-sm text-gray-600">{event.notes}</p>
    </div>
  )
}

