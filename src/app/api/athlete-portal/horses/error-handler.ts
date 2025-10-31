import { NextResponse } from 'next/server'

export function handleRouteError(error: unknown, operation: string): NextResponse {
  console.error(`${operation} error:`, error)
  return NextResponse.json({ 
    error: error instanceof Error ? error.message : 'Server error' 
  }, { status: 500 })
}

