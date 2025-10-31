import React from 'react'
import { Button } from '@/components/ui/Button'
import { Menu } from 'lucide-react'

interface ChatContainerMobileHeaderProps {
  onMenuClick: () => void
}

export function ChatContainerMobileHeader({ onMenuClick }: ChatContainerMobileHeaderProps) {
  return (
    <div className="bg-white border-b p-4 flex items-center justify-between">
      <Button variant="ghost" size="sm" onClick={onMenuClick}>
        <Menu className="h-4 w-4" />
      </Button>
      <h1 className="text-lg font-semibold">HorseGPT</h1>
      <div className="w-8" /> {/* Spacer */}
    </div>
  )
}

