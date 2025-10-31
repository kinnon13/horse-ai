import { Dispatch, SetStateAction } from 'react'
import { Provider } from './types'
import { createProvider, updateProvider } from './operations'

export const createCreateHandler = (
  setProviders: Dispatch<SetStateAction<Provider[]>>
) => async (providerData: Omit<Provider, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const newProvider = await createProvider(providerData)
    setProviders(prev => [newProvider, ...prev])
    return newProvider
  } catch (err) {
    console.error('Error creating provider:', err)
    throw err
  }
}

export const createUpdateHandler = (
  setProviders: Dispatch<SetStateAction<Provider[]>>
) => async (id: string, updateData: Partial<Provider>) => {
  try {
    const updated = await updateProvider(id, updateData)
    setProviders(prev => prev.map(p => p.id === id ? updated : p))
    return updated
  } catch (err) {
    console.error('Error updating provider:', err)
    throw err
  }
}


