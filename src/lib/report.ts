import { supabase } from './supabase'

export async function reportarContenido(
  userId: string,
  reason: string,
  documentId: string,
  commentId?: string
) {
  try {
    const { error } = await supabase.from('reports').insert({
      user_id: userId,
      reason,
      document_id: documentId,
      comment_id: commentId || null,
    })

    if (error) throw error
    return { success: true }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('❌ Error al reportar contenido:', e)
      return { success: false, message: e.message }
    }

    console.error('❌ Error desconocido al reportar contenido:', e)
    return { success: false, message: 'Error desconocido' }
  }
}
