import React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ChatContainerMobileInputProps {
  input: string
  setInput: (input: string) => void
  onSend: () => void
}

export function ChatContainerMobileInput({ input, setInput, onSend }: ChatContainerMobileInputProps) {
  return (
    <div className="bg-white border-t p-4">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about your horse..."
          onKeyPress={e => e.key === 'Enter' && onSend()}
        />
        <Button onClick={onSend} size="sm">
          Send
        </Button>
      </div>
    </div>
  )
}

