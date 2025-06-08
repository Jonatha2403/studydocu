import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js' // ✅ Importa el tipo adecuado

export function useUser() {
  const [user, setUser] = useState<User | null>(null) // ✅ Tipado correcto

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null)
    })
  }, [])

  return { user }
}
