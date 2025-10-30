import { Provider } from './ProviderLoginTypes'
import { fetchProviderData } from './ProviderLoginService'

export async function fetchProviderDataWithState(
  user: any,
  setProvider: (provider: Provider | null) => void
): Promise<void> {
  if (!user) return
  const data = await fetchProviderData(user.id)
  setProvider(data)
}

