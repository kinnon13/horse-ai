interface ClaimsErrorStateProps {
  error: string
}

export function ClaimsErrorState({ error }: ClaimsErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600">Error loading claims: {error}</p>
      </div>
    </div>
  )
}



