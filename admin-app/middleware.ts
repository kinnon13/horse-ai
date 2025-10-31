import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const adminEmail = process.env.ADMIN_EMAIL
  // TODO: Add proper auth check
  return NextResponse.next()
}

