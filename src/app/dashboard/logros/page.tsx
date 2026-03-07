'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Share2, Search, SlidersHorizontal } from 'lucide-react'
import { useUserContext } from '@/context/UserContext'
import { toast } from 'sonner'
import AuthModal from '@/components/auth/AuthModal'
import LogrosList from '@/components/logros/LogrosList'
import { Progress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type VistaFiltro = 'all' | 'unlocked' | 'locked'
type Orden = 'title' | 'recent' | 'difficulty'

function TabButton({
  value,
  active,
  onSelect,
  children,
}: {
  value: VistaFiltro
  active: boolean
  onSelect: (value: VistaFiltro) => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={[
        'h-9 px-4 text-sm font-medium transition-colors outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-transparent text-muted-foreground hover:bg-muted/60',
      ].join(' ')}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

export default function LogrosPage() {
  const { perfil, loading } = useUserContext()
  const [showAuth, setShowAuth] = useState(false)

  const [vista, setVista] = useState<VistaFiltro>('all')
  const [q, setQ] = useState('')
  const [orden, setOrden] = useState<Orden>('title')

  const [totales, setTotales] = useState<{ total: number; unlocked: number }>({
    total: 0,
    unlocked: 0,
  })
  const progreso = useMemo(
    () => (totales.total > 0 ? Math.round((totales.unlocked / totales.total) * 100) : 0),
    [totales]
  )
  const handleStats = useCallback(
    (stats: { total: number; unlocked: number }) => setTotales(stats),
    []
  )

  useEffect(() => {
    if (!loading && !perfil) {
      toast.warning('Debes iniciar sesion para ver tus logros')
      setShowAuth(true)
    }
  }, [loading, perfil])

  const handleShare = async () => {
    const shareData = {
      title: 'Mis logros en StudyDocu',
      text: `Tengo ${totales.unlocked}/${totales.total} logros (${progreso}%).`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        toast.success('Enlace copiado al portapapeles')
      }
    } catch {
      // cancelado por usuario
    }
  }

  return (
    <main className="relative mx-auto max-w-6xl px-3 py-8 sm:px-6 sm:py-10">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-[-10%] h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8 text-center"
      >
        <div className="mb-3 inline-flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-500" size={24} />
          <span className="text-sm font-semibold uppercase tracking-wide text-yellow-600">
            Gamificacion
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Tus logros</h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-600 dark:text-gray-400">
          Visualiza y comparte tus insignias en StudyDocu. Sigue acumulando hitos cada dia.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="mb-8 space-y-4"
      >
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Progreso total</p>
            <span className="text-sm font-semibold">
              {totales.unlocked}/{totales.total}
            </span>
          </div>
          <Progress value={progreso} />
          <p className="mt-2 text-xs text-muted-foreground">{progreso}% completado</p>
        </div>

        <div className="grid gap-3 lg:grid-cols-12 lg:items-center">
          <div className="relative lg:col-span-5">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar logro por titulo o descripcion"
              className="h-9 pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="lg:col-span-4">
            <div
              role="tablist"
              aria-label="Filtros de logros"
              className="inline-flex w-full overflow-hidden rounded-md border bg-background lg:w-auto"
            >
              <TabButton value="all" active={vista === 'all'} onSelect={setVista}>
                Todos
              </TabButton>
              <div className="w-px bg-border" aria-hidden />
              <TabButton value="unlocked" active={vista === 'unlocked'} onSelect={setVista}>
                Desbloqueados
              </TabButton>
              <div className="w-px bg-border" aria-hidden />
              <TabButton value="locked" active={vista === 'locked'} onSelect={setVista}>
                Bloqueados
              </TabButton>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:col-span-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              aria-label="Ordenar por"
            >
              <option value="title">Titulo (A-Z)</option>
              <option value="recent">Mas recientes</option>
              <option value="difficulty">Dificultad</option>
            </select>
          </div>

          <div className="lg:col-span-1 lg:flex lg:justify-end">
            <Button onClick={handleShare} variant="secondary" className="h-9 w-full lg:w-auto">
              <Share2 className="mr-2 h-4 w-4" /> Compartir
            </Button>
          </div>
        </div>
      </motion.section>

      <LogrosList filtro={vista} query={q} orden={orden} onStats={handleStats} />
    </main>
  )
}
