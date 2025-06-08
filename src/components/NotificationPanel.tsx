'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Bell, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface NotificationEntry {
  id: string
  created_at: string
  message: string
  is_read: boolean
  url?: string | null
  user_id: string
}

interface NotificationPanelProps {
  userId: string | null
}

const NOTIFICATION_LIMIT = 10

export default function NotificationPanel({ userId }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<NotificationEntry[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [markingStates, setMarkingStates] = useState<Record<string, boolean>>({})
  const panelRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(NOTIFICATION_LIMIT)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      const err = error as Error
      console.error('Error fetching notifications:', err)
      toast.error('❌ Error al cargar notificaciones.', { description: err.message })
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      void fetchNotifications()
    } else {
      setNotifications([])
    }
  }, [userId, fetchNotifications])

  useEffect(() => {
    if (!userId || !open) return

    const channel = supabase
      .channel(`notifications_user_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as NotificationEntry
          setNotifications((prev) => {
            if (prev.find((n) => n.id === newNotification.id)) return prev
            return [newNotification, ...prev].slice(0, NOTIFICATION_LIMIT)
          })
          toast.info('✨ Nueva notificación recibida!')
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Subscrito al canal de notificaciones para ${userId}`)
        } else if (err) {
          console.error('❌ Error en subscripción a notificaciones:', err)
          toast.error('Error de conexión con notificaciones en tiempo real.')
        }
      })

    return () => {
      console.log(`Desuscribiendo del canal de notificaciones para ${userId}`)
      supabase.removeChannel(channel)
    }
  }, [userId, open])

  const markAsRead = useCallback(
    async (id: string, currentIsRead: boolean) => {
      if (currentIsRead) return

      setMarkingStates((prev) => ({ ...prev, [id]: true }))
      const originalNotifications = [...notifications]
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))

      try {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id)
          .eq('user_id', userId!)

        if (error) throw error
      } catch (error) {
        const err = error as Error
        console.error('Error marking notification as read:', err)
        toast.error('❌ Error al marcar como leída.', { description: err.message })
        setNotifications(originalNotifications)
      } finally {
        setMarkingStates((prev) => ({ ...prev, [id]: false }))
      }
    },
    [userId, notifications]
  )

  const markAllAsRead = async () => {
    if (!userId || notifications.every((n) => n.is_read)) return

    setLoading(true)
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)
    if (unreadIds.length === 0) {
      setLoading(false)
      return
    }

    const originalNotifications = [...notifications]
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', unreadIds)
        .eq('user_id', userId)

      if (error) throw error
      toast.success('✅ Todas las notificaciones marcadas como leídas.')
    } catch (error) {
      const err = error as Error
      console.error('Error marking all notifications as read:', err)
      toast.error('❌ Error al marcar todas como leídas.', { description: err.message })
      setNotifications(originalNotifications)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  if (!userId) return null

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-500"
        aria-label={`Notificaciones ${unreadCount > 0 ? `(${unreadCount} no leídas)` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 z-50 origin-top-right animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h4 className="text-base font-semibold text-gray-800 dark:text-white">
              Notificaciones
            </h4>
            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-xs text-blue-600 dark:text-yellow-400 hover:underline disabled:opacity-50"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {loading && notifications.length === 0 ? (
            <div className="flex items-center justify-center p-10 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="animate-spin w-5 h-5 mr-2" /> Cargando...
            </div>
          ) : notifications.length === 0 ? (
            <p className="p-10 text-sm text-center text-gray-500 dark:text-gray-400">
              No tienes notificaciones.
            </p>
          ) : (
            <ul className="space-y-1 p-2 max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`rounded-lg transition-colors duration-150 ${
                    n.is_read
                      ? 'bg-gray-50 dark:bg-gray-700/50'
                      : 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 font-medium'
                  }`}
                >
                  <Link
                    href={n.url || '#'}
                    onClick={(e) => {
                      if (markingStates[n.id]) e.preventDefault()
                      void markAsRead(n.id, n.is_read)
                    }}
                    className="block p-3"
                  >
                    <p
                      className={`text-sm ${n.is_read ? 'text-gray-600 dark:text-gray-400' : 'text-blue-700 dark:text-blue-300'}`}
                    >
                      {n.message}
                    </p>
                    <span className="block text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: es })}
                      {markingStates[n.id] && (
                        <Loader2 className="inline-block ml-2 w-3 h-3 animate-spin" />
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/notificaciones"
              onClick={() => setOpen(false)}
              className="text-xs text-blue-600 dark:text-yellow-400 hover:underline"
            >
              Ver todas las notificaciones
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
