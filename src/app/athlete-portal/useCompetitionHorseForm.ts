import { useState } from 'react'
import { CompetitionHorse } from './CompetitionHorseFormTypes'

export function useCompetitionHorseForm(horse: CompetitionHorse | null) {
  const [formData, setFormData] = useState({
    horse_name: horse?.horse_name || '',
    registered_name: horse?.registered_name || '',
    registration_number: horse?.registration_number || '',
    breed: horse?.breed || '',
    sex: horse?.sex || 'mare',
    birth_year: horse?.birth_year?.toString() || '',
    color: horse?.color || '',
    ownership_type: horse?.ownership_type || 'owned',
    owner_name: horse?.owner_name || '',
    owner_contact: horse?.owner_contact || '',
    sire_name: horse?.sire_name || '',
    dam_name: horse?.dam_name || '',
    primary_discipline: horse?.primary_discipline || '',
    performance_disciplines: horse?.performance_disciplines || [],
    performance_earnings: horse?.performance_earnings?.toString() || '0',
    performance_highlights: horse?.performance_highlights || '',
    best_times: horse?.best_times || [''],
    competition_status: horse?.competition_status || 'active',
    competition_level: horse?.competition_level || '',
    trainer_name: horse?.trainer_name || '',
    farrier_name: horse?.farrier_name || '',
    vet_name: horse?.vet_name || '',
    feed_program: horse?.feed_program || '',
    profile_photo_url: horse?.profile_photo_url || '',
    video_url: horse?.video_url || '',
    performance_videos: horse?.performance_videos || ['']
  })

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDisciplineToggle = (discipline: string) => {
    setFormData(prev => ({
      ...prev,
      performance_disciplines: prev.performance_disciplines.includes(discipline)
        ? prev.performance_disciplines.filter(d => d !== discipline)
        : [...prev.performance_disciplines, discipline]
    }))
  }

  return {
    formData,
    updateField,
    handleDisciplineToggle
  }
}