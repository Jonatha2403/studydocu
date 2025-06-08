'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, AlertTriangle, Trophy, ListChecks } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { obtenerNivelYMedalla } from '@/lib/gamification'

interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  points: number
}

export default function RankingTable() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, points')
          .not('username', 'is', null)
          .order('points', { ascending: false })
          .limit(50)

        if (error) throw error
        setUsers(data || [])
      } catch {
        setError('No se pudo cargar el ranking. Inténtalo de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchRanking()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 text-gray-600 dark:text-gray-400">
        <Loader2 className="animate-spin w-10 h-10 mb-4 text-blue-600 dark:text-yellow-400" />
        <p className="text-lg">Cargando ranking de usuarios...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-6 rounded-lg shadow-md">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <p className="text-xl font-semibold">¡Ups! Algo salió mal</p>
        <p className="text-md">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl selection:bg-yellow-400 selection:text-black">
      <div className="flex items-center mb-6">
        <ListChecks className="w-8 h-8 text-blue-600 dark:text-yellow-400 mr-3" />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          🏆 Ranking de Usuarios
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700/50">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 w-16">
                Puesto
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                Nivel
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                Puntos
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user, index) => {
              const { nivel, medalla } = obtenerNivelYMedalla(user.points || 0)

              return (
                <motion.tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.025 }}
                >
                  <td className="px-4 py-3 text-center">
                    {index < 3 ? (
                      <Trophy
                        className={`w-5 h-5 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`}
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {index + 1}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 border-2 border-transparent group-hover:border-blue-500 dark:group-hover:border-yellow-400 transition-all">
                        <AvatarImage
                          src={user.avatar_url || undefined}
                          alt={user.username || 'Avatar'}
                        />
                        <AvatarFallback>
                          {user.username?.slice(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <Link href={`/perfil/usuario/${user.username}`}>
                        <span className="font-medium text-blue-600 dark:text-yellow-300 hover:underline">
                          @{user.username}
                        </span>
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {medalla} - {nivel}
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-blue-600 dark:text-yellow-400">
                    {user.points.toLocaleString()}
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Link
        href="/subir"
        className="fixed bottom-6 right-6 bg-yellow-400 text-black font-bold px-5 py-3 rounded-full shadow-lg hover:bg-yellow-300 transition"
      >
        📤 Sube tu documento
      </Link>
    </div>
  )
}
