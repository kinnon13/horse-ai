import { ProducerSetupData } from './ProducerSetupTypes'

export async function saveBusinessInfoData(formData: ProducerSetupData): Promise<void> {
  try {
    // TODO: Call API to save business info
    console.log('Saving business info:', formData)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Error saving business info:', error)
    throw error
  }
}

