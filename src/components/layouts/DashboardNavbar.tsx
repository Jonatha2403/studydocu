'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useUserContext } from '@/context/UserContext'
import { useState } from 'react'
import { LogOut, Menu, X, Shield, Star, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardNavbar() {
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const { perfil } = useUserContext()
  const [menuAbierto, setMenuAbierto] = useState(false)

  // Ocultar si NO estamos en dashboard o admin
  const ocultarNavbar =
    !pathname.startsWith('/dashboard') &&
    !pathname.startsWith('/admin') 

  if (ocultarNavbar) return null

  const saludo = () => {
    const h = new Date().getHours()
    return h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches'
  }

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.push('/login')
  }

  const toggleMenu = () => setMenuAbierto(!menuAbierto)

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="text-xl font-semibold tracking-tight">
            StudyDocu
          </Link>

          {/* Botón hamburguesa móvil */}
          <button
            className="text-violet-600 dark:text-white block lg:hidden z-[60]"
            onClick={toggleMenu}
          >
            {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Menú Desktop */}
          <nav className="hidden lg:flex items-center gap-4">
            <Link href="/dashboard" className="hover:underline">Inicio</Link>
            <Link href="/mi-tablero" className="hover:underline">Tablero</Link>
            <Link href="/mis-favoritos" className="hover:underline">Favoritos</Link>
            <Link href="/documentos-subidos" className="hover:underline">Mis Documentos</Link>
            <Link href="/ajustes" className="hover:underline">Ajustes</Link>
            {perfil?.role === 'admin' && (
              <Link href="/admin/dashboard" className="hover:underline text-amber-600">Admin</Link>
            )}
          </nav>

          {/* Perfil Desktop */}
          <div className="hidden lg:flex items-center gap-4 truncate max-w-md">
            {perfil?.avatar_url ? (
              <Image
                src={perfil.avatar_url}
                alt="Avatar"
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <UserCircle className="w-8 h-8 text-gray-400" />
            )}

            <div className="flex flex-col text-sm truncate">
              <span className="font-semibold truncate">{saludo()}, {perfil?.username} 👋</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                🎓 {perfil?.universidad || 'Universidad'}
              </span>
            </div>

            {perfil?.role === 'admin' && <Shield className="text-red-500 w-5 h-5" />}
            {perfil?.subscription_active && <Star className="text-yellow-400 w-5 h-5" />}

            <div className="flex items-center gap-2 ml-2">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="secondary"
                className="text-xs px-3"
              >
                Volver al dashboard
              </Button>
              <Button
                onClick={cerrarSesion}
                variant="destructive"
                className="text-xs px-3"
              >
                <LogOut className="w-4 h-4 mr-1" /> Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil deslizable estilo iOS */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-3/4 h-full bg-white dark:bg-zinc-900 z-[55] shadow-xl px-6 py-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Menú</h2>
              <button onClick={toggleMenu} className="text-gray-500 dark:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="space-y-4">
              <Link href="/dashboard" onClick={toggleMenu} className="block">Inicio</Link>
              <Link href="/mi-tablero" onClick={toggleMenu} className="block">Tablero</Link>
              <Link href="/mis-favoritos" onClick={toggleMenu} className="block">Favoritos</Link>
              <Link href="/documentos-subidos" onClick={toggleMenu} className="block">Mis Documentos</Link>
              <Link href="/ajustes" onClick={toggleMenu} className="block">Ajustes</Link>
              {perfil?.role === 'admin' && (
                <Link href="/admin/dashboard" onClick={toggleMenu} className="block text-amber-600">Panel Admin</Link>
              )}
            </nav>

            <div className="mt-6 border-t pt-4 space-y-3">
              <div className="flex items-center gap-3">
                {perfil?.avatar_url ? (
                  <Image
                    src={perfil.avatar_url}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <UserCircle className="w-6 h-6 text-gray-400" />
                )}
                <div className="text-sm">
                  <p className="font-medium">{saludo()}, {perfil?.username}</p>
                  <p className="text-xs text-gray-500">{perfil?.universidad || 'Universidad'}</p>
                </div>
              </div>

              <Button
                onClick={() => {
                  toggleMenu()
                  router.push('/dashboard')
                }}
                variant="secondary"
                className="w-full text-sm"
              >
                Volver al dashboard
              </Button>

              <Button onClick={cerrarSesion} variant="destructive" className="w-full text-sm">
                <LogOut className="w-4 h-4 mr-1" /> Cerrar sesión
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
