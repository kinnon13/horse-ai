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

