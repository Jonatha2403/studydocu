'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Trophy } from 'lucide-react'
import Link from 'next/link'

interface RankingItem {
  username: string
  total_descargas: number
}

interface DocumentoConPerfil {
  downloads: number | null
  profiles: { username: string | null }[] | null
}

export default function RankingExploradores() {
  const [ranking, setRanking] = useState<RankingItem[]>([])

  useEffect(() => {
    const obtenerRanking = async () => {
      const { data, error } = await supabase
        .from('documents')
        .select(
          `
          downloads,
          profiles (
            username
          )
        `
        )
        .eq('status', 'aprobado')
        .is('downloads', 'not.null')

      if (error || !data) {
        console.error(error)
        return
      }

      const acumulado: Record<string, number> = {}

      data.forEach((doc: DocumentoConPerfil) => {
        const username = doc.profiles?.[0]?.username
        const downloads = doc.downloads || 0
        if (username) {
          acumulado[username] = (acumulado[username] || 0) + downloads
        }
      })

      const top3 = Object.entries(acumulado)
        .map(([username, total_descargas]) => ({ username, total_descargas }))
        .sort((a, b) => b.total_descargas - a.total_descargas)
        .slice(0, 3)

      setRanking(top3)
    }

    obtenerRanking()
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mt-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200 flex items-center">
        <Trophy className="w-4 h-4 mr-2 text-yellow-500" /> Top Exploradores
      </h3>
      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
        {ranking.length > 0 ? (
          ranking.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <Link
                href={`/perfil/usuario/${item.username}`}
                className="hover:underline text-primary"
              >
                @{item.username}
              </Link>
              <span className="text-xs">{item.total_descargas} descargas</span>
            </li>
          ))
        ) : (
          <li className="text-gray-500 dark:text-gray-400">No hay datos aún.</li>
        )}
      </ul>
    </div>
  )
}
