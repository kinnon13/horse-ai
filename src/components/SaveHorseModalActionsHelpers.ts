// SaveHorseModalActionsHelpers.ts (50 lines)
import { supabase } from '@/lib/supabase'

export async function handleSubmit(
  formData: {
    name: string
    sex: string
    year: string
    city: string
    state: string
    email: string
  },
  onSuccess: () => void,
  onClose: () => void,
  setError: (error: string) => void
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: 'temp123!'
      })
      if (authError) throw authError
      // Create user profile
      await supabase.from('users').insert({
        id: authData.user?.id,
        tier: 'free'
      })
    }
    // Save horse data
    const { error: horseError } = await supabase
      .from('user_horses')
      .insert({
        user_id: user?.id,
        name: formData.name,
        sex: formData.sex,
        year: formData.year,
        location_city: formData.city,
        location_state: formData.state
      })
    if (horseError) throw horseError
    onSuccess()
    onClose()
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to save horse')
  }
}
