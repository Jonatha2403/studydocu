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
import { useUserContext } from '@/context/UserContext' // ✅ usa tu contexto

export default function SidebarDashboard() {
  const { perfil } = useUserContext() // ✅ ya no necesitas props
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const navMain = [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Subir Docs', href: '/subir', icon: FilePlus },
    { label: 'Explorar', href: '/explorar', icon: Search },
    { label: 'Favoritos', href: '/favoritos', icon: BookOpen }
  ]

  const navDashboard = [
    { label: 'Resumen', href: '/dashboard', icon: BarChart2 },
    { label: 'Mis Documentos', href: '/dashboard/documentos', icon: BookOpenCheck },
    { label: 'Mi Perfil', href: '/dashboard/perfil', icon: User },
    { label: 'Logros', href: '/dashboard/logros', icon: Medal },
    { label: 'Configuración', href: '/dashboard/configuracion', icon: Settings }
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('perfil')
    toast.success('Sesión cerrada')
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
          className={`relative flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium ${
            active
              ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-yellow-300'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Icon size={20} />
          <span>{label}</span>
          {active && (
            <motion.div
              layoutId="active-pill"
              className="absolute left-0 h-full w-1 bg-indigo-500 dark:bg-yellow-400 rounded-r"
            />
          )}
        </Link>
      )
    })

  return (
    <>
      {/* 📱 Botón flotante en móviles */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-300 dark:border-gray-600"
        >
          <Menu className="text-gray-800 dark:text-gray-100" size={24} />
        </button>
      </div>

      {/* 🖥️ Sidebar escritorio */}
      <aside className="hidden md:flex flex-col h-screen w-60 bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-lg">
        <div className="flex flex-col justify-between h-full p-4">
          <div className="mt-0">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">📚 StudyDocu</h2>
            {perfil?.username && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Bienvenido, {perfil.username}
              </p>
            )}
            <nav className="flex flex-col gap-1 mb-6">{renderLinks(navMain)}</nav>
            <hr className="my-2 border-gray-300 dark:border-gray-700" />
            <nav className="flex flex-col gap-1">{renderLinks(navDashboard)}</nav>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-800 dark:text-white">
              {perfil?.username?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* 📱 Drawer móvil */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 z-50 shadow-xl p-6 flex flex-col justify-between"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween' }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">📚 StudyDocu</h2>
                  <button onClick={() => setOpen(false)}>
                    <X className="text-gray-800 dark:text-white" />
                  </button>
                </div>
                {perfil?.username && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Bienvenido, {perfil.username}
                  </p>
                )}
                <nav className="flex flex-col gap-1 mb-6">{renderLinks(navMain)}</nav>
                <hr className="my-2 border-gray-300 dark:border-gray-700" />
                <nav className="flex flex-col gap-1">{renderLinks(navDashboard)}</nav>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm px-4 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-md mt-4"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
