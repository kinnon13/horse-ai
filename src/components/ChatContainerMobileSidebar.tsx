import React from 'react'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'

interface ChatContainerMobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatContainerMobileSidebar({ isOpen, onClose }: ChatContainerMobileSidebarProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div className="w-64 h-full bg-white shadow-lg">
        <div className="p-4 border-b">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start">My Horses</Button>
          <Button variant="ghost" className="w-full justify-start">Find Services</Button>
          <Button variant="ghost" className="w-full justify-start">Settings</Button>
        </div>
      </div>
    </div>
  )
}

