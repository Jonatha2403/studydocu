// src/lib/supabaseServer.ts
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * Devuelve un cliente de Supabase para servidor leyendo cookies de la request.
 * Nota: en Next 15+ `cookies()` es async, por eso este helper también lo es.
 */
export async function supabaseServer() {
  const cookieStore = await cookies() // 👈 ahora sí, await

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // En páginas/handlers donde necesites set/remove, puedes implementarlos.
        // Para lecturas (getUser, select, etc.) no hace falta.
        set() {},
        remove() {},
      },
    }
  )
}
