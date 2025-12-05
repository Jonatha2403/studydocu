'use client'

import { motion } from 'framer-motion'
import { Star, Lock, Trophy, GraduationCap, BookCheck, HelpCircle } from 'lucide-react'
import * as React from 'react'

type IconKey = 'trophy' | 'star' | 'graduation' | 'book'

const iconMap: Record<IconKey, React.ReactNode> = {
  trophy: <Trophy className="text-yellow-500" size={28} />,
  star: <Star className="text-purple-500" size={28} />,
  graduation: <GraduationCap className="text-blue-500" size={28} />,
  book: <BookCheck className="text-green-500" size={28} />,
}

interface Props {
  logro: {
    id: string
    title: string
    description: string
    icon: string // se validará contra IconKey
    unlocked?: boolean
    difficulty?: number // 1–5 opcional
  }
  index: number
}

function renderIcon(icon: string, unlocked: boolean | undefined) {
  // normaliza y limita a las keys conocidas; fallback a estrella o candado
  const key = icon?.toLowerCase() as IconKey
  if (!unlocked) return <Lock size={28} className="text-gray-400" />
  return iconMap[key] ?? <HelpCircle className="text-muted-foreground" size={28} />
}

function DifficultyStars({ level = 1 }: { level?: number }) {
  const filled = Math.min(Math.max(level, 1), 5)
  return (
    <div className="flex items-center gap-1" aria-label={`Dificultad ${filled} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}
        />
      ))}
    </div>
  )
}

export default function LogroCard({ logro, index }: Props) {
  const unlocked = !!logro.unlocked

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={[
        'relative rounded-2xl p-6 border shadow-sm transition-all',
        unlocked
          ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg'
          : 'bg-gray-100/60 dark:bg-gray-800/60 border-gray-300 dark:border-gray-700',
      ].join(' ')}
    >
      {/* glow sutil para desbloqueados */}
      {unlocked && (
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-yellow-300/10 to-indigo-400/10 blur-xl" />
      )}

      {/* cinta de bloqueado */}
      {!unlocked && (
        <div className="absolute -right-2 -top-2 rotate-6">
          <span className="rounded-md bg-gray-300 dark:bg-gray-700 px-2 py-1 text-[10px] font-semibold tracking-wider text-gray-700 dark:text-gray-200">
            BLOQUEADO
          </span>
        </div>
      )}

      <div className="flex items-start gap-4 mb-3">
        <div
          className={[
            'shrink-0 rounded-full border p-3',
            unlocked ? 'bg-white dark:bg-gray-900' : 'bg-gray-200 dark:bg-gray-700',
          ].join(' ')}
          aria-hidden
        >
          {renderIcon(logro.icon, unlocked)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
              {logro.title}
            </h2>
            {/* estrellas si viene dificultad */}
            {typeof logro.difficulty === 'number' && (
              <DifficultyStars level={logro.difficulty} />
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {logro.description}
          </p>
        </div>
      </div>

      {/* footer mini */}
      <div className="mt-4 flex items-center justify-between">
        <div
          className={[
            'text-xs font-medium rounded-full px-2.5 py-1',
            unlocked
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
          ].join(' ')}
        >
          {unlocked ? 'Desbloqueado' : 'Por desbloquear'}
        </div>
      </div>

      {/* efecto suavito al hover */}
      <style jsx>{`
        div:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </motion.div>
  )
}
