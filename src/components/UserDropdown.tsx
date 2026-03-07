'use client'

import { useUserContext } from '@/context/UserContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, LayoutDashboard, LogOut, Settings, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import LottieAvatar from '@/components/LottieAvatar'
import { getAvatarImageSrc, getCleanAvatarUrl, isLottieAvatar } from '@/lib/avatar'
import { cn } from '@/lib/utils'

type UserDropdownProps = {
  className?: string
  showName?: boolean
}

export default function UserDropdown({ className, showName = true }: UserDropdownProps) {
  const { perfil } = useUserContext()
  const router = useRouter()
  const usesAnimatedAvatar = isLottieAvatar(perfil?.avatar_url)
  const animatedAvatarSrc = getCleanAvatarUrl(perfil?.avatar_url)
  const avatarImageSrc = getAvatarImageSrc(perfil?.avatar_url, perfil?.updated_at)

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('[LOGOUT_ERROR]', error)
      toast.error('Error al cerrar sesion')
      return
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('perfil')
    }

    toast.success('Sesion cerrada correctamente')
    router.push('/')
    router.refresh()
  }

  if (!perfil) return null
  const displayName = perfil.username || perfil.nombre_completo || 'Usuario'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'group flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/80 px-2.5 py-1.5 text-sm shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-800',
            className
          )}
        >
          {usesAnimatedAvatar && animatedAvatarSrc ? (
            <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
              <LottieAvatar
                src={animatedAvatarSrc}
                size={32}
                className="h-8 w-8 !rounded-none !ring-0"
              />
            </div>
          ) : (
            <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700">
              <AvatarImage src={avatarImageSrc ?? ''} alt={perfil.username ?? 'Usuario'} />
              <AvatarFallback className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                {perfil.username?.charAt(0).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
          )}

          {showName && (
            <span className="inline max-w-[140px] truncate font-semibold text-slate-800 dark:text-slate-100">
              {displayName}
            </span>
          )}

          <ChevronDown className="h-4 w-4 text-slate-500 transition group-hover:text-slate-700 dark:text-slate-300 dark:group-hover:text-slate-100" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="z-[9999] w-72 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95"
      >
        <DropdownMenuLabel className="rounded-xl bg-slate-50 px-3 py-3 text-sm dark:bg-slate-800/70">
          <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-300">
            Cuenta
          </p>
          <p className="mt-1 truncate font-semibold text-slate-900 dark:text-slate-50">
            {perfil.nombre_completo ?? perfil.username}
          </p>
          <p className="truncate text-xs font-normal text-slate-500 dark:text-slate-300">
            {perfil.universidad || 'StudyDocu'}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => router.push('/dashboard')}
          className="cursor-pointer rounded-lg px-3 py-2"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" /> Ir al dashboard
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/dashboard/perfil')}
          className="cursor-pointer rounded-lg px-3 py-2"
        >
          <User className="mr-2 h-4 w-4" /> Mi perfil
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/dashboard/configuracion')}
          className="cursor-pointer rounded-lg px-3 py-2"
        >
          <Settings className="mr-2 h-4 w-4" /> Configuracion
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-lg px-3 py-2 text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
        >
          <LogOut className="mr-2 h-4 w-4" /> Cerrar sesion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
