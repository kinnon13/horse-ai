import { CRMIntegration } from './crm-integrations.types'
import { getCRMProviders } from './crm-provider-ops'
import { getCRMContacts } from './crm-contact-ops'

export async function syncCRMData(providerId: string): Promise<CRMIntegration> {
  const provider = await getCRMProviders().then(providers => 
    providers.find(p => p.id === providerId)
  )
  
  if (!provider) throw new Error('CRM provider not found')
  
  const contacts = await getCRMContacts(providerId)
  
  return {
    provider,
    contacts,
    sync_status: 'active',
    last_sync: new Date().toISOString()
  }
}


