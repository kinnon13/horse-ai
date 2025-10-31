'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'

export default function NewHorsePage() {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [input, setInput] = useState('')
  const [formData, setFormData] = useState({ name: '', breed: '', color: '', gender: '', age: '', discipline: '', photo: '' })
  const [success, setSuccess] = useState(false)
  const fields = ['name', 'breed', 'color', 'gender', 'age', 'discipline']
  const questions = [
    "What's your horse's name?", "What breed?", "What color?", "Gender? (mare/stallion/gelding)", "Age?", "Discipline? (barrel racing, dressage, etc.)"
  ]
  const handleSubmit = async () => {
    const newData = { ...formData, [fields[step]]: input }
    setFormData(newData)
    if (step < 5) { setStep(step + 1); setInput('') }
    else await submitHorse(newData)
  }
  const submitHorse = async (data: typeof formData) => {
    if (!user) return
    const { data: horse } = await supabase.from('horses_master').insert({
      barn_name: data.name, breed: data.breed, color: data.color, sex: data.gender, yob: data.age, discipline: data.discipline
    }).select().single()
    if (horse) await supabase.from('horse_user_links').insert({ user_id: user.id, horse_id: horse.id })
    setSuccess(true)
  }
  if (success) return <div className="p-6"><p className="text-lg">Great! I've added {formData.name} to your profile.</p></div>
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Your Horse</h1>
      <p className="mb-4">{questions[step]}</p>
      <input className="border p-2 w-full mb-4" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSubmit()} />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={handleSubmit}>Next</button>
      {step === 0 && <p className="mt-2 text-sm text-gray-500">Photo upload coming soon</p>}
    </div>
  )
}

