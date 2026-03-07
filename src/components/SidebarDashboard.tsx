'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpenCheck,
  BarChart2,
  Settings,
  User,
  Medal,
  Menu,
  X,
  Home,
  Search,
  FilePlus,
  BookOpen,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useUserContext } from '@/context/UserContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import LottieAvatar from '@/components/LottieAvatar'

export default function SidebarDashboard() {
  const { perfil } = useUserContext()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const navMain = [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Subir Docs', href: '/subir', icon: FilePlus },
    { label: 'Explorar', href: '/explorar', icon: Search },
    { label: 'Favoritos', href: '/favoritos', icon: BookOpen },
  ]

  const navDashboard = [
    { label: 'Resumen', href: '/dashboard', icon: BarChart2 },
    { label: 'Mis Documentos', href: '/dashboard/documentos', icon: BookOpenCheck },
    { label: 'Mi Perfil', href: '/dashboard/perfil', icon: User },
    { label: 'Logros', href: '/dashboard/logros', icon: Medal },
    { label: 'Configuracion', href: '/dashboard/configuracion', icon: Settings },
  ]

  const cleanAvatarUrl = (perfil?.avatar_url || '').split('?')[0]
  const isLottieAvatar = cleanAvatarUrl.endsWith('.json')
  const initial = perfil?.username?.charAt(0).toUpperCase() || 'U'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('perfil')
    toast.success('Sesion cerrada')
    router.push('/')
  }

  const renderLinks = (items: typeof navMain | typeof navDashboard) =>
    items.map(({ label, href, icon: Icon }) => {
      const active = pathname === href
      return (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={`relative flex items-center gap-3 rounded-lg px-4 py-2 font-medium transition-all ${
            active
              ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-yellow-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          <Icon size={20} />
          <span>{label}</span>
          {active && (
            <motion.div
              layoutId="active-pill"
              className="absolute left-0 h-full w-1 rounded-r bg-indigo-500 dark:bg-yellow-400"
            />
          )}
        </Link>
      )
    })

  return (
    <>
      <div className="fixed left-4 top-4 z-50 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="rounded-full border border-gray-300 bg-white p-2 shadow-md dark:border-gray-600 dark:bg-gray-800"
          aria-label="Abrir menu"
        >
          <Menu className="text-gray-800 dark:text-gray-100" size={24} />
        </button>
      </div>

      <aside className="hidden h-screen w-60 flex-col border-r bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 md:flex">
        <div className="flex h-full flex-col justify-between p-4">
          <div>
            <h2 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">StudyDocu</h2>
            {perfil?.username && (
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Bienvenido, {perfil.username}
              </p>
            )}
            <nav className="mb-6 flex flex-col gap-1">{renderLinks(navMain)}</nav>
            <hr className="my-2 border-gray-300 dark:border-gray-700" />
            <nav className="flex flex-col gap-1">{renderLinks(navDashboard)}</nav>
          </div>

          <div className="mt-6 flex items-center gap-3">
            {isLottieAvatar && cleanAvatarUrl ? (
              <LottieAvatar src={cleanAvatarUrl} size={36} />
            ) : (
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={perfil?.avatar_url || undefined}
                  alt={perfil?.username || 'Avatar'}
                />
                <AvatarFallback className="text-sm font-semibold">{initial}</AvatarFallback>
              </Avatar>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-500 transition hover:text-red-700"
              title="Cerrar sesion"
            >
              <LogOut size={16} />
              Cerrar sesion
            </button>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col justify-between bg-white p-6 shadow-xl dark:bg-gray-900"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween' }}
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">StudyDocu</h2>
                  <button onClick={() => setOpen(false)} aria-label="Cerrar menu">
                    <X className="text-gray-800 dark:text-white" />
                  </button>
                </div>
                {perfil?.username && (
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Bienvenido, {perfil.username}
                  </p>
                )}
                <nav className="mb-6 flex flex-col gap-1">{renderLinks(navMain)}</nav>
                <hr className="my-2 border-gray-300 dark:border-gray-700" />
                <nav className="flex flex-col gap-1">{renderLinks(navDashboard)}</nav>
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 flex items-center gap-2 rounded-md px-4 py-2 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
              >
                {isLottieAvatar && cleanAvatarUrl ? (
                  <LottieAvatar src={cleanAvatarUrl} size={24} />
                ) : (
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={perfil?.avatar_url || undefined}
                      alt={perfil?.username || 'Avatar'}
                    />
                    <AvatarFallback className="text-[10px]">{initial}</AvatarFallback>
                  </Avatar>
                )}
                <LogOut size={18} />
                Cerrar sesion
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
