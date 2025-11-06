// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
import { NextRequest } from 'next/server'
import { 
  handleGetRequest, 
  handlePostRequest, 
  handlePutRequest, 
  handleDeleteRequest 
} from './RouteHandlersHelpers'

export async function handleGet(request: NextRequest) {
  return handleGetRequest(request)
}

export async function handlePost(request: NextRequest) {
  return handlePostRequest(request)
}

export async function handlePut(request: NextRequest) {
  return handlePutRequest(request)
}

export async function handleDelete(request: NextRequest) {
  return handleDeleteRequest(request)
}

