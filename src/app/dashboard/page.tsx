'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/hooks/useSession'
import { useUserStatus } from '@/hooks/useUserStatus'
import { Loader2 } from 'lucide-react'
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
import DashboardLayout from '@/components/layouts/DashboardLayout'
import NotificationPanel from '@/components/NotificationPanel'
import PremiumBadge from '@/components/PremiumBadge'
import { useMembership } from '@/hooks/useMembership'

interface UserDashboardStats {
  puntos: number
  documentosTotales: number
  categorias: Record<string, number>
  porMes: Record<string, number>
}

interface FetchedDocument {
  category: string
  created_at: string
}

export default function DashboardPage() {
  const { user, perfil, loading: sessionLoading } = useSession()
  const { isPremium } = useMembership()
  const { role, isPremium: isPremiumStatus, loading: statusLoading } = useUserStatus()
  const [stats, setStats] = useState<UserDashboardStats | null>(null)
  const [ranking, setRanking] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!user) return

    try {
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('category, created_at')
        .eq('user_id', user.id)

      if (documentsError) throw documentsError
      const documents: FetchedDocument[] = documentsData || []

      const { data: rankData, error: rankError } = await supabase.rpc('get_user_rank', {
        uid: user.id,
      })
      if (rankError) console.warn('Error RPC get_user_rank:', rankError)

      const docsPorCategoria = documents.reduce((acc: Record<string, number>, doc) => {
        acc[doc.category] = (acc[doc.category] || 0) + 1
        return acc
      }, {})

      const docsPorMes = documents.reduce((acc: Record<string, number>, doc) => {
        const date = new Date(doc.created_at)
        const mes = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        acc[mes] = (acc[mes] || 0) + 1
        return acc
      }, {})

      setStats({
        puntos: perfil?.puntos || 0,
        documentosTotales: documents.length,
        categorias: docsPorCategoria,
        porMes: docsPorMes,
      })

      setRanking(typeof rankData === 'number' ? rankData : null)
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
    } else {
      setLoading(false)
    }
  }, [user, perfil, fetchStats])

  const colores = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#ec4899']
  const pieData = stats?.categorias
    ? Object.entries(stats.categorias).map(([name, value]) => ({ name, value }))
    : []
  const lineData = stats?.porMes
    ? Object.entries(stats.porMes)
        .map(([mes, count]) => ({ mes, count }))
        .sort((a, b) => a.mes.localeCompare(b.mes))
    : []

  if (sessionLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-500 dark:text-gray-400">
          <Loader2 className="animate-spin w-8 h-8 mb-4 text-blue-600" />
          <p className="text-lg">Cargando tu dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-red-500 dark:text-red-400">
          <p className="text-lg">😞 Ocurrió un error:</p>
          <p className="text-md mt-2">{error}</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!user || !stats) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-500 dark:text-gray-400">
          <p className="text-lg">No se encontraron datos para mostrar.</p>
        </div>
      </DashboardLayout>
    )
  }

  const medalla = getMedalla(stats.puntos)

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto mt-2 mb-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">📊 Mi Dashboard</h1>
            {!statusLoading && (
              <div className="mt-1 text-sm text-muted-foreground">
                {role === 'admin' && <span className="text-yellow-500">👑 Admin</span>}
                {isPremiumStatus && <span className="ml-2 text-blue-500">🌟 Premium</span>}
              </div>
            )}
          </div>
          <NotificationPanel userId={user.id} />
        </div>

        {isPremium && <PremiumBadge />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Documentos" value={stats.documentosTotales} />
          <StatCard label="Categorías Únicas" value={pieData.length} />
          <StatCard
            label="Puntos Acumulados"
            value={stats.puntos}
            color="text-purple-600 dark:text-purple-400"
          />
          <StatCard
            label="Ranking Global"
            value={ranking !== null ? `#${ranking}` : 'N/A'}
            color="text-yellow-500 dark:text-yellow-400"
          />
          <StatCard
            label="Medalla"
            value={`${medalla.medalla} ${medalla.nivel}`}
            color={medalla.color}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard title="📁 Documentos por Categoría">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
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
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
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
      </div>
    </DashboardLayout>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number | string
  color?: string
}) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5 transform transition hover:scale-105">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h3>
      <p className={`mt-1 text-3xl font-semibold ${color || 'text-gray-900 dark:text-white'}`}>
        {value}
      </p>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{title}</h2>
      {children}
    </div>
  )
}

function NoDataMessage() {
  return (
    <p className="text-center text-gray-500 dark:text-gray-400 py-10">No hay datos para mostrar.</p>
  )
}

function getMedalla(puntos: number) {
  if (puntos >= 500) return { nivel: 'Experto', medalla: '🥇 Oro', color: 'text-yellow-500' }
  if (puntos >= 200) return { nivel: 'Avanzado', medalla: '🥈 Plata', color: 'text-gray-400' }
  if (puntos >= 50) return { nivel: 'Explorador', medalla: '🥉 Bronce', color: 'text-orange-400' }
  return { nivel: 'Nuevo', medalla: '🔰 Principiante', color: 'text-green-500' }
}
