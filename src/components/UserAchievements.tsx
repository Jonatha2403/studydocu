'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Achievement {
  key: string
  label: string
  description: string
  icon: string
}

const ACHIEVEMENT_CATALOG: Achievement[] = [
  {
    key: 'first_upload',
    label: 'Primer Documento',
    description: 'Subiste tu primer archivo 🎉',
    icon: '📄',
  },
  {
    key: 'five_uploads',
    label: 'Colaborador Activo',
    description: 'Subiste 5 documentos 📚',
    icon: '📚',
  },
  {
    key: 'popular_doc',
    label: 'Documento Popular',
    description: 'Recibiste más de 10 likes en un documento ❤️',
    icon: '🔥',
  },
  {
    key: 'moderation_helper',
    label: 'Ayudante de Moderación',
    description: 'Uno de tus reportes fue útil 🛡️',
    icon: '🛡️',
  },
  {
    key: 'daily_login',
    label: 'Constante',
    description: 'Ingresaste 7 días seguidos 📆',
    icon: '📆',
  },
]

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
        .select('achievement_key')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching achievements:', error)
      } else {
        setUnlockedKeys(data.map((a) => a.achievement_key))
      }

      setLoading(false)
    }

    if (userId) fetchAchievements()
  }, [userId])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 mt-6">
      {ACHIEVEMENT_CATALOG.map((achievement) => {
        const unlocked = unlockedKeys.includes(achievement.key)
        return (
          <div
            key={achievement.key}
            className={cn(
              'relative p-5 rounded-2xl border shadow-sm transition-all duration-300',
              unlocked
                ? 'bg-green-50 border-green-500 hover:shadow-md'
                : 'bg-gray-100 border-gray-300 opacity-70 hover:opacity-90'
            )}
            aria-label={achievement.label}
          >
            <div className="flex justify-between items-start">
              <div className="text-4xl">{achievement.icon}</div>
              {unlocked && <CheckCircle2 className="text-green-600 w-5 h-5" />}
            </div>
            <h3 className="font-bold text-lg mt-3 text-gray-800">{achievement.label}</h3>
            <p className="text-sm text-gray-600">{achievement.description}</p>
            {!unlocked && (
              <p className="mt-2 text-xs text-gray-500 italic">Aún no desbloqueado</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
