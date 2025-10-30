// Main AthleteProfileSection component - Single responsibility
import React from 'react'
import AthleteProfileSectionLoading from './AthleteProfileSectionLoading'
import AthleteProfileSectionEmpty from './AthleteProfileSectionEmpty'
import AthleteProfileSectionContent from './AthleteProfileSectionContent'

interface AthleteProfileSectionProps {
  athlete: any
  loading: boolean
  onEdit: () => void
}

export default function AthleteProfileSection({ athlete, loading, onEdit }: AthleteProfileSectionProps) {
  if (loading) {
    return <AthleteProfileSectionLoading />
  }

  if (!athlete) {
    return <AthleteProfileSectionEmpty onEdit={onEdit} />
  }

  return <AthleteProfileSectionContent athlete={athlete} onEdit={onEdit} />
}