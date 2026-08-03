'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, CheckCircle2, GraduationCap, Grid2X2, MessageCircle } from 'lucide-react'

const links = [
  { href: '/servicios', label: 'Todos', icon: Grid2X2 },
  { href: '/examen-admision-universidad', label: 'Admisión', icon: GraduationCap },
  { href: '/examen-complexivo', label: 'Exámenes', icon: CheckCircle2 },
  { href: '/tesis-pregrado', label: 'Tesis', icon: BookOpen },
]

const WHATSAPP_URL =
  'https://wa.me/593958757302?text=Hola%20StudyDocu,%20necesito%20orientaci%C3%B3n%20sobre%20un%20servicio%20acad%C3%A9mico.'

export default function ServiceContextBar() {
  const pathname = usePathname()

  return (
    <div className="relative z-40 border-b border-black/[.06] bg-white/85 px-4 py-2 backdrop-blur-2xl dark:border-white/[.08] dark:bg-[#0d0d0f]/90 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto">
        <span className="mr-2 hidden shrink-0 text-xs font-bold uppercase tracking-[.14em] text-[#86868b] sm:inline">
          Servicios
        </span>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (label === 'Tesis' && pathname?.startsWith('/tesis-'))
          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                active
                  ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-black'
                  : 'text-[#424245] hover:bg-black/[.05] dark:text-zinc-300 dark:hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          )
        })}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500/15 dark:text-emerald-300"
        >
          <MessageCircle className="h-4 w-4" /> Consultar
        </a>
      </div>
    </div>
  )
}
