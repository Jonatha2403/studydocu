// src/pages/api/ai/resumen.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Método no permitido')

  const { texto } = req.body
  if (!texto || typeof texto !== 'string') {
    return res.status(400).json({ error: 'Texto inválido' })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente experto en resumir notas académicas de estudiantes.',
        },
        {
          role: 'user',
          content: `Resume el siguiente texto de forma clara y concisa:\n\n${texto}`,
        },
      ],
      temperature: 0.5,
    })

    const resumen = completion.choices[0]?.message?.content?.trim() || ''
    return res.status(200).json({ resumen })
  } catch (error) {
    console.error('Error al generar resumen:', error)
    return res.status(500).json({ error: 'Error al generar resumen con IA' })
  }
}
