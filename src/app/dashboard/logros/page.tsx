'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Share2, Search, SlidersHorizontal } from 'lucide-react'
import { useUserContext } from '@/context/UserContext'
import { toast } from 'sonner'
import AuthModal from '@/components/auth/AuthModal'
import LogrosList from '@/components/logros/LogrosList'
import { Progress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'

type VistaFiltro = 'all' | 'unlocked' | 'locked'
type Orden = 'title' | 'recent' | 'difficulty'

export default function LogrosPage() {
  const { perfil, loading } = useUserContext()
  const [showAuth, setShowAuth] = useState(false)

  // toolbar state
  const [vista, setVista] = useState<VistaFiltro>('all')
  const [q, setQ] = useState<string>('')
  const [orden, setOrden] = useState<Orden>('title')

  // progreso global
  const [totales, setTotales] = useState<{ total: number; unlocked: number }>({ total: 0, unlocked: 0 })
  const progreso = useMemo(
    () => (totales.total > 0 ? Math.round((totales.unlocked / totales.total) * 100) : 0),
    [totales]
  )

  useEffect(() => {
    if (!loading && !perfil) {
      toast.warning('Debes iniciar sesión para ver tus logros')
      setShowAuth(true)
    }
  }, [loading, perfil])

  const handleShare = async () => {
    const shareData = {
      title: 'Mis logros en StudyDocu',
      text: `Tengo ${totales.unlocked}/${totales.total} logros (${progreso}%). ¿Y tú?`,
      url: typeof window !== 'undefined' ? window.location.href : ''
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        toast.success('Enlace copiado al portapapeles')
      }
    } catch {
      /* usuario canceló */
    }
  }

  // Botón de pestaña simple
  const TabBtn = ({
    value,
    children
  }: {
    value: VistaFiltro
    children: React.ReactNode
  }) => {
    const active = vista === value
    return (
      <button
        type="button"
        onClick={() => setVista(value)}
        className={[
          'h-9 px-4 text-sm font-medium transition-colors outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring',
          active
            ? 'bg-primary text-primary-foreground'
            : 'bg-transparent text-muted-foreground hover:bg-muted/60'
        ].join(' ')}
        aria-pressed={active}
      >
        {children}
      </button>
    )
  }

  return (
    <main className="relative max-w-6xl mx-auto px-4 py-12">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Glow blobs de fondo */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-[-10%] h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute left-[-10%] bottom-[-10%] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 justify-center mb-3">
          <Sparkles className="text-yellow-500" size={24} />
          <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wide">Gamificación</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Tus logros</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Visualiza y comparte tus insignias en StudyDocu. ¡Sigue acumulando hitos cada día! ✨
        </p>
      </motion.section>

      {/* Resumen + acciones */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="grid gap-4 sm:grid-cols-2 items-center mb-8"
      >
        {/* Card de progreso */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Progreso total</p>
            <span className="text-sm font-semibold">{totales.unlocked}/{totales.total}</span>
          </div>
          <Progress value={progreso} />
          <p className="mt-2 text-xs text-muted-foreground">{progreso}% completado</p>
        </div>

        {/* Toolbar (Search / Tabs / Orden / Compartir) */}
        <div className="grid gap-3 md:grid-cols-12 items-center">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar logro por título o descripción…"
              className="pl-9 h-9"
              value={q}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
            />
          </div>

          {/* Segmented Tabs */}
          <div className="md:col-span-4">
            <div
              role="tablist"
              aria-label="Filtros de logros"
              className="inline-flex w-full md:w-auto overflow-hidden rounded-md border bg-background"
            >
              <TabBtn value="all">Todos</TabBtn>
              <div className="w-px bg-border" aria-hidden />
              <TabBtn value="unlocked">Desbloqueados</TabBtn>
              <div className="w-px bg-border" aria-hidden />
              <TabBtn value="locked">Bloqueados</TabBtn>
            </div>
          </div>

          {/* Orden */}
          <div className="md:col-span-2 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={orden}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOrden(e.target.value as Orden)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              aria-label="Ordenar por"
            >
              <option value="title">Título (A–Z)</option>
              <option value="recent">Más recientes</option>
              <option value="difficulty">Dificultad</option>
            </select>
          </div>

          {/* Compartir */}
          <div className="md:col-span-1 flex md:justify-end">
            <Button onClick={handleShare} variant="secondary" className="h-9 w-full md:w-auto">
              <Share2 className="mr-2 h-4 w-4" /> Compartir
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Lista de logros */}
      <LogrosList
        filtro={vista}
        query={q}
        orden={orden}
        onStats={(stats) => setTotales(stats)}
      />
    </main>
  )
}
