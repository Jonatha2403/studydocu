'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { sendResumenToAI } from '@/lib/ai'
import { Loader2, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function ResumenNotas() {
  const [texto, setTexto] = useState('')
  const [resumen, setResumen] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerarResumen = async () => {
    if (!texto.trim()) {
      toast.error('Escribe contenido antes de generar el resumen.')
      return
    }

    setLoading(true)
    try {
      const respuesta = await sendResumenToAI(texto)
      setResumen(respuesta)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'No se pudo generar el resumen.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Pega tus apuntes o notas
        </label>
        <Textarea
          rows={8}
          placeholder="Pega aqui tus notas y genera un resumen claro y estructurado."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="resize-none"
        />

        <Button
          onClick={handleGenerarResumen}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 py-3 text-base text-white hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generando resumen...
            </>
          ) : (
            'Generar resumen con IA'
          )}
        </Button>
      </div>

      {resumen && (
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            <FileText className="h-5 w-5 text-cyan-600" />
            Resumen generado
          </h3>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {resumen}
          </p>
        </div>
      )}
    </div>
  )
}
