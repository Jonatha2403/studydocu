// src/app/(premium)/layout.tsx
import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

interface LayoutProps {
  children: ReactNode
}

export default async function PremiumLayout({ children }: LayoutProps) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 🔐 Si no hay sesión → redirige al login
  if (!session) {
    redirect(`/auth?modo=login&redirectedFrom=${encodeURIComponent('/premium-area')}`)
  }

  // ✅ Verifica perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_complete')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_complete) {
    redirect('/completar-perfil')
  }

  // 💳 Verifica membresía premium
  const { data: membership } = await supabase
    .from('user_memberships')
    .select('plan, expires_at')
    .eq('user_id', session.user.id)
    .eq('status', 'active')
    .single()

  const isPremium =
    membership?.plan === 'premium' &&
    (!membership.expires_at || new Date(membership.expires_at) > new Date())

  if (!isPremium) {
    redirect('/no-autorizado')
  }

  return <>{children}</>
}
