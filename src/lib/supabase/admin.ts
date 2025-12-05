// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) {
  console.warn(
    '[SUPABASE_ADMIN_WARN] Falta NEXT_PUBLIC_SUPABASE_URL. supabaseAdmin será null.'
  )
}

if (!serviceRoleKey) {
  console.warn(
    '[SUPABASE_ADMIN_WARN] Falta SUPABASE_SERVICE_ROLE_KEY. supabaseAdmin será null.'
  )
}

// Creamos el cliente SOLO si ambas env existen
export const supabaseAdmin =
  url && serviceRoleKey
    ? createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null
