// src/app/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Users,
  Crown,
  FileText,
  Activity,
  ArrowRight,
} from 'lucide-react'
import { useUserContext } from '@/context/UserContext'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface AdminStats {
  totalUsers: number
  premiumUsers: number
  docsToday: number
}

export default function AdminHomePage() {
  const { perfil, loading: loadingPerfil } = useUserContext()
  const role = (perfil as any)?.role

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    premiumUsers: 0,
    docsToday: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Usuarios totales
        const { count: totalUsers, error: usersErr } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })

        if (usersErr) throw usersErr

        // Usuarios Premium
        const { count: premiumUsers, error: premErr } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .or(
            'is_premium.eq.true,subscription_active.eq.true,stripe_subscription_status.eq.active'
          )

        if (premErr) throw premErr

        // Documentos subidos hoy
        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)

        const { count: docsToday, error: docsErr } = await supabase
          .from('documents')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', startOfToday.toISOString())

        if (docsErr) throw docsErr

        setStats({
          totalUsers: totalUsers ?? 0,
          premiumUsers: premiumUsers ?? 0,
          docsToday: docsToday ?? 0,
        })
      } catch (err) {
        console.error('[ADMIN_DASH_STATS_ERROR]', err)
        toast.error('No se pudieron cargar las estadísticas de admin.')
      } finally {
        setLoadingStats(false)
      }
    }

    loadStats()
  }, [])

  // ⛔ Gate de permisos
  if (loadingPerfil) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 animate-spin" />
          <span>Cargando panel de administración…</span>
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

  // ✔️ FUNCIÓN CERRAR SESIÓN
  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* █████ HEADER CON BOTONES █████ */}
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            Panel de Administración
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona usuarios, documentos y funciones avanzadas de StudyDocu.
          </p>
        </div>

        {/* DERECHA: Regresar, Sesión, Cerrar sesión */}
        <div className="flex items-center gap-3">

          {/* Botón REGRESAR */}
          <Link
            href="/"
            className="px-3 py-1.5 text-xs rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition"
          >
            ← Regresar
          </Link>

          {/* Badge Admin */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-zinc-900/70 px-3 py-1 text-xs border">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span>Sesión:</span>
            <span className="font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-100">
              Admin
            </span>
          </div>

          {/* Botón CERRAR SESIÓN */}
          <button
            onClick={cerrarSesion}
            className="px-3 py-1.5 text-xs rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
          >
            Cerrar sesión
          </button>

        </div>
      </header>

      {/* █████ MÉTRICAS PRINCIPALES █████ */}
      <section className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Usuarios totales</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-1">
            {loadingStats ? '…' : stats.totalUsers}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Usuarios Premium activos</span>
            <Crown className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold mt-1">
            {loadingStats ? '…' : stats.premiumUsers}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-zinc-900 border shadow-sm p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Docs subidos hoy</span>
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold mt-1">
            {loadingStats ? '…' : stats.docsToday}
          </div>
        </div>
      </section>

      {/* █████ ACCIONES RÁPIDAS █████ */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/admin/premium"
          className="group rounded-2xl border bg-white dark:bg-zinc-900 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition flex items-start gap-3"
        >
          <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
            <Crown className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-sm flex items-center gap-1">
              Gestión de usuarios Premium
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Marca o desmarca usuarios como Premium.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/usuarios"
          className="group rounded-2xl border bg-white dark:bg-zinc-900 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition flex items-start gap-3"
        >
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-sm flex items-center gap-1">
              Gestión de usuarios
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Revisa, bloquea o elimina usuarios.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/documentos-reportados"
          className="group rounded-2xl border bg-white dark:bg-zinc-900 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition flex items-start gap-3"
        >
          <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
            <FileText className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-sm flex items-center gap-1">
              Documentos reportados
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Atiende reportes de contenido inapropiado.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/configuracion"
          className="group rounded-2xl border bg-white dark:bg-zinc-900 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition flex items-start gap-3"
        >
          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-sm flex items-center gap-1">
              Configuración avanzada
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Ajusta parámetros del sistema y límites.
            </p>
          </div>
        </Link>
      </section>

      {/* SECCIÓN FINAL */}
      <section className="mt-4">
        <div className="rounded-2xl border bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <h2 className="text-sm font-semibold mb-2">Últimas acciones</h2>
          <p className="text-xs text-muted-foreground">
            En el futuro aquí podrás ver un historial real de acciones del admin
            mediante una tabla <code>admin_logs</code>.
          </p>
        </div>
      </section>
    </main>
  )
}
