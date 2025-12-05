// src/lib/validarEsquemaProfiles.ts
import { supabase } from '@/lib/supabase'

export async function validarEsquemaProfiles() {
  const columnasEsperadas = [
    'id',
    'email',
    'nombre_completo',
    'universidad',
    'referido',
    'rol',
    'points',
    'subscription_active',
    'onboarding_complete',
    'created_at',
    'username',
    'intereses'
  ]

  try {
    const { data, error } = await supabase.rpc('pg_table_def', {
      table_name_input: 'profiles'
    })

    if (error) throw error

    const columnasEncontradas = data?.map((col: any) => col.column_name) || []
    const faltantes = columnasEsperadas.filter(c => !columnasEncontradas.includes(c))

    if (faltantes.length > 0) {
      console.warn('⚠️ Columnas faltantes o mal nombradas en "profiles":', faltantes)
    } else {
      console.log('✅ El esquema de la tabla "profiles" es correcto.')
    }
  } catch (e) {
    console.error('❌ Error al validar el esquema de la tabla profiles:', e)
  }
}
