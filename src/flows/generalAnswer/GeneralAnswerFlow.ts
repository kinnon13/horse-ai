/**
 * GENERAL ANSWER FLOW COORDINATOR
 * 
 * PURPOSE:
 * - Coordinates the general answer flow process
 * - Handles the main general answer logic
 * - Orchestrates all general answer components
 * 
 * SAFETY:
 * - Every user input is timestamped with source_user_id
 * - We explicitly ask permission before storing any personal info
 * - We never assume consent - we ask "do you want me to reach out for you?"
 */

import { GeneralAnswerFlowHelpers } from './GeneralAnswerFlowHelpers'
import { GeneralAnswerResponse } from './GeneralAnswerResponseGenerator'

export class GeneralAnswerFlow {
  static isGeneralAnswerIntent(message: string): boolean {
    return GeneralAnswerFlowHelpers.isGeneralAnswerIntent(message)
  }

  static async processGeneralAnswer(
    message: string,
    userId: string,
    horseContext?: string
  ): Promise<GeneralAnswerResponse> {
    return GeneralAnswerFlowHelpers.processGeneralAnswer(message, userId, horseContext)
  }
}