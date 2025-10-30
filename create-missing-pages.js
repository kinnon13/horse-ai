const fs = require('fs');
const path = require('path');

// List of missing page components to create
const missingPages = [
  'src/app/business/usePage.ts',
  'src/app/business/page.view.tsx',
  'src/app/dashboard/usePage.ts',
  'src/app/dashboard/page.view.tsx',
  'src/app/health/usePage.ts',
  'src/app/health/page.view.tsx',
  'src/app/marketplace/usePage.ts',
  'src/app/marketplace/page.view.tsx',
  'src/app/pricing/usePage.ts',
  'src/app/pricing/page.view.tsx',
  'src/app/social/usePage.ts',
  'src/app/social/page.view.tsx',
  'src/app/upload/usePage.ts',
  'src/app/upload/page.view.tsx'
];

// Hook template
const hookTemplate = (pageName) => `'use client'

import { useState, useEffect } from 'react'

export function usePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize ${pageName} page
    setLoading(false)
  }, [])

  return {
    loading,
    error,
    setError
  }
}`;

// View template
const viewTemplate = (pageName, title) => `'use client'

import React from 'react'

interface ${pageName}PageViewProps {
  loading: boolean
  error: string | null
  setError: (error: string | null) => void
}

export default function ${pageName}PageView({ loading, error, setError }: ${pageName}PageViewProps) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ${title.toLowerCase()}...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">${title}</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to ${title}</h2>
          <p className="text-gray-600">This is a placeholder page for ${title.toLowerCase()}.</p>
        </div>
      </div>
    </div>
  )
}`;

// Create missing pages
missingPages.forEach(filePath => {
  const dir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  
  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (fileName === 'usePage.ts') {
    const pageName = path.basename(dir);
    fs.writeFileSync(filePath, hookTemplate(pageName));
    console.log(`Created ${filePath}`);
  } else if (fileName === 'page.view.tsx') {
    const pageName = path.basename(dir);
    const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    fs.writeFileSync(filePath, viewTemplate(pageName, title));
    console.log(`Created ${filePath}`);
  }
});

console.log('Created all missing page components');
