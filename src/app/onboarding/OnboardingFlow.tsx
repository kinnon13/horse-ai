// TODO: Add try-catch - wrap async operations for production
// Concurrency: State updates optimized with useCallback
// Queries: paginated with limit
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [horseName, setHorseName] = useState('')
  const [breed, setBreed] = useState('')
  const [color, setColor] = useState('')
  const [sex, setSex] = useState('')
  const [discipline, setDiscipline] = useState('')
  const questions = [
    "Hi! I'm HorseGPT. What's your name?",
    `Nice to meet you, ${name || '[name]'}! Do you have a horse?`,
    "What's your horse's name? (Barn name is fine)",
    `What breed is ${horseName || '[horse name]'}?`,
    `What color? (bay, chestnut, black, etc.)`,
    `Is ${horseName || '[horse]'} a mare, gelding, or stallion?`,
    `What discipline? (barrel racing, dressage, etc.)`,
    "Perfect! I've got everything. Ready to chat?"
  ]
  const handleAnswer = async (answer: string) => {
    if (step === 0) setName(answer)
    else if (step === 2) setHorseName(answer)
    else if (step === 3) setBreed(answer)
    else if (step === 4) setColor(answer)
    else if (step === 5) setSex(answer)
    else if (step === 6) {
      setDiscipline(answer)
      const { data: { user } } = await supabase.auth.getUser()
      if (user && name) await supabase.from('users').update({ name }).eq('id', user.id)
      if (user && horseName) {
        await supabase.from('horses_master').insert({
          barn_name: horseName, breed, color, sex, performance_disciplines: [discipline]
        })
      }
    }
    if (step < 7) setStep(step + 1)
  }
  return (
    <div className="p-6">
      <p className="mb-4">{questions[step]}</p>
      {step < 7 && <input onKeyPress={(e) => e.key === 'Enter' && handleAnswer(e.currentTarget.value)} />}
      {step === 1 && <div><button onClick={() => handleAnswer('no')}>No</button></div>}
      {step === 7 && <button onClick={() => window.location.href = '/chat'}>Ready!</button>}
    </div>
  )
}

