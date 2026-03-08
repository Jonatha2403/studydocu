'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useUserContext } from '@/context/UserContext'
import { useUserStatus } from '@/hooks/useUserStatus'
import { useMembership } from '@/hooks/useMembership'
import {
  Loader2,
  FileText,
  Star,
  Layers,
  TrendingUp,
  Award,
  Download,
  Sparkles,
} from 'lucide-react'
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
import { getAvatarImageSrc, getCleanAvatarUrl, isLottieAvatar } from '@/lib/avatar'
import { ACHIEVEMENTS_CATALOG } from '@/lib/achievementsCatalog'

type UserDashboardStats = {
  puntos: number
  documentosTotales: number
  categorias: Record<string, number>
  porMes: Record<string, number>
  recientes?: FetchedDocument[]
}

type FetchedDocument = {
  id: string
  file_name?: string | null
  category: string | null
  created_at: string
}

type PointMovement = {
  action: string | null
  points_changed: number | null
  created_at: string
}

export default function DashboardPage() {
  const { user, perfil, loading: sessionLoading } = useUserContext()
  const { isPremium } = useMembership()
  const { role, isPremium: isPremiumStatus, loading: statusLoading } = useUserStatus()

  const [stats, setStats] = useState<UserDashboardStats | null>(null)
  const [ranking, setRanking] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloads, setDownloads] = useState<FetchedDocument[]>([])
  const [freeDownloadsUsed, setFreeDownloadsUsed] = useState(0)
  const [pointMovements, setPointMovements] = useState<PointMovement[]>([])
  const [unlockedAchievementKeys, setUnlockedAchievementKeys] = useState<string[]>([])

  const FREE_DOWNLOAD_LIMIT = 2
  const POINTS_PER_DOWNLOAD = 15

  const router = useRouter()

  const avatarUrl = (perfil as any)?.avatar_url as string | undefined
  const avatarClean = getCleanAvatarUrl(avatarUrl)
  const isLottieAvatarSelected = isLottieAvatar(avatarUrl)
  const avatarImageSrc = getAvatarImageSrc(avatarUrl, (perfil as any)?.updated_at as string)

  const fetchStats = useCallback(async () => {
    if (!user) return
    try {
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('id, file_name, category, created_at')
        .eq('user_id', user.id)

      if (documentsError) throw documentsError
      const documents: FetchedDocument[] = (documentsData as any) || []

      const { data: rankData, error: rankError } = await supabase.rpc('get_user_rank', {
        uid: user.id,
      })
      if (rankError) console.warn('Error RPC get_user_rank:', rankError)

      const docsPorCategoria = documents.reduce((acc: Record<string, number>, doc) => {
        const key = doc.category || 'Sin categoria'
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

      try {
        const [{ data: movementsData }, { count: freeCount }, { data: achievementsData }] =
          await Promise.all([
            supabase
              .from('audit_logs')
              .select('action, points_changed, created_at')
              .eq('user_id', user.id)
              .not('points_changed', 'is', null)
              .order('created_at', { ascending: false })
              .limit(20),
            supabase
              .from('audit_logs')
              .select('id', { head: true, count: 'exact' })
              .eq('user_id', user.id)
              .eq('action', 'download')
              .contains('details', { access_mode: 'free' }),
            supabase
              .from('user_achievements')
              .select('achievement_key, achievement')
              .eq('user_id', user.id),
          ])

        setPointMovements((movementsData || []) as PointMovement[])
        setFreeDownloadsUsed(Number(freeCount ?? 0))
        const keys = ((achievementsData || []) as any[])
          .map((row) => String(row?.achievement_key || row?.achievement || '').trim())
          .filter(Boolean)
        setUnlockedAchievementKeys(Array.from(new Set(keys)))
      } catch {
        setPointMovements([])
        setFreeDownloadsUsed(0)
        setUnlockedAchievementKeys([])
      }

      try {
        const { data: logs } = await supabase
          .from('audit_logs')
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
        import('sonner').then(({ toast }) => toast.success('Bienvenido de vuelta'))
      }
    } else if (!sessionLoading) {
      setLoading(false)
    }
  }, [user, perfil, fetchStats, sessionLoading])

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.replace('/iniciar-sesion')
    }
  }, [sessionLoading, user, router])

  useEffect(() => {
    if (!stats) return
    const lastTier = sessionStorage.getItem('last_tier') || 'none'
    const thisTier = getMedalla(stats.puntos).nivel
    if (thisTier !== lastTier) {
      sessionStorage.setItem('last_tier', thisTier)
      import('sonner').then(({ toast }) => toast.success(`Subiste a ${thisTier}`))
    }
  }, [stats])

  const colores = ['#93c5fd', '#a5f3fc', '#fcd34d', '#fca5a5', '#c4b5fd', '#d8b4fe']
  const pieData = stats?.categorias
    ? Object.entries(stats.categorias).map(([name, value]) => ({ name, value }))
    : []
  const lineData = stats?.porMes
    ? Object.entries(stats.porMes)
        .map(([mes, count]) => ({ mes, count }))
        .sort((a, b) => a.mes.localeCompare(b.mes))
    : []

  if (sessionLoading || (!user && !error)) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-600" />
        <p className="text-lg">Cargando tu dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-red-500 dark:text-red-400">
        <p className="text-lg">Ocurrio un error</p>
        <p className="mt-2 text-md">{error}</p>
      </div>
    )
  }

  if (!user) return null

  const puntosUi = stats?.puntos ?? ((perfil as any)?.points || 0)
  const medalla = getMedalla(puntosUi)
  const remainingFreeDownloads = Math.max(0, FREE_DOWNLOAD_LIMIT - freeDownloadsUsed)
  const paidDownloadsAvailable = Math.floor(Math.max(0, puntosUi) / POINTS_PER_DOWNLOAD)
  const unlockedAchievementsCount = unlockedAchievementKeys.length
  const totalAchievements = ACHIEVEMENTS_CATALOG.length
  const lockedAchievementsCount = Math.max(0, totalAchievements - unlockedAchievementsCount)
  const docsUploaded = Number(stats?.documentosTotales ?? 0)
  const docsForFiveUploads = Math.max(0, 5 - docsUploaded)
  const nextAchievementHint = !unlockedAchievementKeys.includes('five_uploads')
    ? docsForFiveUploads > 0
      ? `Siguiente logro recomendado: sube ${docsForFiveUploads} documento(s) mas para "Colaborador Activo".`
      : 'Siguiente logro recomendado: "Colaborador Activo" se desbloqueara al validar tus 5 subidas.'
    : !unlockedAchievementKeys.includes('popular_doc')
      ? 'Siguiente logro recomendado: consigue 10 likes en un documento para "Documento Popular".'
      : 'Ya completaste los logros base. Sigue subiendo documentos para ganar mas puntos y desbloquear futuras misiones.'
  const lastPointsMovement = pointMovements.find((m) => Number(m.points_changed || 0) !== 0) || null

  return (
    <div className="w-full px-3 pb-16 pt-3 sm:px-6">
      <section className="mb-6 rounded-2xl border bg-background p-4 sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-28 w-28 animate-spin-slow rounded-full bg-[conic-gradient(#60a5fa,#a78bfa,#f472b6,#60a5fa)]" />
            <div className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-white ring-4 ring-white dark:bg-zinc-900 dark:ring-zinc-900 sm:h-24 sm:w-24">
              {isLottieAvatarSelected && avatarClean ? (
                <LottieAvatar src={avatarClean} className="h-full w-full" />
              ) : (
                <img
                  src={avatarImageSrc ?? '/avatar.png'}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 text-2xl">
              {medalla.medalla.split(' ')[0]}
            </span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              Hola, <span className="font-semibold">{(perfil as any)?.username}</span>
            </p>
            <p className="text-xs text-gray-500">{(perfil as any)?.universidad}</p>
            {!statusLoading && (
              <div className="mt-1 text-xs">
                {role === 'admin' && <span className="text-yellow-500">Admin</span>}
                {isPremiumStatus && <span className="ml-2 text-blue-500">Premium</span>}
              </div>
            )}
            <div className="mt-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-blue-700 dark:bg-zinc-800 dark:text-blue-300">
                {medalla.medalla} {medalla.nivel}
              </span>
              {ranking !== null && (
                <span className="ml-2 text-xs text-gray-500">
                  Ranking: <b>#{ranking}</b>
                </span>
              )}
            </div>
          </div>

          <NextMilestone puntos={puntosUi} />
        </div>
      </section>

      {!isPremium && (
        <section className="mb-6 flex items-center justify-between gap-4 rounded-2xl border bg-gradient-to-r from-amber-50 to-yellow-50 p-4 dark:from-zinc-900 dark:to-zinc-900/40">
          <div>
            <p className="text-sm font-medium">Desbloquea estadisticas avanzadas</p>
            <p className="text-xs text-muted-foreground">
              Mapas de calor, comparativas y alertas inteligentes
            </p>
          </div>
          <a
            href="/premium"
            className="rounded-xl bg-yellow-500 px-3 py-1.5 text-sm font-semibold text-zinc-900 hover:bg-yellow-400"
          >
            Hacerse Premium
          </a>
        </section>
      )}
      {isPremium && <PremiumBadge />}

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Subir documento', href: '/subir' },
          { label: 'Explorar', href: '/explorar' },
          { label: 'Mis logros', href: '/dashboard/logros' },
        ].map((a) => (
          <a
            key={a.href}
            href={a.href}
            className="group flex items-center justify-between rounded-2xl border bg-background p-4 transition hover:shadow-lg"
          >
            <span className="font-medium">{a.label}</span>
            <span className="opacity-0 transition group-hover:opacity-100">Ir</span>
          </a>
        ))}
      </section>

      <section className="mb-4 flex flex-wrap gap-2">
        {buildAchievementChips(puntosUi).map((t) => (
          <span
            key={t}
            className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-zinc-800 dark:text-blue-300"
          >
            <Sparkles className="mr-1 inline h-3 w-3" />
            {t}
          </span>
        ))}
      </section>

      <ProgressBar puntos={puntosUi} />

      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Estado de puntos y descargas">
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Saldo actual</p>
                <p className="text-xl font-semibold">{puntosUi} pts</p>
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Gratis disponibles</p>
                <p className="text-xl font-semibold">
                  {remainingFreeDownloads}/{FREE_DOWNLOAD_LIMIT}
                </p>
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Descargas por puntos</p>
                <p className="text-xl font-semibold">{paidDownloadsAvailable}</p>
              </div>
            </div>
            <p className="rounded-lg border-l-4 border-blue-500 bg-blue-50 px-3 py-2 text-xs text-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
              Resumen rapido: primero usas tus 2 descargas gratis. Luego, cada descarga nueva
              descuenta {POINTS_PER_DOWNLOAD} puntos. Si repites el mismo documento, no descuenta.
            </p>
          </div>
        </ChartCard>

        <ChartCard title="Progreso de logros y actividad">
          <div className="space-y-3 text-sm">
            <p>
              <b>Logros desbloqueados:</b> {unlockedAchievementsCount}/{totalAchievements}
            </p>
            <p>
              <b>Logros pendientes:</b> {lockedAchievementsCount}
            </p>
            <p className="text-muted-foreground">{nextAchievementHint}</p>
            <p>
              <b>Ultimo movimiento de puntos:</b>{' '}
              {lastPointsMovement
                ? `${lastPointsMovement.points_changed! > 0 ? '+' : ''}${lastPointsMovement.points_changed} pts (${lastPointsMovement.action || 'accion'}) - ${new Date(lastPointsMovement.created_at).toLocaleString()}`
                : 'Sin movimientos registrados'}
            </p>
          </div>
        </ChartCard>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Documentos"
          value={loading ? '...' : (stats?.documentosTotales ?? 0)}
          icon={<FileText size={16} />}
        />
        <StatCard
          label="Categorias"
          value={loading ? '...' : pieData.length}
          icon={<Layers size={16} />}
        />
        <StatCard
          label="Saldo de puntos"
          value={
            <div className="flex items-center gap-3">
              <span>{loading ? '...' : puntosUi}</span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/40 dark:text-green-300">
                {loading ? '...' : `${(Math.min(puntosUi / 500, 1) * 100).toFixed(0)}%`}
              </span>
            </div>
          }
          icon={<Star size={16} />}
          color="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          label="Ranking"
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
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Documentos por categoria">
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
            <NoDataMessage loading={loading} />
          )}
        </ChartCard>

        <ChartCard title="Actividad por mes">
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
            <NoDataMessage loading={loading} />
          )}
        </ChartCard>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Recientes">
          {stats?.recientes && stats.recientes.length ? (
            <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
              {stats.recientes.map((d) => (
                <li key={d.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {(d.file_name || d.category || 'D')!.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {d.file_name || d.category || 'Documento'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(d.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/vista-previa/${d.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Ver
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <NoDataMessage loading={loading} />
          )}
        </ChartCard>

        <ChartCard title="Descargados recientemente">
          {downloads.length ? (
            <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
              {downloads.map((d) => (
                <li key={d.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-xs text-emerald-700">
                      {(d.file_name || d.category || 'D')!.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-medium">
                        <Download className="h-4 w-4 opacity-70" />
                        {d.file_name || d.category || 'Documento'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(d.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/vista-previa/${d.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Ver
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <NoDataMessage loading={loading} compact emptyText="Sin descargas registradas." />
          )}
        </ChartCard>
      </section>
    </div>
  )
}

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
    <div className="flex flex-col gap-2 rounded-2xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon} {label}
      </div>
      <div className={`text-2xl font-semibold ${color || 'text-gray-900 dark:text-white'}`}>
        {value}
      </div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-background p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">{title}</h2>
      {children}
    </div>
  )
}

function ProgressBar({ puntos }: { puntos: number }) {
  const goal = puntos < 50 ? 50 : puntos < 200 ? 200 : puntos < 500 ? 500 : 1000
  const percent = Math.min((puntos / goal) * 100, 100)
  return (
    <div className="mb-6 h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
      <div
        className="h-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

function NoDataMessage({
  loading = false,
  compact = false,
  emptyText = 'Aun no hay datos',
}: {
  loading?: boolean
  compact?: boolean
  emptyText?: string
}) {
  if (loading) {
    return (
      <div className={`text-center ${compact ? 'py-8' : 'py-10'}`}>
        <p className="text-gray-500 dark:text-gray-400">Cargando datos...</p>
      </div>
    )
  }

  return (
    <div className={`text-center ${compact ? 'py-8' : 'py-10'}`}>
      <p className="mb-3 text-gray-500 dark:text-gray-400">{emptyText}</p>
      <a
        href="/subir"
        className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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
      <p className="mb-1 text-xs text-muted-foreground">
        Saldo actual: <b>{puntos} pts</b> · Siguiente meta: <b>{goal} pts</b> · Te faltan{' '}
        <b>{remain} pts</b>
      </p>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 sm:w-64">
        <div
          className="h-3 bg-gradient-to-r from-blue-500 to-purple-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function getMedalla(puntos: number) {
  if (puntos >= 500) return { nivel: 'Experto', medalla: 'Oro', color: 'text-yellow-500' }
  if (puntos >= 200) return { nivel: 'Avanzado', medalla: 'Plata', color: 'text-gray-400' }
  if (puntos >= 50) return { nivel: 'Explorador', medalla: 'Bronce', color: 'text-orange-400' }
  return { nivel: 'Nuevo', medalla: 'Inicial', color: 'text-green-500' }
}

function buildAchievementChips(puntos: number) {
  const chips = ['Bienvenido']
  if (puntos >= 10) chips.push('10 pts')
  if (puntos >= 50) chips.push('Explorador')
  if (puntos >= 200) chips.push('Avanzado')
  if (puntos >= 500) chips.push('Experto')
  return chips.slice(-3)
}
