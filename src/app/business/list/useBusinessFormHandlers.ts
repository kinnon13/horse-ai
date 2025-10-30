import { BusinessFormData } from './BusinessListTypes'

interface UseBusinessFormHandlersProps {
  formData: BusinessFormData
  setFormData: (data: BusinessFormData) => void
}

export function useBusinessFormHandlers(formData: BusinessFormData, setFormData: (data: BusinessFormData) => void) {
  const handleServiceToggle = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.includes(service)
        ? formData.services.filter(s => s !== service)
        : [...formData.services, service]
    })
  }

  const updateField = (field: keyof BusinessFormData, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const updateContactInfo = (field: keyof BusinessFormData['contact_info'], value: string) => {
    setFormData({
      ...formData,
      contact_info: { ...formData.contact_info, [field]: value }
    })
  }

  return {
    handleServiceToggle,
    updateField,
    updateContactInfo
  }
}



