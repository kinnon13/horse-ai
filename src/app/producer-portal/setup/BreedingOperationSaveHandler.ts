import { ProducerSetupData } from './ProducerSetupTypes'
import { saveBreedingOperationData } from './BreedingOperationService'

export async function saveBreedingOperationWithState(
  formData: ProducerSetupData,
  setIsSaving: (saving: boolean) => void
): Promise<void> {
  setIsSaving(true)
  try {
    await saveBreedingOperationData(formData)
  } catch (error) {
    console.error('Error saving breeding operation:', error)
  } finally {
    setIsSaving(false)
  }
}

