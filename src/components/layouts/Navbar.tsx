'use client'

import { useUserContext } from '@/context/UserContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Loader2, Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageToggle from '@/components/LanguageToggle'
import UserDropdown from '@/components/UserDropdown'

interface NavbarProps {
  userId?: string
  sessionLoading?: boolean
}

export default function Navbar({ userId, sessionLoading }: NavbarProps) {
  const { user, perfil } = useUserContext()
  const pathname = usePathname()
  const isPublic = !pathname?.startsWith('/dashboard') && !pathname?.startsWith('/admin')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isLogged = !!(userId || user)

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
      className="fixed top-0 z-50 w-full border-b border-black/[.06] bg-white/75 backdrop-blur-2xl dark:border-white/[.08] dark:bg-[#0d0d0f]/75"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="mx-auto h-[1px] w-full max-w-7xl bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
      </div>

      <div
        className={[
          'mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8',
          'h-16',
        ].join(' ')}
      >
        <div className="absolute left-0 right-0 -z-10">
          <div
            className={[
              'transition-all',
              scrolled
                ? 'bg-white/85 shadow-sm backdrop-blur-2xl dark:bg-[#0d0d0f]/90'
                : 'bg-transparent',
            ].join(' ')}
            style={{ height: 64 }}
          />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-black/[.07] bg-white p-1 shadow-sm dark:border-white/10 dark:bg-white/10">
            <Image src="/icon.png" alt="StudyDocu" width={30} height={30} priority />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl">
            StudyDocu
          </span>
        </Link>

        <div className="relative z-10 hidden lg:flex items-center gap-6 text-[15px] font-medium">
          <div className="relative flex items-center gap-7">
            <AnimatePresence initial={false}>
              {navLinks.map((link) => {
                const active = pathname === link.href
                return (
                  <div key={link.href} className="relative">
                    {active && (
                      <motion.span
                        layoutId="active-pill"
                        className="absolute -inset-x-3 -inset-y-2 rounded-full bg-black/[.055] dark:bg-white/10"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Link
                      href={link.href}
                      className={[
                        'relative px-2 py-1 transition-colors',
                        active
                          ? 'text-slate-950 dark:text-white'
                          : 'text-slate-600 hover:text-slate-950 dark:text-zinc-300 dark:hover:text-white',
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

        <div className="relative z-10 hidden lg:flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[.07] bg-white/60 dark:border-white/10 dark:bg-white/10">
            <ThemeToggle />
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[.07] bg-white/60 dark:border-white/10 dark:bg-white/10">
            <LanguageToggle />
          </div>

          {sessionLoading ? (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
            </span>
          ) : isLogged && perfil ? (
            <UserDropdown />
          ) : (
            <>
              <Link
                href="/iniciar-sesion"
                className="text-sm font-medium text-slate-700 hover:text-black dark:text-zinc-200 dark:hover:text-white"
              >
                Iniciar sesion
              </Link>

              <Link href="/registrarse" className="relative inline-flex">
                <span className="rounded-full bg-[#0071e3] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0077ed]">
                  Regístrate
                </span>
              </Link>
            </>
          )}
        </div>

        <div className="relative z-10 flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Abrir menu"
            className="rounded-xl border border-slate-200/90 bg-white/90 p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="px-3 pb-6 pt-2 sm:px-6 lg:hidden"
          >
            <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
              {isLogged && perfil && (
                <div className="mb-4">
                  <UserDropdown className="w-full justify-between" showName />
                </div>
              )}

              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                  show: { transition: { staggerChildren: 0.06 } },
                }}
                className="mb-4 flex flex-col gap-3"
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
                  <Link href="/iniciar-sesion" onClick={() => setMenuOpen(false)}>
                    <button className="w-full rounded-lg bg-gray-100 px-4 py-2 text-center text-sm font-medium text-gray-900 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                      Iniciar sesion
                    </button>
                  </Link>
                  <Link href="/registrarse" onClick={() => setMenuOpen(false)}>
                    <button className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:scale-[1.02]">
                      Crear cuenta gratis
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
