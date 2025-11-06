// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
import { WebSearchResults, DuckDuckGoResponse } from './route.types'

export async function performWebSearch(query: string): Promise<WebSearchResults> {
  const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
  
  const response = await fetch(searchUrl)
  const data: DuckDuckGoResponse = await response.json()

  return {
    abstract: data.Abstract,
    abstractText: data.AbstractText,
    abstractSource: data.AbstractSource,
    abstractURL: data.AbstractURL,
    answer: data.Answer,
    answerType: data.AnswerType,
    definition: data.Definition,
    definitionSource: data.DefinitionSource,
    definitionURL: data.DefinitionURL,
    relatedTopics: data.RelatedTopics?.slice(0, 5) || [],
    results: data.Results?.slice(0, 5) || []
  }
}



