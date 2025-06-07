// src/pages/api/ai/chat.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de tener esta variable en .env.local
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Método no permitido')

  const { messages } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Mensajes inválidos' })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Puedes usar 'gpt-3.5-turbo' si no tienes acceso a gpt-4
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
    })

    const respuesta = completion.choices[0]?.message?.content?.trim() || ''
    return res.status(200).json({ respuesta })
  } catch (error) {
    console.error('Error en chat IA:', error)
    return res.status(500).json({ error: 'Error al generar respuesta con IA' })
  }
}
