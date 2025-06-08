'use client'
import { useUserStatus } from '@/hooks/useUserStatus'
import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'
import {
  Menu,
  X,
  Home,
  UploadCloud,
  LogIn,
  UserPlus,
  CreditCard,
  ShieldCheck,
  Loader2,
  Search,
  Briefcase,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import UserMenu from '../UserMenu'
import NotificationPanel from '../NotificationPanel'
import { useSession } from '@/hooks/useSession'

interface NavbarProps {
  userId: string | null
  sessionLoading: boolean
}

export default function Navbar({ userId, sessionLoading }: NavbarProps) {
  const { perfil, loading } = useSession()
  const { role, isPremium, loading: statusLoading } = useUserStatus()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) closeMenu()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [closeMenu])

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/subir', label: 'Subir', icon: UploadCloud, requiresAuth: true },
    { href: '/explorar', label: 'Explorar', icon: Search },
    { href: '/servicios', label: 'Servicios', icon: Briefcase },
    { href: '/suscripcion', label: 'Suscripción', icon: CreditCard, requiresAuth: true },
  ]

  const adminLinks = [{ href: '/admin/dashboard', label: 'Panel Admin', icon: ShieldCheck }]

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${menuOpen ? 'bg-white/90 shadow-md backdrop-blur-lg dark:bg-gray-900/80' : 'bg-white/80 backdrop-blur-lg shadow-sm dark:bg-gray-900/70'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-primary hover:opacity-90 transition-all flex items-center gap-2"
        >
          📘 StudyDocu
        </Link>

        <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          {navLinks.map(
            (link) =>
              (!link.requiresAuth || userId) && (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <link.icon size={16} /> {link.label}
                </Link>
              )
          )}
          {userId &&
            role === 'admin' &&
            adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-red-500 hover:text-red-700 font-semibold transition-colors flex items-center gap-1"
              >
                <link.icon size={16} /> {link.label}
              </Link>
            ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!statusLoading && (role || isPremium) && (
            <div className="text-xs text-muted-foreground">
              {role === 'admin' && <span className="text-yellow-500">👑 Admin</span>}
              {isPremium && <span className="text-blue-500 ml-2">🌟 Premium</span>}
            </div>
          )}

          {userId ? (
            <>
              <NotificationPanel userId={userId} />
              <UserMenu userProfile={perfil} loading={loading} />
            </>
          ) : sessionLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          ) : (
            <>
              <Link href="/auth?modo=login">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-yellow-400 px-3 py-1.5 rounded transition-all">
                  <LogIn size={16} /> Iniciar sesión
                </button>
              </Link>
              <Link href="/auth?modo=registro">
                <button className="flex items-center gap-1 text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 rounded-md shadow hover:shadow-md transition-all dark:text-white">
                  <UserPlus size={16} /> Regístrate
                </button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center">
          {userId && <NotificationPanel userId={userId} />}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-2 p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white focus:outline-none"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 px-4 py-4 space-y-2 shadow"
          >
            {navLinks.map(
              (link) =>
                (!link.requiresAuth || userId) && (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="block text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-yellow-400 flex items-center gap-2"
                  >
                    <link.icon size={18} /> {link.label}
                  </Link>
                )
            )}
            {userId &&
              role === 'admin' &&
              adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="block text-sm font-semibold text-red-500 hover:text-red-700 flex items-center gap-2"
                >
                  <link.icon size={18} /> {link.label}
                </Link>
              ))}

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {!statusLoading && (role || isPremium) && (
                <div className="text-xs text-muted-foreground">
                  {role === 'admin' && <span className="text-yellow-500">👑 Admin</span>}
                  {isPremium && <span className="text-blue-500 ml-2">🌟 Premium</span>}
                </div>
              )}

              {userId ? (
                <UserMenu
                  userProfile={perfil}
                  loading={loading}
                  isMobile
                  closeMobileMenu={closeMenu}
                />
              ) : (
                <>
                  <Link href="/auth?modo=login" onClick={closeMenu}>
                    <button className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                      <LogIn size={18} /> Iniciar sesión
                    </button>
                  </Link>
                  <Link href="/auth?modo=registro" onClick={closeMenu}>
                    <button className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md hover:brightness-110 transition-all">
                      <UserPlus size={18} /> Regístrate
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
