'use client'

import { useEffect } from 'react'
import type { ProviderLoginPageState, ProviderLoginPageActions } from './ProviderLoginTypes'
import { useProviderLoginState } from './useProviderLoginState'
import { useProviderLoginActions } from './useProviderLoginActions'

export function useProviderLogin(): ProviderLoginPageState & ProviderLoginPageActions {
  const state = useProviderLoginState()
  const actions = useProviderLoginActions(
    state.user,
    state.provider,
    state.setProvider,
    state.setServiceRequests,
    state.setLoadingRequests
  )

  useEffect(() => {
    if (state.user) {
      actions.fetchProviderData()
      actions.fetchServiceRequests()
    }
  }, [state.user])

  return {
    ...state,
    ...actions
  }
}