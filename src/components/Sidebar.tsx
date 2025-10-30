'use client'

import React from 'react'
import Link from 'next/link'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Navigation</h2>
          <nav className="space-y-2">
            <Link 
              href="/dashboard" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={onClose}
            >
              Dashboard
            </Link>
            <Link 
              href="/marketplace" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={onClose}
            >
              Marketplace
            </Link>
            <Link 
              href="/business" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={onClose}
            >
              Business
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}
