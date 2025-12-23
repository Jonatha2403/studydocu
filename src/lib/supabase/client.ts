// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

export function getSupabaseBrowserClient(): SupabaseClient {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  cached = createBrowserClient(url, anon, {
    auth: {
      persistSession: true,
      storageKey: 'supabase.auth.token',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  })

  return cached
}

/**
 * ✅ Compat: para que todos los imports existentes funcionen:
 * import { supabase } from '@/lib/supabase/client'
 *
 * Nota: es un getter para crear el cliente solo cuando se use en el browser.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseBrowserClient()
    const value = (client as any)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})
