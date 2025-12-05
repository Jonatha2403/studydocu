// src/lib/supabase/server.ts
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })
}

// ⭐ AGREGADO: ESTA FUNCIÓN ES LA QUE TUS RUTAS NECESITAN
export async function createClient() {
  return createSupabaseServerClient()
}

export async function getServerClient() {
  return createSupabaseServerClient()
}

export async function getRouteHandlerClient() {
  return createSupabaseServerClient()
}
