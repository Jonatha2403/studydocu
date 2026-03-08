'use client'

import { useState } from 'react'
import { sendMessageToAI, type Message } from '@/lib/ai'
import { Loader2, Send, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const newMessages: Message[] = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const respuesta = await sendMessageToAI(newMessages)
      setMessages([...newMessages, { role: 'ai', content: respuesta }])
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'No se pudo conectar con la IA.'
      toast.error(msg)
      setMessages([
        ...newMessages,
        {
          role: 'ai',
          content:
            'No pude responder en este momento. Revisa OPENAI_API_KEY en Vercel y vuelve a intentar.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <Sparkles className="h-4 w-4 text-cyan-600" />
          Asistente academico
        </div>

        <div className="max-h-[420px] space-y-3 overflow-y-auto">
          {messages.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600 dark:border-slate-600 dark:bg-slate-800/40 dark:text-slate-300">
              Escribe una pregunta para empezar.
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[88%] rounded-xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'ml-auto bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                  : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              La IA esta escribiendo...
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="rounded-xl bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
          aria-label="Enviar mensaje"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  )
}
