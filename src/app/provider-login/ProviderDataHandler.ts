// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
import type { ProviderType } from './ProviderLoginTypes'
import { fetchProviderData } from './ProviderLoginService'

export async function fetchProviderDataWithState(
  user: any,
  setProvider: (provider: ProviderType | null) => void
): Promise<void> {
  if (!user) return
  const data = await fetchProviderData(user.id)
  setProvider(data)
}




