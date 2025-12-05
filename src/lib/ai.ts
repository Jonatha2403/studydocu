// src/lib/ai.ts

export type Role = 'user' | 'ai'

export interface Message {
  role: Role
  content: string
}

/**
 * Chat general con la IA (modo conversación).
 */
export async function sendMessageToAI(history: Message[]): Promise<string> {
  const lastUserMessage = [...history].reverse().find(m => m.role === 'user')

  if (!lastUserMessage) {
    return 'No veo ninguna pregunta todavía. Escríbeme algo y te ayudo 🙂'
  }

  return `Estoy procesando tu mensaje: "${lastUserMessage.content}". 
Puedo ayudarte a resumir apuntes, explicar conceptos o generar ideas de estudio dentro de StudyDocu. 📚`
}

/**
 * Resumen de notas con IA (modo “Notas a Resumen”).
 * Por ahora es un mock; luego lo podemos conectar a una API real.
 */
export async function sendResumenToAI(texto: string): Promise<string> {
  if (!texto.trim()) {
    return 'No recibí contenido para resumir.'
  }

  // Aquí simulas el resumen. Luego esto se cambia por un fetch a /api/ia-resumen o similar.
  return [
    '📝 *Resumen automático (simulado)*',
    '',
    'He leído tus notas y puedo ayudarte a:',
    '• Identificar ideas principales',
    '• Organizar el contenido en bloques claros',
    '• Preparar un resumen para estudiar o exponer',
    '',
    'Por ahora (modo demo), solo responderé con este mensaje fijo,',
    'pero luego conectaremos esto a la IA real para que te devuelva un resumen',
    'personalizado según el texto que pegues aquí. 🚀'
  ].join('\n')
}
