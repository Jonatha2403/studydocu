'use client'

import { useEffect, useState } from 'react'
import { obtenerNivelYMedalla } from '@/lib/gamification' // ✅ Asegúrate que la ruta es correcta
import { supabase } from '@/lib/supabase'

interface Props {
  userId: string
}

export default function GamificationBar({ userId }: Props) {
  const [puntos, setPuntos] = useState<number | null>(null)
  const [nivel, setNivel] = useState('')
  const [medalla, setMedalla] = useState('')
  const [progreso, setProgreso] = useState(0)
  const [meta, setMeta] = useState<number | null>(null)

  useEffect(() => {
    const obtenerPuntos = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('puntos')
        .eq('id', userId)
        .single()

      if (error || !data) return

      const puntosUsuario = data.puntos || 0
      setPuntos(puntosUsuario)

      const info = obtenerNivelYMedalla(puntosUsuario)
      setNivel(info.nivel)
      setMedalla(info.medalla)
      setProgreso(info.progreso)
      setMeta(info.siguiente)
    }

    if (userId) obtenerPuntos()
  }, [userId])

  return (
    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex justify-between items-center mb-2 text-sm text-gray-600 dark:text-gray-300">
        <span>🏆 Nivel: <strong>{nivel}</strong></span>
        <span>{medalla}</span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-500 dark:bg-yellow-400 h-4 transition-all duration-700 ease-in-out"
          style={{ width: `${progreso}%` }}
        />
      </div>

      {puntos !== null && meta && (
        <div className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
          {puntos} puntos • Próxima medalla en <strong>{meta - puntos}</strong> pts
        </div>
      )}
    </div>
  )
}
