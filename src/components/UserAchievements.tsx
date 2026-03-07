'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACHIEVEMENTS_CATALOG } from '@/lib/achievementsCatalog'

interface Props {
  userId: string
}

export default function UserAchievements({ userId }: Props) {
  const [unlockedKeys, setUnlockedKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_key, achievement')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching achievements:', error)
      } else {
        const keys = (data || [])
          .map((a: any) => String(a?.achievement_key || a?.achievement || '').trim())
          .filter(Boolean)
        setUnlockedKeys(Array.from(new Set(keys)))
      }

      setLoading(false)
    }

    if (userId) void fetchAchievements()
  }, [userId])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
      {ACHIEVEMENTS_CATALOG.map((achievement) => {
        const unlocked = unlockedKeys.includes(achievement.key)
        return (
          <div
            key={achievement.key}
            className={cn(
              'relative rounded-2xl border p-5 shadow-sm transition-all duration-300',
              unlocked
                ? 'border-green-500 bg-green-50 hover:shadow-md'
                : 'border-gray-300 bg-gray-100 opacity-70 hover:opacity-90'
            )}
            aria-label={achievement.title}
          >
            <div className="flex items-start justify-between">
              <div className="text-4xl">{unlocked ? '🏆' : '🔒'}</div>
              {unlocked && <CheckCircle2 className="h-5 w-5 text-green-600" />}
            </div>
            <h3 className="mt-3 text-lg font-bold text-gray-800">{achievement.title}</h3>
            <p className="text-sm text-gray-600">{achievement.description}</p>
            {!unlocked && <p className="mt-2 text-xs italic text-gray-500">Aun no desbloqueado</p>}
          </div>
        )
      })}
    </div>
  )
}
