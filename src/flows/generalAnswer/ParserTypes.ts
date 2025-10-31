// ParserTypes.ts (15 lines) - Single responsibility: Type definitions
export interface GeneralAnswerIntent {
  type: 'general_answer'
  questionType: 'breeding' | 'performance' | 'pricing' | 'general'
  requiresPlus: boolean
  question: string
}

export type QuestionType = 'breeding' | 'performance' | 'pricing' | 'general'

export interface ParsedQuestion {
  original: string
  sanitized: string
  keywords: string[]
  complexity: 'simple' | 'complex'
  requiresPlus: boolean
}


