import { supabase } from './supabase'
import { sumarPuntos, registrarLogro } from './points'

/**
 * Obtiene el código de referido de un usuario.
 */
export async function obtenerCodigoReferido(userId: string): Promise<string> {
  const { data, error } = await supabase
    .from('referrals')
    .select('referral_code')
    .eq('user_id', userId)
    .single()

  if (error || !data?.referral_code) {
    throw new Error('Código no encontrado')
  }

  return data.referral_code
}

/**
 * Lógica para usar un código de referido durante el registro de un nuevo usuario.
 */
export async function usarCodigoDeReferido(codigo: string, nuevoUsuarioId: string) {
  try {
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select('user_id')
      .eq('referral_code', codigo)
      .single()

    if (referralError || !referral) throw new Error('Código de referido inválido')

    const { error: usoError } = await supabase.from('referrals_uses').insert({
      referred_user_id: nuevoUsuarioId,
      referral_code: codigo,
    })
    if (usoError) throw usoError

    await sumarPuntos(nuevoUsuarioId, 10, 'Registro con código de referido')
    await sumarPuntos(referral.user_id, 20, 'Referido exitoso')

    const { count } = await supabase
      .from('referrals_uses')
      .select('*', { count: 'exact', head: true })
      .eq('referral_code', codigo)

    if ((count || 0) === 1) {
      await registrarLogro(referral.user_id, '🎉 ¡Tu primer referido!')
    }

    return { success: true }
  } catch (error) {
    console.error('❌ Error usando código de referido:', error)
    return { success: false, message: (error as Error).message }
  }
}
