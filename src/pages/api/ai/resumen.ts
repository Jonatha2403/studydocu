// src/pages/api/ai/resumen.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo no permitido' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Falta configurar OPENAI_API_KEY en el servidor' })
  }

  const { texto } = req.body as { texto?: string }
  if (!texto || typeof texto !== 'string') {
    return res.status(400).json({ error: 'Texto invalido' })
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente experto en resumir notas academicas para estudiantes universitarios en espanol claro.',
        },
        {
          role: 'user',
          content: `Resume el siguiente texto de forma clara, estructurada y breve:\n\n${texto}`,
        },
      ],
      temperature: 0.5,
    })

    const resumen = completion.choices[0]?.message?.content?.trim() || ''
    return res.status(200).json({ resumen })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    console.error('Error al generar resumen IA:', message)
    return res.status(500).json({ error: 'Error al generar resumen con IA' })
  }
}
