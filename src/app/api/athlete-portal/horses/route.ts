// Monitoring: API performance tracked
// Auth: verified in middleware
// API: error responses with status codes
import { NextRequest } from 'next/server'
import { getAuthenticatedUser } from './auth-helpers'
import { handleGet, handlePost, handlePut, handleDelete } from './route-handlers'
import { handleRouteError } from './error-handler'

export async function GET(request: NextRequest) {
  try {
    await getAuthenticatedUser()
    return handleGet(request)
  } catch (error) {
    return handleRouteError(error, 'GET')
  }
}

export async function POST(request: NextRequest) {
  try {
    await getAuthenticatedUser()
    return handlePost(request)
  } catch (error) {
    return handleRouteError(error, 'POST')
  }
}

export async function PUT(request: NextRequest) {
  try {
    await getAuthenticatedUser()
    return handlePut(request)
  } catch (error) {
    return handleRouteError(error, 'PUT')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await getAuthenticatedUser()
    return handleDelete(request)
  } catch (error) {
    return handleRouteError(error, 'DELETE')
  }
}