import { supabase } from './supabase'
import { registrarLogro, sumarPuntos } from './gamification'

export async function obtenerCodigoReferido(userId: string): Promise<string> {
  const { data, error } = await supabase
    .from('referrals')
    .select('referral_code')
    .eq('user_id', userId)
    .single()

  if (error || !data?.referral_code) {
    throw new Error('Codigo no encontrado')
  }

  return data.referral_code
}

export async function usarCodigoDeReferido(codigo: string, nuevoUsuarioId: string) {
  try {
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .select('user_id')
      .eq('referral_code', codigo)
      .single()

    if (referralError || !referral) throw new Error('Codigo de referido invalido')

    const { error: usoError } = await supabase.from('referrals_uses').insert({
      referred_user_id: nuevoUsuarioId,
      referral_code: codigo,
    })
    if (usoError) throw usoError

    await sumarPuntos(nuevoUsuarioId, 10, 'Registro con codigo de referido')
    await sumarPuntos(referral.user_id, 20, 'Referido exitoso')

    const { count } = await supabase
      .from('referrals_uses')
      .select('*', { count: 'exact', head: true })
      .eq('referral_code', codigo)

    if ((count || 0) === 1) {
      await registrarLogro(referral.user_id, 'primer_referido')
    }

    return { success: true }
  } catch (error) {
    console.error('Error usando codigo de referido:', error)
    return { success: false, message: (error as Error).message }
  }
}
