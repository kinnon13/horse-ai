import { Provider, ProviderFormData } from './ProvidersTypes'

export function useProvidersHandlers(createProvider: any, updateProvider: any, setShowAddForm: any, setEditingProvider: any) {
  const handleCreateProvider = async (formData: ProviderFormData) => {
    try {
      await createProvider(formData)
      setShowAddForm(false)
      alert('Provider created successfully!')
    } catch (error) {
      console.error('Error creating provider:', error)
      alert('Failed to create provider')
    }
  }

  const handleUpdateProvider = async (providerId: string, updates: Partial<Provider>) => {
    try {
      await updateProvider(providerId, updates)
      setEditingProvider(null)
      alert('Provider updated successfully!')
    } catch (error) {
      console.error('Error updating provider:', error)
      alert('Failed to update provider')
    }
  }

  const handleToggleBlocked = async (provider: Provider) => {
    try {
      await updateProvider(provider.id, { is_blocked: !provider.is_blocked })
      alert(`Provider ${provider.is_blocked ? 'unblocked' : 'blocked'} successfully!`)
    } catch (error) {
      console.error('Error toggling blocked status:', error)
      alert('Failed to update provider')
    }
  }

  const handleToggleVerified = async (provider: Provider) => {
    try {
      await updateProvider(provider.id, { is_verified: !provider.is_verified })
      alert(`Provider ${provider.is_verified ? 'unverified' : 'verified'} successfully!`)
    } catch (error) {
      console.error('Error toggling verified status:', error)
      alert('Failed to update provider')
    }
  }

  return {
    handleCreateProvider,
    handleUpdateProvider,
    handleToggleBlocked,
    handleToggleVerified
  }
}

