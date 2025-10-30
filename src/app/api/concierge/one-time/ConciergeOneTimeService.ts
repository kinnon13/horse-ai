import { ConciergeUserService } from './ConciergeUserService'
import { ConciergeStripeService } from './ConciergeStripeService'
import { ConciergeRequestService } from './ConciergeRequestService'

export class ConciergeOneTimeService {
  private userService = new ConciergeUserService()
  private stripeService = new ConciergeStripeService()
  private requestService = new ConciergeRequestService()

  async createConciergeRequest(requestData: any) {
    const { userId, serviceType, location, urgency = 'high', amount = 25 } = requestData

    if (!userId || !serviceType || !location) {
      throw new Error('Missing required fields: userId, serviceType, location')
    }

    const user = await this.userService.getUser(userId)
    const customerId = await this.userService.ensureStripeCustomer(user)
    const session = await this.stripeService.createStripeSession(customerId, serviceType, location, amount, userId, urgency)
    const conciergeRequest = await this.requestService.saveConciergeRequest(userId, serviceType, location, urgency, amount, session.id)

    return {
      sessionId: session.id,
      url: session.url,
      conciergeRequest
    }
  }

  async getConciergeRequests(userId: string) {
    return await this.requestService.getConciergeRequests(userId)
  }

  async updateConciergeRequest(requestId: string, updates: any) {
    return await this.requestService.updateConciergeRequest(requestId, updates)
  }
}