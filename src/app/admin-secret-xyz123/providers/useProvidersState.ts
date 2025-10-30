import { Provider, ProviderFormData } from './ProvidersTypes'

export function useProvidersState() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)

  return {
    showAddForm,
    setShowAddForm,
    editingProvider,
    setEditingProvider
  }
}

