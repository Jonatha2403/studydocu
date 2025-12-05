'use client'

import { useUserContext } from '@/context/UserContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'
import { Menu, X, Loader2 } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageToggle from '@/components/LanguageToggle'
import UserDropdown from '@/components/UserDropdown'

/** ✅ Props que recibe desde ClientWrapper */
interface NavbarProps {
  userId?: string
  sessionLoading?: boolean
}

/** ✅ Export default con el mismo nombre que importas en ClientWrapper */
export default function Navbar({ userId, sessionLoading }: NavbarProps) {
  const { user, perfil } = useUserContext()
  const pathname = usePathname()
  const isPublic = !pathname?.startsWith('/dashboard') && !pathname?.startsWith('/admin')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Usuario efectivo: o el que viene en props o el del contexto
  const isLogged = !!(userId || user)

  // Escucha de scroll para encoger/oscurecer el navbar
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 8)
  })

  const navLinks = useMemo(
    () => [
      { href: '/', label: 'Inicio' },
      { href: '/explorar', label: 'Explorar' },
      { href: '/servicios', label: 'Servicios' },
      { href: '/blog', label: 'Blog' },
    ],
    []
  )

  if (!isPublic) return null

  return (
    <motion.nav
      initial={false}
      animate={scrolled ? 'scrolled' : 'top'}
      variants={{
        top: { y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        scrolled: { y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
      }}
      className="fixed top-0 z-50 w-full"
    >
      {/* Halo/borde gradiente sutil */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="mx-auto h-[1px] w-full max-w-7xl bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
      </div>

      <div
        className={[
          'mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8',
          scrolled ? 'h-16' : 'h-20',
        ].join(' ')}
      >
        {/* Contenedor glass con borde sutil */}
        <div className="absolute left-0 right-0 -z-10 mx-4 sm:mx-6 lg:mx-8">
          <div
            className={[
              'rounded-2xl border transition-all',
              scrolled
                ? 'border-white/10 bg-white/70 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/70'
                : 'border-white/10 bg-white/60 shadow-md backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/60',
            ].join(' ')}
            style={{ height: scrolled ? 64 : 80 }}
          />
        </div>

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="StudyDocu"
            width={40}
            height={40}
            className="rounded-xl bg-white p-1 shadow"
            priority
          />
          <span className="font-extrabold text-xl text-gray-900 dark:text-white tracking-tight">
            StudyDocu
          </span>
        </Link>

        {/* Links centrados en desktop con 'pill' animada */}
        <div className="relative z-10 hidden lg:flex items-center gap-6 text-[15px] font-medium">
          <div className="relative flex items-center gap-6">
            <AnimatePresence initial={false}>
              {navLinks.map((link) => {
                const active = pathname === link.href
                return (
                  <div key={link.href} className="relative">
                    {active && (
                      <motion.span
                        layoutId="active-pill"
                        className="absolute -inset-x-2 -inset-y-1 rounded-full bg-indigo-500/10 ring-1 ring-indigo-400/30"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Link
                      href={link.href}
                      className={[
                        'relative px-2 py-1 transition-colors',
                        active
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'hover:text-indigo-500',
                      ].join(' ')}
                    >
                      {link.label}
                    </Link>
                  </div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Botones derecha */}
        <div className="relative z-10 hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <LanguageToggle />

          {sessionLoading ? (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Cargando…
            </span>
          ) : isLogged && perfil ? (
            <button className="group flex items-center gap-2 rounded-full border border-gray-300/60 bg-white/60 px-4 py-2 text-sm shadow-sm backdrop-blur hover:bg-white/80 dark:border-gray-700/60 dark:bg-gray-800/60 dark:hover:bg-gray-800/80">
              <UserDropdown />
            </button>
          ) : (
            <>
              {/* 🔐 LOGIN DESKTOP: ahora a /iniciar-sesion */}
              <Link
                href="/iniciar-sesion"
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Iniciar sesión
              </Link>

              <Link href="/registrarse" className="relative inline-flex">
                <span className="btn-glow text-sm">
                  🚀 Regístrate
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute -left-full top-0 h-full w-1/3 rotate-12 bg-white/30 blur-md transition-transform duration-700 group-hover:translate-x-[300%]" />
                  </span>
                </span>
              </Link>
            </>
          )}
        </div>

        {/* Botón menú móvil */}
        <div className="relative z-10 lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Abrir menú"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menú móvil animado */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="lg:hidden px-4 sm:px-6 lg:px-8 pb-6 pt-3"
          >
            <div className="rounded-2xl border border-white/10 bg-white/80 p-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/80">
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                  show: { transition: { staggerChildren: 0.06 } },
                }}
                className="flex flex-col gap-3 mb-4"
              >
                {navLinks.map((link) => {
                  const active = pathname === link.href
                  return (
                    <motion.div
                      key={link.href}
                      variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={[
                          'block rounded-lg px-3 py-2 text-base transition-colors',
                          active
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
                        ].join(' ')}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>

              <hr className="my-3 border-gray-300/70 dark:border-gray-700/70" />

              {!isLogged && (
                <div className="flex flex-col items-stretch gap-2">
                  {/* 🔐 LOGIN MOBILE: también /iniciar-sesion */}
                  <Link href="/iniciar-sesion" onClick={() => setMenuOpen(false)}>
                    <button className="w-full rounded-lg bg-gray-100 px-4 py-2 text-center text-sm font-medium text-gray-900 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                      Iniciar sesión
                    </button>
                  </Link>
                  <Link href="/registrarse" onClick={() => setMenuOpen(false)}>
                    <button className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow hover:scale-[1.02] transition">
                      🚀 Regístrate gratis
                    </button>
                  </Link>
                </div>
              )}

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300/60 bg-white/60 dark:border-gray-700/60 dark:bg-gray-800/60">
                  <ThemeToggle />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300/60 bg-white/60 dark:border-gray-700/60 dark:bg-gray-800/60">
                  <LanguageToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
