import { supabase } from '@/lib/supabase'

interface Achievement {
  key: string
  name: string
}

const ACHIEVEMENTS_CATALOG: Achievement[] = [
  { key: 'first_upload', name: '📄 Primer Documento' },
  { key: 'five_uploads', name: '🧠 Colaborador Activo' },
  { key: 'popular_doc', name: '🔥 Documento Popular' },
]

export async function checkAndGrantAchievements(userId: string): Promise<{ name: string }[]> {
  const grantedAchievements: { name: string }[] = []

  if (!userId) return grantedAchievements

  try {
    // Logros ya desbloqueados
    const { data: existing, error: existingError } = await supabase
      .from('user_achievements')
      .select('achievement_key')
      .eq('user_id', userId)

    if (existingError) throw new Error(existingError.message)

    const unlocked = new Set((existing || []).map((a) => a.achievement_key))
    const toGrant: string[] = []

    // 📄 Verificar cantidad de documentos
    const { count: docCount, error: docError } = await supabase
      .from('documents')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (docError) throw new Error(docError.message)

    if (docCount !== null) {
      if (docCount >= 1 && !unlocked.has('first_upload')) toGrant.push('first_upload')
      if (docCount >= 5 && !unlocked.has('five_uploads')) toGrant.push('five_uploads')
    }

    // 🔥 Verificar documento popular
    const { data: popularDocs, error: popularError } = await supabase
      .from('documents')
      .select('id')
      .eq('user_id', userId)
      .gte('likes', 10)
      .limit(1)

    if (popularError) throw new Error(popularError.message)

    if ((popularDocs?.length || 0) > 0 && !unlocked.has('popular_doc')) {
      toGrant.push('popular_doc')
    }

    // 🏆 Insertar nuevos logros
    if (toGrant.length > 0) {
      const inserts = toGrant.map((key) => ({
        user_id: userId,
        achievement_key: key,
      }))

      const { error: insertError } = await supabase.from('user_achievements').insert(inserts)

      if (insertError) throw new Error(insertError.message)

      toGrant.forEach((key) => {
        const found = ACHIEVEMENTS_CATALOG.find((a) => a.key === key)
        if (found) grantedAchievements.push({ name: found.name })
      })
    }
  } catch (err) {
    console.error('❌ Error al otorgar logros:', err)
  }

  return grantedAchievements
}
