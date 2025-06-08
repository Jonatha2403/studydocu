'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, UploadCloud, MessageCircle, Star, AlertTriangle, Trophy } from 'lucide-react'

interface ActivityDetails {
  file_name?: string
  category?: string
  content?: string
  document_id?: string
  reason?: string
  name?: string
}

interface ActivityItem {
  id: string
  user_id: string
  action: string
  details: ActivityDetails
  created_at: string
}

interface Props {
  userId: string
}

export default function ActivityHistory({ userId }: Props) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) console.error('Error fetching activity logs:', error)
      else setActivities(data as ActivityItem[])

      setLoading(false)
    }

    fetchData()
  }, [userId])

  const getIcon = (action: string) => {
    switch (action) {
      case 'document_uploaded':
        return <UploadCloud className="w-5 h-5 text-blue-600" />
      case 'comment_posted':
        return <MessageCircle className="w-5 h-5 text-green-600" />
      case 'document_saved':
        return <Star className="w-5 h-5 text-yellow-500" />
      case 'report_sent':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'achievement_unlocked':
        return <Trophy className="w-5 h-5 text-purple-600" />
      default:
        return <span className="w-5 h-5">🔹</span>
    }
  }

  if (loading) {
    return <Loader2 className="animate-spin w-6 h-6 mx-auto text-gray-500" />
  }

  if (!activities.length) {
    return <p className="text-center text-sm text-gray-500">Sin actividad reciente.</p>
  }

  return (
    <div className="mt-6 space-y-4">
      {activities.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 p-3 border rounded-md bg-white shadow-sm"
        >
          <div className="mt-1">{getIcon(item.action)}</div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {formatAction(item.action, item.details)}
            </p>
            <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatAction(action: string, details: ActivityDetails): string {
  switch (action) {
    case 'document_uploaded':
      return `Subiste el documento "${details.file_name}" en la categoría ${details.category}`
    case 'comment_posted':
      return `Comentaste: "${details.content?.slice(0, 60)}..."`
    case 'document_saved':
      return `Guardaste el documento "${details.file_name}"`
    case 'report_sent':
      return `Reportaste el documento "${details.document_id}" por ${details.reason}`
    case 'achievement_unlocked':
      return `Desbloqueaste el logro "${details.name}" 🎉`
    default:
      return `Realizaste una acción: ${action}`
  }
}
