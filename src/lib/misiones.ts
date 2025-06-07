// 📁 Archivo: lib/misiones.ts
import { supabase } from '@/lib/supabase'
import { sumarPuntos, registrarLogro } from '@/lib/points'

// ✅ Verifica misiones diarias al realizar una acción
export async function verificarMisiones(userId: string, accion: string) {
  try {
    const { data: misiones } = await supabase
      .rpc('get_user_daily_missions', { uid: userId })

    if (!misiones) return

    for (const mision of misiones) {
      if (!mision.completed && mision.accion === accion) {
        const nuevoProgreso = mision.progress + 1

        await supabase.rpc('update_user_mission_progress', {
          uid: userId,
          mission_id: mision.id,
          nuevo_valor: nuevoProgreso
        })

        // Si se completó la misión
        if (nuevoProgreso >= mision.goal) {
          await registrarLogro(userId, mision.id)
          await sumarPuntos(userId, mision.points_reward, `Misión completada: ${mision.title}`)
        }
      }
    }
  } catch (error) {
    console.error('Error al verificar misiones:', error)
  }
}
