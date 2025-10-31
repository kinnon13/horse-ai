// Lead generation API service
import { NextRequest, NextResponse } from 'next/server'
import { handlePostLeadGeneration } from './route-handlers'
import { handleGetLeadGeneration } from './route-get-handler'

export class LeadGenerationApiService {
  static async handlePost(request: NextRequest): Promise<NextResponse> {
    return handlePostLeadGeneration(request)
  }

  static async handleGet(request: NextRequest): Promise<NextResponse> {
    return handleGetLeadGeneration(request)
  }
}
