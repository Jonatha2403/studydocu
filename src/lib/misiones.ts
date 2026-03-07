import { supabase } from '@/lib/supabase'
import { registrarLogro, sumarPuntos } from '@/lib/gamification'

export async function verificarMisiones(userId: string, accion: string) {
  try {
    const { data: misiones } = await supabase.rpc('get_user_daily_missions', { uid: userId })
    if (!misiones) return

    for (const mision of misiones) {
      if (mision.completed || mision.accion !== accion) continue

      const nuevoProgreso = Number(mision.progress || 0) + 1

      await supabase.rpc('update_user_mission_progress', {
        uid: userId,
        mission_id: mision.id,
        nuevo_valor: nuevoProgreso,
      })

      if (nuevoProgreso >= Number(mision.goal || 0)) {
        await registrarLogro(userId, String(mision.key || mision.id))
        await sumarPuntos(
          userId,
          Number(mision.points_reward || 0),
          `Mision completada: ${mision.title}`
        )
      }
    }
  } catch (error) {
    console.error('Error al verificar misiones:', error)
  }
}
