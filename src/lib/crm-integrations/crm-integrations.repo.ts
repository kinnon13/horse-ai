// CRM integrations repository - Main interface and re-exports
import { CRMProvider, CRMContact, CRMIntegration } from './crm-integrations.types'

// Re-export all functions from helpers
export { getCRMProviders, createCRMProvider, getCRMContacts, syncCRMData } from './crm-integrations.repo.helpers'