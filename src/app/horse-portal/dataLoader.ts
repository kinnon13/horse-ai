// Horse Portal Data Loader - Single responsibility
export async function loadHorseData(horseId: string) {
  try {
    // Mock data for now
    return {
      id: horseId,
      name: 'Sample Horse',
      breed: 'Quarter Horse',
      color: 'Bay',
      birth_year: 2018,
      sex: 'Gelding',
      registration_number: 'AQHA789012',
      sire: 'Famous Sire',
      dam: 'Famous Dam',
      owner_id: 'owner_123',
      performance_record: 'Multiple wins',
      health_status: 'Excellent',
      training_level: 'Advanced',
      competition_level: 'Regional',
      last_competition: '2024-01-15',
      next_competition: '2024-02-15',
      achievements: 'Champion 2023',
      bloodline_notes: 'Excellent bloodline',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error loading horse data:', error)
    throw error
  }
}