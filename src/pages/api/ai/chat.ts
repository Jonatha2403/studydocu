// src/pages/api/ai/chat.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatRequestBody {
  messages: ChatMessage[]
}

const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo no permitido' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Falta configurar OPENAI_API_KEY en el servidor' })
  }

  const body = req.body as ChatRequestBody

  if (
    !body.messages ||
    !Array.isArray(body.messages) ||
    !body.messages.every(
      (msg): msg is ChatMessage =>
        ['user', 'assistant', 'system'].includes(msg.role) && typeof msg.content === 'string'
    )
  ) {
    return res.status(400).json({ error: 'Mensajes invalidos' })
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
      model,
      messages: body.messages,
      temperature: 0.7,
    })

    const respuesta = completion.choices[0]?.message?.content?.trim() || ''
    return res.status(200).json({ respuesta })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('Error en chat IA:', message)
    return res.status(500).json({ error: 'Error al generar respuesta con IA' })
  }
}
