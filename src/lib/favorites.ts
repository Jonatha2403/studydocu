import { supabase } from './supabase'

/**
 * Agrega un documento a favoritos
 */
export async function agregarAFavoritos(userId: string, documentId: string) {
  try {
    const { error } = await supabase.from('favorites').insert([
      {
        user_id: userId,
        document_id: documentId,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) throw error
    return { success: true }
  } catch (err) {
    console.error('❌ Error al agregar a favoritos:', err)
    return { success: false, error: err }
  }
}

/**
 * Elimina un documento de favoritos
 */
export async function eliminarDeFavoritos(userId: string, documentId: string) {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('document_id', documentId)

    if (error) throw error
    return { success: true }
  } catch (err) {
    console.error('❌ Error al eliminar de favoritos:', err)
    return { success: false, error: err }
  }
}

/**
 * Verifica si un documento está en favoritos del usuario
 */
export async function estaEnFavoritos(userId: string, documentId: string) {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('document_id', documentId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // Not found = OK
    return !!data
  } catch (err) {
    console.error('❌ Error al verificar favorito:', err)
    return false
  }
}

/**
 * Obtiene todos los documentos favoritos de un usuario
 */
export async function obtenerFavoritos(userId: string) {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        documents (
          id,
          file_name,
          category,
          created_at,
          downloads,
          likes,
          file_path
        )
      `)
      .eq('user_id', userId)

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('❌ Error al obtener favoritos:', err)
    return []
  }
}
