import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

// 🧠 Calcula el nivel y medalla según puntos
// src/lib/gamification.ts

export function obtenerNivelYMedalla(puntos: number) {
  if (puntos >= 500) {
    return {
      nivel: 'Experto',
      medalla: '🥇 Oro',
      color: 'text-yellow-600',
      next: null,
      progreso: 100,
      siguiente: null,
    };
  }
  if (puntos >= 200) {
    const progreso = Math.round(((puntos - 200) / (500 - 200)) * 100);
    return {
      nivel: 'Avanzado',
      medalla: '🥈 Plata',
      color: 'text-gray-400',
      next: 500,
      progreso,
      siguiente: 500,
    };
  }
  if (puntos >= 50) {
    const progreso = Math.round(((puntos - 50) / (200 - 50)) * 100);
    return {
      nivel: 'Explorador',
      medalla: '🥉 Bronce',
      color: 'text-orange-400',
      next: 200,
      progreso,
      siguiente: 200,
    };
  }

  const progreso = Math.round((puntos / 50) * 100);
  return {
    nivel: 'Nuevo',
    medalla: '🎓 Principiante',
    color: 'text-blue-500',
    next: 50,
    progreso,
    siguiente: 50,
  };
}


// ✅ Suma puntos al usuario y registra la acción
export async function sumarPuntos(userId: string, cantidad: number, motivo: string) {
  try {
    const { data: perfil, error } = await supabase
      .from('profiles')
      .select('puntos')
      .eq('id', userId)
      .single()

    if (error || !perfil) throw error

    const nuevosPuntos = (perfil.puntos || 0) + cantidad

    await supabase.from('profiles').update({ puntos: nuevosPuntos }).eq('id', userId)

    await supabase.from('audit_logs').insert([{
      user_id: userId,
      action: motivo,
      points_changed: cantidad,
      created_at: new Date().toISOString(),
    }])

    return nuevosPuntos
  } catch (e) {
    console.error('❌ Error al sumar puntos:', e)
    return null
  }
}

// 🏅 Registra un logro si no existe ya
export async function registrarLogro(userId: string, tipo: string) {
  try {
    const { data: existente } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement', tipo)
      .single()

    if (existente) return false

    await supabase.from('user_achievements').insert([{
      user_id: userId,
      achievement: tipo,
      created_at: new Date().toISOString(),
    }])

    return true
  } catch (e) {
    console.error('⚠️ Error al registrar logro:', e)
    return false
  }
}

// 🧩 Verifica si el usuario completó alguna misión
export async function checkMissions(userId: string) {
  try {
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('*')
      .eq('active', true)

    if (missionsError || !missions) throw missionsError

    const { data: completed, error: completedError } = await supabase
      .from('user_achievements')
      .select('mission_id')
      .eq('user_id', userId)

    if (completedError || !completed) throw completedError

    const completedIds = completed.map((ach) => ach.mission_id)

    const { data: logs, error: logsError } = await supabase
      .from('audit_logs')
      .select('action, created_at')
      .eq('user_id', userId)

    if (logsError || !logs) throw logsError

    const actionCount: Record<string, number> = {}
    logs.forEach((log) => {
      actionCount[log.action] = (actionCount[log.action] || 0) + 1
    })

    const uniqueDays = Array.from(new Set(logs.map(log => new Date(log.created_at).toDateString())))

    for (const mission of missions) {
      if (completedIds.includes(mission.id)) continue

      const condition = mission.condition || {}
      const countCond = condition.action_count || {}
      const streakCond = condition.login_streak || 0

      let cumple = true

      for (const [action, required] of Object.entries(countCond)) {
        if ((actionCount[action] || 0) < Number(required)) {
          cumple = false
          break
        }
      }

      if (streakCond > 0 && uniqueDays.length < streakCond) {
        cumple = false
      }

      if (cumple) {
        const { error: insertError } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            mission_id: mission.id
          })

        if (!insertError) {
          await supabase.rpc('increment_user_points', {
            uid: userId,
            points: mission.reward
          })
          toast.success(`🏆 Logro desbloqueado: ${mission.title}`)
        }
      }
    }
  } catch (e) {
    console.error('❌ Error al verificar misiones:', e)
  }
}
