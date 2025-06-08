// src/lib/ai.ts

/**
 * Tipo compartido entre IAChat y funciones de IA
 */
export type Message = {
  role: 'user' | 'ai'
  content: string
}

/**
 * Envia texto a la API para generar un resumen con IA
 */
export async function sendResumenToAI(texto: string): Promise<string> {
  try {
    const response = await fetch('/api/ai/resumen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ texto }),
    })

    if (!response.ok) throw new Error('Error al generar resumen')

    const data: { resumen?: string } = await response.json()
    return data.resumen ?? 'No se pudo generar el resumen.'
  } catch (error) {
    console.error('Error al obtener resumen de IA:', error)
    return '❌ Hubo un problema al generar el resumen.'
  }
}

/**
 * Simula la respuesta de la IA en el chat (modo desarrollo)
 */
export async function sendMessageToAI(messages: Message[]): Promise<string> {
  const lastMessage = messages[messages.length - 1]?.content || ''
  return `💬 Simulación de respuesta IA a: "${lastMessage}"`
}
