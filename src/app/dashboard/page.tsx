// src/app/dashboard/page.tsx
'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useUserContext } from '@/context/UserContext'
import { useUserStatus } from '@/hooks/useUserStatus'
import { useMembership } from '@/hooks/useMembership'
import { Loader2, FileText, Star, Layers, TrendingUp, Award, Download } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import PremiumBadge from '@/components/PremiumBadge'
import LottieAvatar from '@/components/LottieAvatar'

/* --------------------------------- Tipos ---------------------------------- */
interface UserDashboardStats {
  puntos: number
  documentosTotales: number
  categorias: Record<string, number>
  porMes: Record<string, number>
  recientes?: FetchedDocument[]
}
interface FetchedDocument {
  id: string
  file_name?: string | null
  category: string | null
  created_at: string
}

/* --------------------------------- Página --------------------------------- */
export default function DashboardPage() {
  const { user, perfil, loading: sessionLoading } = useUserContext()
  const { isPremium } = useMembership()
  const { role, isPremium: isPremiumStatus, loading: statusLoading } = useUserStatus()

  const [stats, setStats] = useState<UserDashboardStats | null>(null)
  const [ranking, setRanking] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloads, setDownloads] = useState<FetchedDocument[]>([])

  const router = useRouter()

  // Inferimos si el avatar es Lottie a partir de avatar_url
  const avatarUrl = (perfil as any)?.avatar_url as string | undefined
  const isLottieAvatar = Boolean(avatarUrl && avatarUrl.trim().toLowerCase().endsWith('.json'))

  const fetchStats = useCallback(async () => {
    if (!user) return
    try {
      // Trae documentos del usuario con id y file_name
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('id, file_name, category, created_at')
        .eq('user_id', user.id)

      if (documentsError) throw documentsError
      const documents: FetchedDocument[] = (documentsData as any) || []

      // Ranking (si existe la RPC)
      const { data: rankData, error: rankError } = await supabase.rpc('get_user_rank', {
        uid: user.id,
      })
      if (rankError) console.warn('Error RPC get_user_rank:', rankError)

      // Agregaciones
      const docsPorCategoria = documents.reduce((acc: Record<string, number>, doc) => {
        const key = doc.category || 'Sin categoría'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})

      const docsPorMes = documents.reduce((acc: Record<string, number>, doc) => {
        const date = new Date(doc.created_at)
        const mes = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        acc[mes] = (acc[mes] || 0) + 1
        return acc
      }, {})

      const recientes = [...documents]
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        .slice(0, 5)

      setStats({
        puntos: (perfil as any)?.points || 0,
        documentosTotales: documents.length,
        categorias: docsPorCategoria,
        porMes: docsPorMes,
        recientes,
      })

      setRanking(typeof rankData === 'number' ? rankData : null)

      // -------- Descargas recientes (opcional) --------
      try {
        const { data: logs } = await supabase
          .from('audit_logs') // ajusta si tu tabla se llama distinto
          .select('details, created_at, user_id, action')
          .eq('user_id', user.id)
          .eq('action', 'download')
          .order('created_at', { ascending: false })
          .limit(10)

        const ids = (logs || [])
          .map((l: any) => l?.details?.document_id as string | undefined)
          .filter(Boolean) as string[]

        if (ids.length) {
          const { data: docsForDownloads } = await supabase
            .from('documents')
            .select('id, file_name, category, created_at')
            .in('id', ids)

          setDownloads(((docsForDownloads || []) as FetchedDocument[]).slice(0, 5))
        } else {
          setDownloads([])
        }
      } catch {
        // Silencioso si no existe la tabla o schema distinto
        setDownloads([])
      }
    } catch (err) {
      const typedError = err as Error
      setError(`Error al cargar datos: ${typedError.message}`)
    } finally {
      setLoading(false)
    }
  }, [user, perfil])

  useEffect(() => {
    if (user && perfil) {
      fetchStats()
      const toastShown = sessionStorage.getItem('welcome_toast_shown')
      if (!toastShown) {
        sessionStorage.setItem('welcome_toast_shown', 'true')
        import('sonner').then(({ toast }) => toast.success('Bienvenido de vuelta 👋'))
      }
    } else if (!sessionLoading) {
      // si no hay usuario/perfil y ya terminó la carga de sesión,
      // dejamos que el redirect actúe
      setLoading(false)
    }
  }, [user, perfil, fetchStats, sessionLoading])

  // 🎯 Redirigir a /iniciar-sesion si no hay usuario
  useEffect(() => {
    if (!sessionLoading && !user) {
      router.replace('/iniciar-sesion')
    }
  }, [sessionLoading, user, router])

  // Celebración al cambiar de nivel (50 / 200 / 500+)
  useEffect(() => {
    if (!stats) return
    const lastTier = sessionStorage.getItem('last_tier') || 'none'
    const thisTier = getMedalla(stats.puntos).nivel
    if (thisTier !== lastTier) {
      sessionStorage.setItem('last_tier', thisTier)
      import('sonner').then(({ toast }) =>
        toast.success(`¡Ascendiste a ${thisTier}! 🥳`, { duration: 3200 }),
      )
      import('canvas-confetti').then((c) =>
        c.default({ particleCount: 120, spread: 70 }),
      )
    }
  }, [stats?.puntos])

  const colores = ['#93c5fd', '#a5f3fc', '#fcd34d', '#fca5a5', '#c4b5fd', '#d8b4fe']
  const pieData = stats?.categorias
    ? Object.entries(stats.categorias).map(([name, value]) => ({ name, value }))
    : []
  const lineData = stats?.porMes
    ? Object.entries(stats.porMes)
        .map(([mes, count]) => ({ mes, count }))
        .sort((a, b) => a.mes.localeCompare(b.mes))
    : []

  // 🔄 Mientras se carga sesión/datos o se está redirigiendo sin usuario
  if (sessionLoading || loading || (!user && !error)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin w-8 h-8 mb-4 text-blue-600" />
        <p className="text-lg">Cargando tu dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-red-500 dark:text-red-400">
        <p className="text-lg">😞 Ocurrió un error:</p>
        <p className="text-md mt-2">{error}</p>
      </div>
    )
  }

  // En este punto, normalmente ya hay usuario gracias al redirect
  if (!user || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-500 dark:text-gray-400">
        <p className="text-lg">No se encontraron datos para mostrar.</p>
      </div>
    )
  }

  const medalla = getMedalla(stats.puntos)

  return (
    <div className="w-full pt-4 pb-16 px-4 sm:px-6 lg:px-8">
      {/* HEADER / HERO */}
      <div className="mb-6 rounded-2xl border bg-white/70 dark:bg-zinc-900/60 backdrop-blur p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">
        {/* Avatar con anillo multicolor */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-28 w-28 sm:h-32 sm:w-32 rounded-full animate-spin-slow bg-[conic-gradient(#60a5fa,#a78bfa,#f472b6,#60a5fa)]" />
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden bg-white dark:bg-zinc-900 flex items-center justify-center ring-4 ring-white dark:ring-zinc-900">
            {isLottieAvatar && avatarUrl ? (
              <LottieAvatar src={avatarUrl} className="w-full h-full" />
            ) : (
              <img src={avatarUrl ?? '/avatar.png'} alt="Avatar" className="w-full h-full object-cover" />
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 text-2xl">{medalla.medalla.split(' ')[0]}</span>
          {isPremiumStatus && (
            <span className="absolute -top-2 -left-2 bg-yellow-400 text-zinc-900 rounded-full p-1 shadow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16l-1-9 6 4 2-6 2 6 6-4-1 9H5z" />
              </svg>
            </span>
          )}
        </div>

        {/* Info usuario */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            Hola, <span className="font-semibold">{(perfil as any)?.username}</span> 👋
          </p>
          <p className="text-xs text-gray-500">{(perfil as any)?.universidad}</p>
          {!statusLoading && (
            <div className="text-xs mt-1">
              {role === 'admin' && <span className="text-yellow-500">👑 Admin</span>}
              {isPremiumStatus && <span className="ml-2 text-blue-500">🌟 Premium</span>}
            </div>
          )}
          <div className="mt-2 text-sm">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-zinc-800 dark:text-blue-300">
              {medalla.medalla} {medalla.nivel}
            </span>
            {ranking !== null && (
              <span className="ml-2 text-xs text-gray-500">
                Ranking: <b>#{ranking}</b>
              </span>
            )}
          </div>
        </div>

        {/* Próximo hito */}
        <NextMilestone puntos={stats.puntos} />
      </div>

      {/* Banner premium contextual */}
      {!isPremium && (
        <div className="mb-6 rounded-2xl border bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-zinc-900 dark:to-zinc-900/40 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Desbloquea estadísticas avanzadas y pronósticos PRO</p>
            <p className="text-xs text-muted-foreground">
              Mapas de calor, comparativa histórica y alertas inteligentes
            </p>
          </div>
          <a
            href="/premium"
            className="px-3 py-1.5 rounded-xl bg-yellow-500 text-zinc-900 text-sm font-semibold hover:bg-yellow-400"
          >
            Hacerse Premium
          </a>
        </div>
      )}
      {isPremium && <PremiumBadge />}

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Subir documento', href: '/subir', emoji: '⬆️' },
          { label: 'Explorar', href: '/explorar', emoji: '🔎' },
          { label: 'Mis logros', href: '/dashboard/logros', emoji: '🏆' },
        ].map((a) => (
          <a
            key={a.href}
            href={a.href}
            className="group rounded-2xl p-4 bg-white dark:bg-zinc-900 border hover:shadow-lg transition flex items-center justify-between"
          >
            <span className="font-medium">
              {a.emoji} {a.label}
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition">→</span>
          </a>
        ))}
      </div>

      {/* Chips de logros */}
      <div className="flex flex-wrap gap-2 mb-4">
        {buildAchievementChips(stats.puntos).map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-zinc-800 dark:text-blue-300"
          >
            ⭐ {t}
          </span>
        ))}
      </div>

      {/* Progreso global */}
      <ProgressBar puntos={stats.puntos} />

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Documentos" value={stats.documentosTotales} icon={<FileText size={16} />} />
        <StatCard label="Categorías Únicas" value={pieData.length} icon={<Layers size={16} />} />
        <StatCard
          label="Puntos Acumulados"
          value={
            <div className="flex items-center gap-3">
              <span>{stats.puntos}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                {(Math.min(stats.puntos / 500, 1) * 100).toFixed(0)}%
              </span>
            </div>
          }
          icon={<Star size={16} />}
          color="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          label="Ranking Global"
          value={ranking !== null ? `#${ranking}` : 'N/A'}
          icon={<TrendingUp size={16} />}
          color="text-yellow-500 dark:text-yellow-400"
        />
        <StatCard
          label="Medalla"
          value={`${medalla.medalla} ${medalla.nivel}`}
          icon={<Award size={16} />}
          color={medalla.color}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="📁 Documentos por Categoría">
          {pieData.length ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const RADIAN = Math.PI / 180
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                    const x = cx + radius * Math.cos(-midAngle * RADIAN)
                    const y = cy + radius * Math.sin(-midAngle * RADIAN)
                    return percent > 0.05 ? (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                      >
                        {(percent * 100).toFixed(0)}%
                      </text>
                    ) : null
                  }}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} doc(s)`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <NoDataMessage />
          )}
        </ChartCard>

        <ChartCard title="📈 Actividad por Mes">
          {lineData.length ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="mes" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value: number) => `${value} doc(s)`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Documentos"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <NoDataMessage />
          )}
        </ChartCard>
      </div>

      {/* Recientes + Descargados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Subidos/creados recientemente */}
        <ChartCard title="🕘 Recientes">
          {stats.recientes && stats.recientes.length ? (
            <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
              {stats.recientes.map((d) => (
                <li key={d.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 grid place-items-center text-xs">
                      {(d.file_name || d.category || 'D')!.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{d.file_name || d.category || 'Documento'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(d.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <a href={`/vista-previa/${d.id}`} className="text-xs text-blue-600 hover:underline">
                    Ver
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <NoDataMessage />
          )}
        </ChartCard>

        {/* Descargados/abiertos recientemente */}
        <ChartCard title="⬇️ Descargados recientemente">
          {downloads.length ? (
            <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
              {downloads.map((d) => (
                <li key={d.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-xs">
                      {(d.file_name || d.category || 'D')!.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Download className="w-4 h-4 opacity-70" />
                        {d.file_name || d.category || 'Documento'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(d.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <a href={`/vista-previa/${d.id}`} className="text-xs text-blue-600 hover:underline">
                    Ver
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
              Sin descargas registradas.
            </p>
          )}
        </ChartCard>
      </div>
    </div>
  )
}

/* ---------------------- Helpers y subcomponentes inline ---------------------- */

function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string
  value: React.ReactNode | number | string
  color?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 shadow-md rounded-2xl p-5 flex flex-col gap-2 transition hover:shadow-lg hover:-translate-y-0.5">
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        {icon} {label}
      </div>
      <div className={`text-2xl font-semibold ${color || 'text-gray-900 dark:text-white'}`}>{value}</div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-800">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{title}</h2>
      {children}
    </div>
  )
}

function ProgressBar({ puntos }: { puntos: number }) {
  const goal = puntos < 50 ? 50 : puntos < 200 ? 200 : puntos < 500 ? 500 : 1000
  const percent = Math.min((puntos / goal) * 100, 100)
  return (
    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 w-full mb-6 overflow-hidden">
      <div
        className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

function NoDataMessage() {
  return (
    <div className="text-center py-10">
      <p className="text-gray-500 dark:text-gray-400 mb-3">Aún no hay datos</p>
      <a
        href="/subir"
        className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
      >
        Sube tu primer documento
      </a>
    </div>
  )
}

function NextMilestone({ puntos }: { puntos: number }) {
  const goal = puntos < 50 ? 50 : puntos < 200 ? 200 : puntos < 500 ? 500 : 1000
  const remain = Math.max(goal - puntos, 0)
  const percent = Math.min((puntos / goal) * 100, 100)
  return (
    <div className="w-full sm:w-auto">
      <p className="text-xs text-muted-foreground mb-1">
        Próximo hito: <b>{goal} pts</b> · Te faltan <b>{remain}</b>
      </p>
      <div className="h-3 w-full sm:w-64 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-3 bg-gradient-to-r from-blue-500 to-purple-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function getMedalla(puntos: number) {
  if (puntos >= 500) return { nivel: 'Experto', medalla: '🥇 Oro', color: 'text-yellow-500' }
  if (puntos >= 200) return { nivel: 'Avanzado', medalla: '🥈 Plata', color: 'text-gray-400' }
  if (puntos >= 50) return { nivel: 'Explorador', medalla: '🥉 Bronce', color: 'text-orange-400' }
  return { nivel: 'Nuevo', medalla: '🔰 Principiante', color: 'text-green-500' }
}

function buildAchievementChips(puntos: number) {
  const chips = ['Bienvenido']
  if (puntos >= 10) chips.push('10 pts')
  if (puntos >= 50) chips.push('Explorador')
  if (puntos >= 200) chips.push('Avanzado')
  if (puntos >= 500) chips.push('Experto')
  return chips.slice(-3)
}
