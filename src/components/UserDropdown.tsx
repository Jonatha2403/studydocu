'use client'

import { useUserContext } from '@/context/UserContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { LogOut, LayoutDashboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LottieAvatar from '@/components/LottieAvatar'
import { getAvatarImageSrc, getCleanAvatarUrl, isLottieAvatar } from '@/lib/avatar'

// 👇 IMPORTANTE: mismo cliente que UserContext y Login
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function UserDropdown() {
  const { perfil } = useUserContext()
  const router = useRouter()
  const cleanAvatarUrl = getCleanAvatarUrl(perfil?.avatar_url)
  const isAnimatedAvatar = isLottieAvatar(perfil?.avatar_url)
  const avatarImageSrc = getAvatarImageSrc(perfil?.avatar_url, perfil?.updated_at)

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('[LOGOUT_ERROR]', error)
      toast.error('Error al cerrar sesión')
      return
    }

    // 🔥 limpiar cache local
    if (typeof window !== 'undefined') {
      localStorage.removeItem('perfil')
    }

    toast.success('Sesión cerrada correctamente')

    // 🔄 forzar que todo se actualice
    router.push('/')
    router.refresh()
  }

  if (!perfil) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer select-none">
          <Avatar className="w-8 h-8 border">
            {isAnimatedAvatar && cleanAvatarUrl ? (
              <LottieAvatar src={cleanAvatarUrl} size={32} />
            ) : (
              <AvatarImage src={avatarImageSrc ?? ''} alt={perfil.username ?? ''} />
            )}
            <AvatarFallback>{perfil.username?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <span className="max-w-[120px] truncate font-medium hidden sm:inline">
            {perfil.username}
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 z-[9999]">
        <DropdownMenuLabel className="text-sm leading-tight">
          👋 {perfil.nombre_completo ?? perfil.username} <br />
          🎓 {perfil.universidad}
        </DropdownMenuLabel>

        <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer">
          <LayoutDashboard className="w-4 h-4 mr-2" /> Ir al dashboard
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
          <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
