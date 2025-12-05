'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

type Props = {
  redirectIfNew?: string
  redirectIfExisting?: string
  showWelcome?: boolean
  requireTokens?: boolean
  onStatusChange?: (status: 'loading' | 'success' | 'error') => void
  onShowWelcome?: () => void
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function usePostAuthRedirect({
  redirectIfNew = '/onboarding',
  redirectIfExisting = '/dashboard',
  showWelcome = true,
  requireTokens = false,
  onStatusChange,
  onShowWelcome
}: Props) {
  const router = useRouter()

  useEffect(() => {
    const verificarUsuario = async () => {
      onStatusChange?.('loading')

      if (requireTokens) {
        const access_token = localStorage.getItem('access_token')
        const refresh_token = localStorage.getItem('refresh_token')

        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token })
        }
      }

      const { data: authData, error: authError } = await supabase.auth.getUser()
      const user = authData?.user

      if (authError || !user) {
        toast.error('No se pudo obtener el usuario')
        onStatusChange?.('error')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        toast.error('No se pudo obtener el perfil')
        onStatusChange?.('error')
        return
      }

      if (!profile.onboarding_complete) {
        // Usuario nuevo: aún no ha completado el onboarding
        localStorage.setItem('welcome_shown', 'true')
        if (showWelcome) onShowWelcome?.()
        onStatusChange?.('success')
        await sleep(3000)
        router.push(redirectIfNew)
      } else {
        // Usuario existente: ya hizo el onboarding
        toast.success('Bienvenido de vuelta 👋')
        onStatusChange?.('success')
        await sleep(2000)
        router.push(redirectIfExisting)
      }
    }

    verificarUsuario()
  }, [
    redirectIfNew,
    redirectIfExisting,
    showWelcome,
    requireTokens,
    onStatusChange,
    onShowWelcome,
    router
  ])
}
