'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, AlertTriangle, History, FileText, Tag } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface AuditLogDetails {
  file_name?: string
  category?: string
  [key: string]: unknown
}

interface AuditLogEntry {
  id: string
  user_id: string
  action: string
  details: AuditLogDetails | null
  created_at: string
}

export default function HistorialAcciones() {
  const [user, setUser] = useState<User | null>(null)
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    const fetchUserSpecificLogs = async (currentUser: User) => {
      if (!isMounted) return
      try {
        const { data: auditLogs, error: logsError } = await supabase
          .from('audit_logs')
          .select('id, action, details, created_at, user_id')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(100)

        if (!isMounted) return
        if (logsError) throw logsError
        setLogs(auditLogs || [])
      } catch (err: unknown) {
        if (!isMounted) return
        const msg = err instanceof Error ? err.message : 'Error desconocido'
        console.error('Error fetching audit logs:', msg)
        setError('No se pudo cargar el historial de acciones. Intenta de nuevo más tarde.')
        setLogs([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    supabase.auth
      .getSession()
      .then(({ data: { session }, error: sessionError }) => {
        if (!isMounted) return
        if (sessionError) {
          console.error('Error fetching session:', sessionError)
          setError('Error al verificar tu sesión.')
          setUser(null)
          setLogs([])
          setLoading(false)
          return
        }

        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          fetchUserSpecificLogs(currentUser)
        } else {
          setLogs([])
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return
        const msg = err instanceof Error ? err.message : 'Error desconocido'
        console.error('Exception fetching session:', msg)
        setError('Excepción al verificar tu sesión.')
        setUser(null)
        setLogs([])
        setLoading(false)
      })

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return
      const newCurrentUser = session?.user ?? null
      setUser(newCurrentUser)

      if (newCurrentUser) {
        setLoading(true)
        setError(null)
        await fetchUserSpecificLogs(newCurrentUser)
      } else {
        setLogs([])
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }
    return new Date(dateString).toLocaleString('es-ES', options)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 text-gray-600 dark:text-gray-400">
        <Loader2 className="animate-spin w-8 h-8 mb-3 text-blue-600 dark:text-yellow-400" />
        Cargando historial de acciones...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
        <AlertTriangle className="w-10 h-10 mb-3" />
        <p className="font-semibold">Ocurrió un error</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        <p>Inicia sesión para ver tu historial de acciones.</p>
      </div>
    )
  }

  return (
    <div className="mt-10 p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
        <History className="mr-3 text-blue-600 dark:text-yellow-400" size={28} />
        Historial de Acciones
      </h2>
      {logs.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-5">
          No se han registrado acciones en tu historial aún.
        </p>
      ) : (
        <ul className="space-y-4 text-sm">
          {logs.map((log) => (
            <li
              key={log.id}
              className="border dark:border-gray-700 p-4 rounded-md bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow"
            >
              <p className="font-semibold text-gray-700 dark:text-gray-200">
                Acción:{' '}
                <span className="text-blue-700 dark:text-yellow-500 font-bold">{log.action}</span>
              </p>
              {log.details && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                  {'file_name' in log.details && log.details.file_name && (
                    <p className="flex items-center">
                      <FileText size={14} className="mr-1.5 text-gray-400 dark:text-gray-500" />
                      Archivo:{' '}
                      <span className="font-medium text-gray-600 dark:text-gray-300 ml-1">
                        {log.details.file_name}
                      </span>
                    </p>
                  )}
                  {'category' in log.details && log.details.category && (
                    <p className="flex items-center">
                      <Tag size={14} className="mr-1.5 text-gray-400 dark:text-gray-500" />
                      Categoría:{' '}
                      <span className="font-medium text-gray-600 dark:text-gray-300 ml-1">
                        {log.details.category}
                      </span>
                    </p>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right">
                ⏱️ {formatDate(log.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
