// ParserHelpers.ts (35 lines) - Single responsibility: Helper functions and utilities
/**
 * GENERAL ANSWER PARSER HELPERS
 * 
 * PURPOSE:
 * - Helper functions for parsing general questions
 * - Utility functions for question analysis
 * 
 * SAFETY:
 * - Only processes data that users explicitly provide
 * - Safe string operations and keyword matching
 */

export interface GeneralAnswerIntent {
  type: 'general_answer'
  questionType: 'breeding' | 'performance' | 'pricing' | 'general'
  requiresPlus: boolean
  question: string
}

export class ParserHelpers {
  static extractKeywords(message: string): string[] {
    const keywords = ['fee', 'price', 'cost', 'breeding', 'stud', 'stands', 'performance', 'bloodline', 'pedigree']
    return keywords.filter(keyword => message.toLowerCase().includes(keyword))
  }

  static isPlusRequired(message: string): boolean {
    const plusKeywords = ['fee', 'price', 'cost', 'breeding', 'stud', 'stands', 'performance', 'bloodline', 'pedigree']
    return plusKeywords.some(keyword => message.toLowerCase().includes(keyword))
  }

  static sanitizeQuestion(question: string): string {
    return question.trim().replace(/\s+/g, ' ')
  }

  static getQuestionComplexity(message: string): 'simple' | 'complex' {
    const complexKeywords = ['breeding', 'performance', 'bloodline', 'pedigree', 'stud', 'stands']
    return complexKeywords.some(keyword => message.toLowerCase().includes(keyword)) ? 'complex' : 'simple'
  }
}


