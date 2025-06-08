'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Mision {
  id: string
  title: string
  description: string
  goal: number
  points_reward: number
  completed: boolean
  progress: number
}

export default function MisionesDiarias({ userId }: { userId: string }) {
  const [misiones, setMisiones] = useState<Mision[]>([])
  const [loading, setLoading] = useState(false)

  const cargarMisiones = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('get_user_daily_missions', { uid: userId })
      if (error) throw error
      if (data) setMisiones(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      toast.error('❌ Error al cargar misiones', { description: msg })
    } finally {
      setLoading(false)
    }
  }, [userId])

  const completarMision = async (m: Mision) => {
    if (m.completed || m.progress < m.goal) return

    try {
      await supabase.from('audit_logs').insert([
        {
          user_id: userId,
          action: `Misión completada: ${m.title}`,
          points_changed: m.points_reward,
          created_at: new Date().toISOString(),
        },
      ])

      toast.success('🎉 Misión completada', {
        description: `Ganaste +${m.points_reward} puntos por "${m.title}"`,
      })

      await cargarMisiones()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      toast.error('❌ No se pudo completar la misión', { description: msg })
    }
  }

  useEffect(() => {
    if (userId) void cargarMisiones()
  }, [userId, cargarMisiones])

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-md mt-6">
      <h2 className="text-lg font-semibold mb-3">🎯 Misiones diarias</h2>

      {loading && <p className="text-sm text-gray-500">Cargando misiones...</p>}
      {!loading && misiones.length === 0 && (
        <p className="text-sm text-gray-500">No hay misiones cargadas.</p>
      )}

      <ul className="space-y-3">
        {misiones.map((m) => (
          <li
            key={m.id}
            className="border-b pb-3 cursor-pointer"
            onClick={() => completarMision(m)}
          >
            <p className="font-medium flex items-center">
              {m.completed && <CheckCircle2 className="text-green-500 w-4 h-4 mr-2" />}
              {m.title}
            </p>
            <p className="text-sm text-gray-500">{m.description}</p>
            <div className="text-xs mt-1">
              Progreso: {m.progress}/{m.goal} · Recompensa: +{m.points_reward} puntos
              {m.completed && (
                <span className="ml-2 text-green-600 font-semibold">✔ Completada</span>
              )}
            </div>
            <motion.div className="h-2 rounded bg-gray-200 dark:bg-gray-700 mt-2">
              <motion.div
                className="h-2 bg-blue-500 rounded"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((m.progress / m.goal) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </li>
        ))}
      </ul>
    </div>
  )
}
