// TODO: Add try-catch - wrap async operations for production
// Queries: paginated with limit
// SaveHorseModal.view.tsx (48 lines)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function SaveHorseModal({ open, onClose, horseData }: { open: boolean; onClose: () => void; horseData: any }) {
  const [name, setName] = useState(horseData.name || '')
  const [loading, setLoading] = useState(false)

  const saveHorse = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('horses').insert({
      user_id: user.id,
      name,
      breed: horseData.breed,
      age: horseData.age,
      notes: horseData.notes,
    })

    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Your Horse Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Horse name" value={name} onChange={e => setName(e.target.value)} />
          <p className="text-sm text-gray-600">We'll save: {horseData.breed}, {horseData.age} years old</p>
          <Button onClick={saveHorse} disabled={loading || !name}>
            {loading ? 'Saving...' : 'Save Horse'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}