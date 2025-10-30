'use client'

import React from 'react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Horse.AI
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/marketplace" className="text-gray-700 hover:text-blue-600">
              Marketplace
            </Link>
            <Link href="/business" className="text-gray-700 hover:text-blue-600">
              Business
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
