// /lib/downloadControl.ts
import { supabase } from '@/lib/supabase'

export async function puedeDescargar(userId: string): Promise<boolean> {
  try {
    const { data: perfil } = await supabase
      .from('profiles')
      .select('suscripcion_activa')
      .eq('id', userId)
      .single()

    const { count } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'aprobado')

    return !!perfil?.suscripcion_activa || (count || 0) > 0
  } catch (e) {
    console.error('Error al verificar descarga:', e)
    return false
  }
}
