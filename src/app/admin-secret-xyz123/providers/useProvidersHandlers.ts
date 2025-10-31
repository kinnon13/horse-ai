import { Provider, ProviderFormData } from './ProvidersTypes'
import { handleProviderError, showProviderSuccessMessage } from './ProviderErrorHandlers'

export function useProvidersHandlers(createProvider: any, updateProvider: any, setShowAddForm: any, setEditingProvider: any) {
  const handleCreateProvider = async (formData: ProviderFormData) => {
    try {
      await createProvider(formData)
      setShowAddForm(false)
      showProviderSuccessMessage('created')
    } catch (error) {
      handleProviderError('creating provider', error)
    }
  }

  const handleUpdateProvider = async (providerId: string, updates: Partial<Provider>) => {
    try {
      await updateProvider(providerId, updates)
      setEditingProvider(null)
      showProviderSuccessMessage('updated')
    } catch (error) {
      handleProviderError('updating provider', error)
    }
  }

  const handleToggleBlocked = async (provider: Provider) => {
    try {
      await updateProvider(provider.id, { is_blocked: !provider.is_blocked })
      showProviderSuccessMessage(`${provider.is_blocked ? 'unblocked' : 'blocked'}`)
    } catch (error) {
      handleProviderError('updating provider', error)
    }
  }

  const handleToggleVerified = async (provider: Provider) => {
    try {
      await updateProvider(provider.id, { is_verified: !provider.is_verified })
      showProviderSuccessMessage(`${provider.is_verified ? 'unverified' : 'verified'}`)
    } catch (error) {
      handleProviderError('updating provider', error)
    }
  }

  return {
    handleCreateProvider,
    handleUpdateProvider,
    handleToggleBlocked,
    handleToggleVerified
  }
}

