// Producer Business Info Actions - Single responsibility
export function useBusinessInfoActions() {
  const updateField = (field: string, value: any) => {
    console.log('Updating field:', field, value)
  }

  const goNext = () => {
    console.log('Going to next step')
  }

  const goBack = () => {
    console.log('Going to previous step')
  }

  const validateForm = () => {
    console.log('Validating form')
    return true
  }

  return {
    updateField,
    goNext,
    goBack,
    validateForm
  }
}
