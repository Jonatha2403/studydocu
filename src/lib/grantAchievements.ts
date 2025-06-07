import { supabase } from '@/lib/supabase'

interface Achievement {
  key: string
  name: string
}

const ACHIEVEMENTS_CATALOG: Achievement[] = [
  { key: 'first_upload', name: 'Primer Documento' },
  { key: 'five_uploads', name: 'Colaborador Activo' },
  { key: 'popular_doc', name: 'Documento Popular' },
  // Puedes agregar más aquí si haces validaciones para ellos
]

export async function checkAndGrantAchievements(userId: string): Promise<{ name: string }[]> {
  const grantedAchievements: { name: string }[] = []

  if (!userId) return grantedAchievements

  try {
    // Obtener logros desbloqueados
    const { data: existing, error: existingError } = await supabase
      .from('user_achievements')
      .select('achievement_key')
      .eq('user_id', userId)

    if (existingError) throw existingError

    const unlocked = new Set(existing.map((a) => a.achievement_key))
    const toGrant: string[] = []

    // Verifica si ha subido documentos
    const { count: docCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (docCount && docCount >= 1 && !unlocked.has('first_upload')) toGrant.push('first_upload')
    if (docCount && docCount >= 5 && !unlocked.has('five_uploads')) toGrant.push('five_uploads')

    // Documento popular (>= 10 likes)
    const { data: popularDocs } = await supabase
      .from('documents')
      .select('id')
      .eq('user_id', userId)
      .gte('likes', 10)
      .limit(1)

    if (popularDocs && popularDocs.length > 0 && !unlocked.has('popular_doc')) {
      toGrant.push('popular_doc')
    }

    if (toGrant.length > 0) {
      const inserts = toGrant.map((key) => ({
        user_id: userId,
        achievement_key: key
      }))

      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert(inserts)

      if (insertError) throw insertError

      toGrant.forEach((key) => {
        const match = ACHIEVEMENTS_CATALOG.find((a) => a.key === key)
        if (match) grantedAchievements.push({ name: match.name })
      })
    }
  } catch (err) {
    console.error('❌ Error al otorgar logros:', err)
  }

  return grantedAchievements
}
