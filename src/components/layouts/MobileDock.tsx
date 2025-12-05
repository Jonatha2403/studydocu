'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  UploadCloud,
  Search,
  Briefcase,
  User,
} from 'lucide-react'

const navItems = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'Subir', href: '/subir', icon: UploadCloud },
  { label: 'Explorar', href: '/explorar', icon: Search },
  { label: 'Servicios', href: '/servicios', icon: Briefcase },
  { label: 'Perfil', href: '/dashboard', icon: User },
]

export default function MobileDock() {
  const pathname = usePathname()
  const hasNotifications = true // 🔔 Simulado. Puedes reemplazar por lógica real con Supabase o hooks.

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-300 dark:border-gray-700 flex justify-around items-center h-16 shadow-md"
      >
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          const isProfile = label === 'Perfil'

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center text-xs font-medium transition ${
                isActive
                  ? 'text-indigo-600 dark:text-yellow-400 scale-105'
                  : 'text-gray-600 dark:text-gray-300 hover:text-indigo-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              {label}
              {isProfile && hasNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping pointer-events-none" />
              )}
            </Link>
          )
        })}
      </motion.nav>
    </AnimatePresence>
  )
}
