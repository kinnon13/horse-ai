// WebSearchTypes.ts (35 lines) - Single responsibility: Type definitions
export interface WebSearchRequest {
  query: string
  user_id: string
}

export interface WebSearchResponse {
  success: boolean
  results: WebSearchResults
  query: string
}

export interface WebSearchResults {
  abstract: string
  abstractText: string
  abstractSource: string
  abstractURL: string
  answer: string
  answerType: string
  definition: string
  definitionSource: string
  definitionURL: string
  relatedTopics: any[]
  results: any[]
}

export interface DuckDuckGoResponse {
  Abstract: string
  AbstractText: string
  AbstractSource: string
  AbstractURL: string
  Answer: string
  AnswerType: string
  Definition: string
  DefinitionSource: string
  DefinitionURL: string
  RelatedTopics?: any[]
  Results?: any[]
}


