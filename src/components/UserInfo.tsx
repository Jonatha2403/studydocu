'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LogOut, UserCircle, Loader2 } from 'lucide-react'

interface UserInfoProps {
  email: string | null | undefined
}

export default function UserInfo({ email }: UserInfoProps) {
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      toast.success('✅ Sesión cerrada correctamente.')
      router.push('/')
    } catch (error) {
      const err = error as Error
      console.error('Error during sign out:', err)
      toast.error('❌ Error al cerrar sesión.', {
        description: err.message || 'Inténtalo de nuevo.',
      })
    } finally {
      setLoggingOut(false)
    }
  }

  if (!email) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 border dark:border-gray-700 rounded-lg shadow text-center text-sm text-gray-500 dark:text-gray-400">
        Cargando información del usuario...
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 border dark:border-gray-700 rounded-lg shadow-lg text-center selection:bg-blue-100 dark:selection:bg-yellow-700">
      <UserCircle className="w-12 h-12 text-blue-500 dark:text-yellow-400 mx-auto mb-3" />
      <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">Conectado como:</p>
      <p className="font-semibold text-gray-800 dark:text-white mb-4 break-all">{email}</p>
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full sm:w-auto flex items-center justify-center gap-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-500 dark:border-red-400 px-4 py-2 rounded-md text-sm font-medium hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
      >
        {loggingOut ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" />
            Cerrando sesión...
          </>
        ) : (
          <>
            <LogOut size={16} />
            Cerrar sesión
          </>
        )}
      </button>
    </div>
  )
}
