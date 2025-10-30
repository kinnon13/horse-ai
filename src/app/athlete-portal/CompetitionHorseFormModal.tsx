'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'
import { CompetitionHorseFormModalProps } from './CompetitionHorseFormTypes'
import { useCompetitionHorseForm } from './useCompetitionHorseForm'
import CompetitionHorseBasicInfo from './CompetitionHorseBasicInfo'
import CompetitionHorsePerformanceInfo from './CompetitionHorsePerformanceInfo'
import CompetitionHorseCareInfo from './CompetitionHorseCareInfo'

export default function CompetitionHorseFormModal({ horse, onSave, onClose }: CompetitionHorseFormModalProps) {
  const form = useCompetitionHorseForm(horse)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...form.formData,
      birth_year: form.formData.birth_year ? parseInt(form.formData.birth_year) : null,
      performance_earnings: parseInt(form.formData.performance_earnings) || 0,
      best_times: form.formData.best_times.filter(time => time.trim() !== ''),
      performance_videos: form.formData.performance_videos.filter(video => video.trim() !== '')
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{horse ? 'Edit Horse' : 'Add New Horse'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CompetitionHorseBasicInfo form={form} />
          <CompetitionHorsePerformanceInfo form={form} />
          <CompetitionHorseCareInfo form={form} />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {horse ? 'Update Horse' : 'Add Horse'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}