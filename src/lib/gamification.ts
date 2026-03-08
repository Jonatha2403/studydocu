// src/lib/gamification.ts
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

declare const window: any
function lanzarConfeti() {
  if (typeof window !== 'undefined' && typeof window?.launchConfetti === 'function') {
    window.launchConfetti()
  }
}

/* ────────────────────────────────────────────────
 🧠 Nivel y medalla según puntos
──────────────────────────────────────────────── */
export function obtenerNivelYMedalla(puntos: number) {
  if (puntos >= 500) {
    return {
      nivel: 'Experto',
      medalla: '🥇 Oro',
      color: 'text-yellow-600',
      next: null,
      progreso: 100,
      siguiente: null,
    }
  }
  if (puntos >= 200) {
    const progreso = Math.round(((puntos - 200) / 300) * 100)
    return {
      nivel: 'Avanzado',
      medalla: '🥈 Plata',
      color: 'text-gray-400',
      next: 500,
      progreso,
      siguiente: 500,
    }
  }
  if (puntos >= 50) {
    const progreso = Math.round(((puntos - 50) / 150) * 100)
    return {
      nivel: 'Explorador',
      medalla: '🥉 Bronce',
      color: 'text-orange-400',
      next: 200,
      progreso,
      siguiente: 200,
    }
  }
  const progreso = Math.round((puntos / 50) * 100)
  return {
    nivel: 'Nuevo',
    medalla: '🎓 Principiante',
    color: 'text-blue-500',
    next: 50,
    progreso,
    siguiente: 50,
  }
}

/* ────────────────────────────────────────────────
 ✅ Suma puntos de forma atómica (RPC) y registra log (opcional)
   - Usa public.profiles_public.points
   - Evita romperse si audit_logs no existe
──────────────────────────────────────────────── */
export async function sumarPuntos(userId: string, cantidad: number, motivo: string) {
  try {
    if (!userId) throw new Error('ID de usuario no definido')
    if (!Number.isFinite(cantidad)) throw new Error('Cantidad inválida')

    // 1) Suma atómica (bypass RLS con SECURITY DEFINER)
    const { error: rpcError } = await supabase.rpc('add_points', {
      p_user: userId,
      p_delta: cantidad,
    })
    if (rpcError) throw new Error(rpcError.message || 'No se pudo sumar puntos')

    // 2) Obtener puntos actuales
    const { data: perfil, error: fetchError } = await supabase
      .from('profiles_public')
      .select('points')
      .eq('id', userId)
      .single()
    if (fetchError) throw new Error(fetchError.message || 'No se pudo leer el perfil')

    const nuevosPuntos = perfil?.points ?? null

    // 3) Registrar log (si existe la tabla). Si no existe, se ignora.
    try {
      // Intento rápido de insertar; si la tabla no existe (42P01) o columnas no calzan, no romper.
      const logRow: Record<string, any> = {
        user_id: userId,
        action: motivo || 'sumar_puntos',
        created_at: new Date().toISOString(),
        points_changed: cantidad, // si no existe la columna, el insert fallará y lo ignoramos
      }
      await supabase.from('audit_logs').insert([logRow])
    } catch {
      // Ignorar silenciosamente: tabla/columnas pueden no existir en este proyecto
    }

    return nuevosPuntos
  } catch (e: any) {
    console.error('❌ Error al sumar puntos:', e?.message || e)
    return null
  }
}

/* ────────────────────────────────────────────────
 🏅 Registra un logro si no existe (tolerante a esquema)
──────────────────────────────────────────────── */
export async function registrarLogro(userId: string, tipo: string) {
  try {
    if (!userId || !tipo) return false

    const { data: existente } = await supabase
      .from('user_achievements')
      .select('achievement_key, achievement')
      .eq('user_id', userId)
      .or(`achievement_key.eq.${tipo},achievement.eq.${tipo}`)

    if ((existente || []).length > 0) return false

    const nowIso = new Date().toISOString()
    const firstTry = await supabase.from('user_achievements').insert([
      {
        user_id: userId,
        achievement_key: tipo,
        unlocked: true,
        created_at: nowIso,
      },
    ])
    if (firstTry.error) {
      const secondTry = await supabase.from('user_achievements').insert([
        {
          user_id: userId,
          achievement: tipo,
          unlocked: true,
          created_at: nowIso,
        },
      ])
      if (secondTry.error) throw secondTry.error
    }

    toast.success(`🏅 Logro desbloqueado: ${tipo}`)
    lanzarConfeti()
    return true
  } catch (e: any) {
    // Si la tabla no existe o RLS no permite, no rompas la app
    console.warn('⚠️ registrarLogro (no crítico):', e?.message || e)
    return false
  }
}

/* ────────────────────────────────────────────────
 🧩 Verifica misiones y otorga recompensa
   - Suma puntos con RPC add_points
   - Tolera ausencia de tablas
──────────────────────────────────────────────── */
export async function checkMissions(userId: string) {
  try {
    if (!userId) return

    // 1) Misiones activas
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('*')
      .eq('active', true)
    if (missionsError || !missions) return

    // 2) Logros ya completados (por mission_id)
    const { data: completed } = await supabase
      .from('user_achievements')
      .select('mission_id')
      .eq('user_id', userId)

    const completedIds = (completed || []).map((ach: any) => ach.mission_id).filter(Boolean)

    // 3) Logs de acciones del usuario
    const { data: logs } = await supabase
      .from('audit_logs')
      .select('action, created_at')
      .eq('user_id', userId)

    const actionCount: Record<string, number> = {}
    ;(logs || []).forEach((log: any) => {
      if (!log?.action) return
      actionCount[log.action] = (actionCount[log.action] || 0) + 1
    })

    const uniqueDays = Array.from(
      new Set((logs || []).map((log: any) => new Date(log.created_at).toDateString()))
    )

    // 4) Evaluar condiciones
    for (const mission of missions) {
      if (!mission) continue
      if (completedIds.includes(mission.id)) continue

      const condition = mission.condition || {}
      const countCond = condition.action_count || {}
      const streakCond = Number(condition.login_streak || 0)

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

      if (!cumple) continue

      // 5) Registrar logro y sumar recompensa
      try {
        const { error: insertError } = await supabase.from('user_achievements').insert({
          user_id: userId,
          mission_id: mission.id,
          achievement_key: mission.key || null,
          unlocked: true,
          created_at: new Date().toISOString(),
        })

        if (!insertError) {
          const reward = Number(mission.reward || 0)
          if (reward > 0) {
            await supabase.rpc('add_points', { p_user: userId, p_delta: reward })
          }
          toast.success(`🏆 Logro desbloqueado: ${mission.title || 'Misión completada'}`)
          lanzarConfeti()
        }
      } catch (e) {
        console.warn('⚠️ checkMissions logro/reward:', (e as any)?.message || e)
      }
    }
  } catch (e: any) {
    console.error('❌ Error al verificar misiones:', e?.message || e)
  }
}
