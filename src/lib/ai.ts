// src/lib/ai.ts

export type Role = 'user' | 'ai'

export interface Message {
  role: Role
  content: string
}

export async function sendMessageToAI(history: Message[]): Promise<string> {
  const messages = history
    .filter((m) => m.content?.trim())
    .map((m) => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content.trim(),
    }))

  if (!messages.length) {
    return 'No veo ninguna pregunta todavia. Escribeme algo y te ayudo.'
  }

  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error || 'No se pudo obtener respuesta de IA.')
  }

  return String(data?.respuesta || 'No se obtuvo respuesta.')
}

export async function sendResumenToAI(texto: string): Promise<string> {
  if (!texto.trim()) {
    return 'No recibi contenido para resumir.'
  }

  const res = await fetch('/api/ai/resumen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto: texto.trim() }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error || 'No se pudo generar el resumen.')
  }

  return String(data?.resumen || 'No se obtuvo resumen.')
}
