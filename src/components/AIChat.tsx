'use client'

import { useState } from 'react'
import { sendMessageToAI, type Message } from '@/lib/ai'
import { Loader2, Send } from 'lucide-react'

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

    const respuesta = await sendMessageToAI(newMessages)
    setMessages([...newMessages, { role: 'ai', content: respuesta }])
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="max-h-[400px] overflow-y-auto border rounded-xl p-4 bg-white dark:bg-gray-800 shadow">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center">🤖 ¡Hazle una pregunta a la IA!</p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-3 rounded-xl max-w-[85%] ${
              msg.role === 'user'
                ? 'bg-purple-600 text-white self-end ml-auto'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-400 italic mt-2">La IA está escribiendo...</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-xl transition"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  )
}
