/**
 * GENERAL ANSWER PARSER
 * 
 * PURPOSE:
 * - Parses general questions to determine type and tier requirements
 * - Handles various ways users might ask questions
 * 
 * SAFETY:
 * - Only extracts data that users explicitly provide
 * - Determines tier requirements based on question type
 */

export interface GeneralAnswerIntent {
  type: 'general_answer'
  questionType: 'breeding' | 'performance' | 'pricing' | 'general'
  requiresPlus: boolean
  question: string
}

export class GeneralAnswerParser {
  /**
   * PURPOSE:
   * - Parses general questions to determine type and tier requirements
   * - Handles various ways users might ask questions
   * 
   * SAFETY:
   * - Only extracts data that users explicitly provide
   * - Determines tier requirements based on question type
   */
  static parseGeneralQuestion(message: string): GeneralAnswerIntent {
    const lowerMessage = message.toLowerCase()
    
    const questionType = this.determineQuestionType(lowerMessage)
    const requiresPlus = this.determineRequiresPlus(lowerMessage)
    
    return {
      type: 'general_answer',
      questionType,
      requiresPlus,
      question: message
    }
  }

  private static determineQuestionType(message: string): GeneralAnswerIntent['questionType'] {
    if (message.includes('fee') || message.includes('price') || message.includes('cost')) {
      return 'pricing'
    } else if (message.includes('breeding') || message.includes('stud') || message.includes('stands')) {
      return 'breeding'
    } else if (message.includes('performance') || message.includes('bloodline') || message.includes('pedigree')) {
      return 'performance'
    }
    return 'general'
  }

  private static determineRequiresPlus(message: string): boolean {
    const plusKeywords = ['fee', 'price', 'cost', 'breeding', 'stud', 'stands', 'performance', 'bloodline', 'pedigree']
    return plusKeywords.some(keyword => message.includes(keyword))
  }
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function GeneralAnswerIntent(_props?: any): never { throw new Error("Stubbed component used: ./GeneralAnswerParser.GeneralAnswerIntent"); }
