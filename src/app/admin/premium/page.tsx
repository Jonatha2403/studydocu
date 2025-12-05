// src/app/admin/premium/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Crown, ArrowLeft, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useUserContext } from '@/context/UserContext'

interface PremiumUser {
  id: string
  email: string | null
  nombre_completo: string
  is_premium: boolean | null
  subscription_active: boolean | null
  stripe_subscription_status: string | null
  premium_since: string | null
}

export default function PremiumManagementPage() {
  const { perfil, loading: loadingPerfil } = useUserContext()
  const role = (perfil as any)?.role

  const [users, setUsers] = useState<PremiumUser[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(
            'id, email, nombre_completo, is_premium, subscription_active, stripe_subscription_status, premium_since'
          )
          .order('created_at', { ascending: false })

        if (error) {
          console.error('[ADMIN_PREMIUM_LOAD_ERROR]', error)
          toast.error('No se pudieron cargar los usuarios Premium.')
          return
        }

        setUsers((data as PremiumUser[]) || [])
      } catch (err) {
        console.error('[ADMIN_PREMIUM_FATAL_ERROR]', err)
        toast.error('Error inesperado al cargar usuarios.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const togglePremium = async (user: PremiumUser) => {
    const isCurrentlyPremium = !!user.is_premium
    const targetStatus = !isCurrentlyPremium
    setUpdatingId(user.id)

    try {
      const now = new Date().toISOString()

      const payload: Partial<PremiumUser> & {
        subscription_active?: boolean
        stripe_subscription_status?: string | null
        premium_since?: string | null
      } = {
        is_premium: targetStatus,
        subscription_active: targetStatus,
        stripe_subscription_status: targetStatus ? 'active' : 'canceled',
        premium_since: targetStatus ? now : null,
      }

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id)

      if (error) {
        console.error('[ADMIN_PREMIUM_UPDATE_ERROR]', error)
        toast.error('No se pudo actualizar el estado Premium.')
        return
      }

      // Actualizar estado local sin recargar
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                is_premium: targetStatus,
                subscription_active: targetStatus,
                stripe_subscription_status: payload.stripe_subscription_status ?? null,
                premium_since: payload.premium_since ?? null,
              }
            : u
        )
      )

      toast.success(
        targetStatus
          ? `Usuario marcado como Premium.`
          : `Usuario quitado de Premium.`
      )
    } catch (err) {
      console.error('[ADMIN_PREMIUM_UPDATE_FATAL]', err)
      toast.error('Error inesperado al actualizar Premium.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Estados de carga / permisos
  if (loadingPerfil || loading) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 animate-spin" />
          <span>Cargando usuarios Premium…</span>
        </div>
      </main>
    )
  }

  if (role !== 'admin') {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-red-500 px-4">
        <p className="text-lg font-semibold text-center">
          No tienes permisos para ver esta sección (admin requerido).
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      {/* Header con flecha */}
      <header className="mb-8 space-y-3">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al panel de administración
        </Link>

        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Gestión de usuarios Premium
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Marca o desmarca usuarios como Premium. Esto actualiza los campos
            <code className="ml-1 px-1 rounded bg-zinc-100 dark:bg-zinc-800">
              is_premium
            </code>
            ,
            <code className="ml-1 px-1 rounded bg-zinc-100 dark:bg-zinc-800">
              subscription_active
            </code>{' '}
            y{' '}
            <code className="ml-1 px-1 rounded bg-zinc-100 dark:bg-zinc-800">
              stripe_subscription_status
            </code>
            .
          </p>
        </div>
      </header>

      {users.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay usuarios registrados.
        </p>
      ) : (
        <div className="border rounded-xl bg-white dark:bg-zinc-900 shadow-sm divide-y">
          {users.map((u) => {
            const isPremium = !!u.is_premium
            return (
              <div
                key={u.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{u.nombre_completo}</p>
                    {isPremium && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100">
                        <Crown className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {u.email || 'Sin email'}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Estado Stripe:{' '}
                    {u.stripe_subscription_status || 'sin estado'}
                    {u.premium_since && (
                      <>
                        {' · '}
                        Premium desde:{' '}
                        {new Date(u.premium_since).toLocaleDateString('es-EC')}
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => togglePremium(u)}
                    disabled={updatingId === u.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                      isPremium
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-yellow-400 text-black hover:bg-yellow-500'
                    } disabled:opacity-60`}
                  >
                    {updatingId === u.id ? (
                      'Actualizando...'
                    ) : isPremium ? (
                      <>
                        <Crown className="w-3 h-3" />
                        Quitar Premium
                      </>
                    ) : (
                      <>
                        <Crown className="w-3 h-3" />
                        Dar Premium
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
