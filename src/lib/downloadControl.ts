// /lib/downloadControl.ts
import { supabase } from '@/lib/supabase'

export async function puedeDescargar(userId: string): Promise<boolean> {
  try {
    if (!userId) return false
    const { data: perfil, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error
    return Boolean(perfil?.id)
  } catch (e) {
    console.error('Error al verificar descarga:', e)
    return false
  }
}
