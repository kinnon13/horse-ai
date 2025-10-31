import { GeneralAnswerDetector } from './GeneralAnswerDetector'
import { GeneralAnswerParser, GeneralAnswerIntent } from './GeneralAnswerParser'
import { GeneralAnswerLLMClient } from './GeneralAnswerLLMClient'
import { GeneralAnswerAuditLogger } from './GeneralAnswerAuditLogger'
import { GeneralAnswerResponseGenerator, GeneralAnswerResponse } from './GeneralAnswerResponseGenerator'
import { GeneralAnswerTierChecker } from './GeneralAnswerTierChecker'

export class GeneralAnswerFlowHelpers {
  static isGeneralAnswerIntent(message: string): boolean {
    return GeneralAnswerDetector.isGeneralAnswerIntent(message)
  }

  static async processGeneralAnswer(
    message: string,
    userId: string,
    horseContext?: string
  ): Promise<GeneralAnswerResponse> {
    
    await GeneralAnswerAuditLogger.logGeneralAnswer(userId, 'question_received', { message })
    
    const intent = GeneralAnswerParser.parseGeneralQuestion(message)
    const userTier = await GeneralAnswerTierChecker.checkUserTier(userId)
    
    if (GeneralAnswerTierChecker.requiresUpgrade(intent, userTier)) {
      return GeneralAnswerResponseGenerator.generateUpgradeResponse(intent, userTier)
    }
    
    const answer = await GeneralAnswerLLMClient.generateAnswer(message, horseContext, userTier)
    
    await GeneralAnswerAuditLogger.logGeneralAnswer(userId, 'answer_provided', {
      questionType: intent.questionType,
      answerLength: answer.length
    })
    
    return GeneralAnswerResponseGenerator.generateSuccessResponse(answer)
  }
}

