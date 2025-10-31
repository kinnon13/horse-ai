// ServiceRequestRouter.ts (35 lines) - Single responsibility: Provider routing logic
import { ServiceRequestIntent } from './ServiceRequestParser'
import { ProviderSelector } from './ServiceRequestProviderSelector'

export class ServiceRequestRouter {
  static async findProviders(intent: ServiceRequestIntent) {
    return await ProviderSelector.findProviders(intent)
  }

  static async sendToProviders(providers: any[], intent: ServiceRequestIntent) {
    const results = []
    for (const provider of providers) {
      try {
        const result = await this.sendToProvider(provider, intent)
        results.push({ provider: provider.id, success: true, result })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        results.push({ provider: provider.id, success: false, error: errorMessage })
      }
    }
    return results
  }

  private static async sendToProvider(provider: any, intent: ServiceRequestIntent) {
    await fetch('/api/notifications/provider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerId: provider.id, serviceRequest: intent })
    })
    return { message: 'Provider notified', timestamp: new Date() }
  }
}
