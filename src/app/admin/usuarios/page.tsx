// src/app/admin/usuarios/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Users,
  ArrowLeft,
  Settings,
  Ban,
  Trash2,
  ShieldAlert,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useUserContext } from '@/context/UserContext'

// Asegúrate de tener is_blocked en profiles:
// alter table public.profiles add column if not exists is_blocked boolean not null default false;

interface AdminUser {
  id: string
  email: string | null
  nombre_completo: string
  role: string
  verificado: boolean
  is_blocked: boolean
}

export default function UsuariosAdminPage() {
  const { perfil, loading: loadingPerfil } = useUserContext()
  const roleActual = (perfil as any)?.role
  const adminId = (perfil as any)?.id

  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionUserId, setActionUserId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, nombre_completo, role, verificado, is_blocked')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('[ADMIN_USERS_LOAD_ERROR]', error)
          toast.error('No se pudieron cargar los usuarios.')
          return
        }

        setUsers((data as AdminUser[]) || [])
      } catch (err) {
        console.error('[ADMIN_USERS_FATAL_ERROR]', err)
        toast.error('Error inesperado al cargar usuarios.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // 🔒 Bloquear / desbloquear usuario
  const toggleBlockUser = async (user: AdminUser) => {
    if (user.id === adminId) {
      toast.error('No puedes bloquear tu propia cuenta.')
      return
    }

    const target = !user.is_blocked
    setActionUserId(user.id)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_blocked: target })
        .eq('id', user.id)

      if (error) {
        console.error('[ADMIN_USERS_BLOCK_ERROR]', error)
        toast.error('No se pudo actualizar el estado de bloqueo.')
        return
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_blocked: target } : u))
      )

      toast.success(
        target ? 'Usuario bloqueado correctamente.' : 'Usuario desbloqueado.'
      )
    } catch (err) {
      console.error('[ADMIN_USERS_BLOCK_FATAL]', err)
      toast.error('Error inesperado al bloquear/desbloquear al usuario.')
    } finally {
      setActionUserId(null)
    }
  }

  // 🗑 Eliminar usuario COMPLETO vía API admin
    const deleteUserProfile = async (user: AdminUser) => {
  if (user.id === adminId) {
    toast.error('No puedes eliminar tu propio perfil de admin.')
    return
  }

  const ok = window.confirm(
    `¿Seguro que quieres eliminar COMPLETAMENTE a ${user.nombre_completo}? Esta acción no se puede deshacer.`
  )
  if (!ok) return

  setActionUserId(user.id)

  try {
    const res = await fetch('/api/admin/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    })

    let data: any = null
    try {
      data = await res.json()
    } catch {
      data = null
    }

    if (!res.ok) {
      console.warn('[ADMIN_DELETE_USER_API_ERROR_RESPONSE]', {
        status: res.status,
        data,
      })

      toast.error(
        data?.error ||
          `No se pudo eliminar el usuario. Código ${res.status}.`
      )
      return
    }

    setUsers((prev) => prev.filter((u) => u.id !== user.id))
    toast.success('Usuario eliminado por completo.')
  } catch (err) {
    console.error('[ADMIN_USERS_DELETE_FATAL]', err)
    toast.error('Error inesperado al eliminar el usuario.')
  } finally {
    setActionUserId(null)
  }
}


  // Estados de carga / permisos
  if (loadingPerfil || loading) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 animate-spin" />
          <span>Cargando usuarios…</span>
        </div>
      </main>
    )
  }

  if (roleActual !== 'admin') {
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

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Gestión de usuarios
          </h1>
          <p className="text-sm text-muted-foreground">
            Revisa, bloquea o elimina usuarios de StudyDocu. El bloqueo marca
            <code className="mx-1 px-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px]">
              is_blocked = true
            </code>
            en{' '}
            <code className="px-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px]">
              profiles
            </code>
            .
          </p>
          <p className="flex items-center gap-1 text-[11px] text-amber-600">
            <ShieldAlert className="w-3 h-3" />
            El botón Eliminar llama a{' '}
            <code className="px-1 rounded bg-zinc-100 dark:bg-zinc-800">
              /api/admin/delete-user
            </code>{' '}
            y usa la service key para borrar también en <code>auth.users</code>.
          </p>
        </div>
      </header>

      {users.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay usuarios registrados.
        </p>
      ) : (
        <div className="border rounded-xl divide-y bg-white dark:bg-zinc-900 shadow-sm">
          {users.map((u) => {
            const isAdmin = u.role === 'admin'
            const isBlocked = u.is_blocked

            return (
              <div
                key={u.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{u.nombre_completo}</p>
                    {isAdmin && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-100">
                        Admin
                      </span>
                    )}
                    {isBlocked && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-1">
                        <Ban className="w-3 h-3" />
                        Bloqueado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {u.email || 'Sin email'}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {u.verificado ? 'Verificado' : 'No verificado'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Botón bloquear/desbloquear */}
                  <button
                    onClick={() => toggleBlockUser(u)}
                    disabled={actionUserId === u.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                      isBlocked
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    } disabled:opacity-60`}
                  >
                    {actionUserId === u.id ? (
                      'Aplicando…'
                    ) : isBlocked ? (
                      <>
                        <Ban className="w-3 h-3" />
                        Desbloquear
                      </>
                    ) : (
                      <>
                        <Ban className="w-3 h-3" />
                        Bloquear
                      </>
                    )}
                  </button>

                  {/* Botón eliminar */}
                  {!isAdmin && (
                    <button
                      onClick={() => deleteUserProfile(u)}
                      disabled={actionUserId === u.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 disabled:opacity-60"
                    >
                      <Trash2 className="w-3 h-3" />
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
