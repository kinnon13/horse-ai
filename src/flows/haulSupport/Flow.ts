// Flow.ts (35 lines) - Single responsibility: Main flow coordinator
import { HaulSupportDetector } from './HaulSupportDetector'
import { HaulSupportResponseGenerator, HaulSupportResponse } from './HaulSupportResponseGenerator'
import { FlowSteps } from './FlowSteps'

export class Flow {
  /**
   * PURPOSE:
   * - Coordinates the haul support flow process
   * - Handles the main haul support logic
   * - Orchestrates all haul support components
   * 
   * SAFETY:
   * - Every user input is timestamped with source_user_id
   * - We explicitly ask permission before storing any personal info
   * - We never assume consent - we ask "do you want me to reach out for you?"
   */
  static isHaulSupportIntent(message: string): boolean {
    return HaulSupportDetector.isHaulSupportIntent(message)
  }

  static async processHaulSupport(
    message: string,
    userId: string,
    horseContext?: string
  ): Promise<HaulSupportResponse> {
    return FlowSteps.processHaulSupportSteps(message, userId, horseContext)
  }
}
