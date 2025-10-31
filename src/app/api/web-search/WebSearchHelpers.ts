// WebSearchHelpers.ts (30 lines) - Single responsibility: Helper functions
import { WebSearchResults, DuckDuckGoResponse } from './route.types'

export class WebSearchHelpers {
  static async performWebSearch(query: string): Promise<WebSearchResults> {
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    
    const response = await fetch(searchUrl)
    const data: DuckDuckGoResponse = await response.json()

    return this.extractSearchResults(data)
  }

  private static extractSearchResults(data: DuckDuckGoResponse): WebSearchResults {
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
}

