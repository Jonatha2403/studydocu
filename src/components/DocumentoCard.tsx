'use client'

import Link from 'next/link'
import { Heart, MessageSquare, Download } from 'lucide-react'

interface DocumentoCardProps {
  id: string
  titulo: string
  categoria: string
  universidad?: string
  tipo: string
  puntos: number
  reacciones?: number
  comentarios?: number
  descargas?: number
}

export default function DocumentoCard({
  id,
  titulo,
  categoria,
  universidad,
  tipo,
  puntos,
  reacciones = 0,
  comentarios = 0,
  descargas = 0,
}: DocumentoCardProps) {
  return (
    <Link
      href={`/documento/${id}`}
      className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all"
    >
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{titulo}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {categoria} • {tipo}{universidad ? ` • ${universidad}` : ''}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4" /> {reacciones}
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> {comentarios}
        </div>
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4" /> {descargas}
        </div>
        <div className="font-semibold text-blue-600 dark:text-blue-400">+{puntos} pts</div>
      </div>
    </Link>
  )
}
