import { supabase } from '@/lib/supabase'
import { ACHIEVEMENTS_CATALOG, getAchievementMeta } from '@/lib/achievementsCatalog'

type AchievementRow = {
  achievement_key?: string | null
  achievement?: string | null
}

async function listUnlockedAchievementKeys(userId: string) {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('achievement_key, achievement')
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  return new Set(
    ((data || []) as AchievementRow[])
      .map((row) => String(row.achievement_key || row.achievement || '').trim())
      .filter(Boolean)
  )
}

async function insertAchievements(userId: string, keys: string[]) {
  const withKey = keys.map((key) => ({ user_id: userId, achievement_key: key }))
  const firstTry = await supabase.from('user_achievements').insert(withKey)
  if (!firstTry.error) return

  const legacy = keys.map((key) => ({ user_id: userId, achievement: key }))
  const secondTry = await supabase.from('user_achievements').insert(legacy)
  if (secondTry.error) throw new Error(secondTry.error.message)
}

export async function checkAndGrantAchievements(userId: string): Promise<{ name: string }[]> {
  const granted: { name: string }[] = []
  if (!userId) return granted

  try {
    const unlocked = await listUnlockedAchievementKeys(userId)
    const toGrant: string[] = []

    const { count: docCount, error: docError } = await supabase
      .from('documents')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
    if (docError) throw new Error(docError.message)

    if (docCount !== null) {
      if (docCount >= 1 && !unlocked.has('first_upload')) toGrant.push('first_upload')
      if (docCount >= 5 && !unlocked.has('five_uploads')) toGrant.push('five_uploads')
    }

    let hasLikesColumn = false
    try {
      const { error: likesErr } = await supabase.from('documents').select('likes').limit(1)
      hasLikesColumn = !likesErr
    } catch {
      hasLikesColumn = false
    }

    if (hasLikesColumn) {
      const { data: popularDocs, error: popErr } = await supabase
        .from('documents')
        .select('id')
        .eq('user_id', userId)
        .gte('likes', 10)
        .limit(1)

      if (!popErr && (popularDocs?.length || 0) > 0 && !unlocked.has('popular_doc')) {
        toGrant.push('popular_doc')
      }
    }

    const uniqueKeys = Array.from(new Set(toGrant))
    if (!uniqueKeys.length) return granted

    await insertAchievements(userId, uniqueKeys)

    uniqueKeys.forEach((key) => {
      const meta = getAchievementMeta(key)
      granted.push({ name: meta ? `🏆 ${meta.title}` : key })
    })
  } catch (err) {
    console.error('Error al otorgar logros:', err)
  }

  return granted
}

export function getAchievementCatalog() {
  return ACHIEVEMENTS_CATALOG
}
