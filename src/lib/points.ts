import { supabase } from './supabase'

// ✅ Resta 1 punto al usuario y registra en historial
export async function removePoints(userId: string, action: string): Promise<void> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('puntos')
      .eq('id', userId)
      .single()

    if (error || !profile) throw new Error(error?.message || 'Perfil no encontrado')

    const newPoints = Math.max((profile.puntos || 0) - 1, 0)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ puntos: newPoints })
      .eq('id', userId)

    if (updateError) throw updateError

    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      points_changed: -1,
      created_at: new Date().toISOString(),
    })
  } catch (e) {
    console.error('❌ Error al restar puntos:', e)
  }
}

// ✅ Suma puntos al usuario y registra acción
export async function sumarPuntos(userId: string, cantidad: number, motivo: string): Promise<number | null> {
  try {
    const { data: perfil, error } = await supabase
      .from('profiles')
      .select('puntos')
      .eq('id', userId)
      .single()

    if (error || !perfil) throw new Error(error?.message || 'Perfil no encontrado')

    const nuevosPuntos = (perfil.puntos || 0) + cantidad

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ puntos: nuevosPuntos })
      .eq('id', userId)

    if (updateError) throw updateError

    await supabase.from('audit_logs').insert({
      user_id: userId,
      action: motivo,
      points_changed: cantidad,
      created_at: new Date().toISOString(),
    })

    return nuevosPuntos
  } catch (e) {
    console.error('❌ Error al sumar puntos:', e)
    return null
  }
}

// 🏅 Registrar logro si aún no ha sido obtenido
export async function registrarLogro(userId: string, tipo: string): Promise<boolean> {
  try {
    const { data: existente, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement', tipo)
      .maybeSingle()

    if (error) throw error
    if (existente) return false

    const { error: insertError } = await supabase.from('user_achievements').insert({
      user_id: userId,
      achievement: tipo,
      created_at: new Date().toISOString(),
    })

    if (insertError) throw insertError

    return true
  } catch (e) {
    console.error('⚠️ Error al registrar logro:', e)
    return false
  }
}

// 🧠 Determina nivel y medalla del usuario por puntos
export function obtenerNivelYMedalla(puntos: number) {
  if (puntos >= 500) return {
    nivel: 'Experto',
    medalla: '🥇 Oro',
    progreso: 100,
    siguiente: null
  }
  if (puntos >= 200) return {
    nivel: 'Avanzado',
    medalla: '🥈 Plata',
    progreso: (puntos / 500) * 100,
    siguiente: 500
  }
  if (puntos >= 50) return {
    nivel: 'Explorador',
    medalla: '🥉 Bronce',
    progreso: (puntos / 200) * 100,
    siguiente: 200
  }
  return {
    nivel: 'Nuevo',
    medalla: '🎓 Principiante',
    progreso: (puntos / 50) * 100,
    siguiente: 50
  }
}
