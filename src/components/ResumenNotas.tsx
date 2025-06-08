'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { sendResumenToAI } from '@/lib/ai'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ResumenNotas() {
  const [texto, setTexto] = useState('')
  const [resumen, setResumen] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerarResumen = async () => {
    if (!texto.trim()) {
      toast.error('✏️ Escribe algo antes de generar el resumen')
      return
    }

    setLoading(true)
    const respuesta = await sendResumenToAI(texto)
    setResumen(respuesta)
    setLoading(false)
  }

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div>
        <label className="block text-base font-semibold text-gray-800 dark:text-white mb-2">
          ✍️ Tus apuntes o notas:
        </label>
        <Textarea
          rows={8}
          placeholder="Pega aquí tus notas de clase, texto académico o contenido que desees resumir..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="resize-none"
        />
      </div>

      <Button
        onClick={handleGenerarResumen}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base rounded-xl"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            Generando...
          </>
        ) : (
          '✨ Generar resumen con IA'
        )}
      </Button>

      {resumen && (
        <div className="mt-6 p-5 border rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
            📄 Resumen generado:
          </h3>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {resumen}
          </p>
        </div>
      )}
    </div>
  )
}
