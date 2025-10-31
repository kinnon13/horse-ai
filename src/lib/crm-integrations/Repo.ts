// Repo.ts (35 lines) - Single responsibility: Main repository logic
import { RepoHelpers } from './RepoHelpers'
import { CRMProvider, CRMContact, CRMIntegration } from './crm-integrations.types'

export async function getCRMProviders(): Promise<CRMProvider[]> {
  return RepoHelpers.fetchProviders()
}

export async function createCRMProvider(providerData: Omit<CRMProvider, 'id' | 'created_at' | 'updated_at'>): Promise<CRMProvider> {
  return RepoHelpers.insertProvider(providerData)
}

export async function getCRMContacts(providerId: string): Promise<CRMContact[]> {
  return RepoHelpers.fetchContacts(providerId)
}

export async function syncCRMData(providerId: string): Promise<CRMIntegration> {
  const providers = await RepoHelpers.fetchProviders()
  const provider = providers.find(p => p.id === providerId)
  
  if (!provider) throw new Error('CRM provider not found')
  
  const contacts = await RepoHelpers.fetchContacts(providerId)
  
  return {
    provider,
    contacts,
    sync_status: 'active',
    last_sync: new Date().toISOString()
  }
}

