'use client'

import { useEffect, useState } from 'react'
import { obtenerCodigoReferido } from '@/lib/referrals'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'

interface Props {
  userId: string
}

export default function ReferralCard({ userId }: Props) {
  const [codigo, setCodigo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCodigo = async () => {
      try {
        const codigoObtenido = await obtenerCodigoReferido(userId)
        setCodigo(codigoObtenido)
      } catch (error) {
        console.error('Error al obtener código:', error)
        toast.error('❌ Error al obtener tu código de referido.')
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchCodigo()
  }, [userId])

  const copiar = () => {
    if (!codigo) return
    navigator.clipboard.writeText(codigo)
    toast.success('✅ Código copiado al portapapeles')
  }

  return (
    <div className="p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md text-center">
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">🎁 Tu Código de Referido</h3>

      {loading ? (
        <p className="text-sm text-gray-500">Cargando código...</p>
      ) : codigo ? (
        <div className="flex justify-center items-center gap-2">
          <span className="text-lg font-mono text-blue-600 dark:text-yellow-400">{codigo}</span>
          <button
            onClick={copiar}
            className="text-gray-500 hover:text-blue-600 dark:hover:text-yellow-400 transition"
            title="Copiar código"
          >
            <Copy size={18} />
          </button>
        </div>
      ) : (
        <p className="text-sm text-red-500">No se encontró ningún código.</p>
      )}

      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Comparte este código con tus amigos y gana puntos si se registran.
      </p>
    </div>
  )
}
