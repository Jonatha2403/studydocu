// src/app/api/user/check-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

function norm(v: unknown) {
  return String(v ?? '').trim().toLowerCase()
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const value = norm(email)

    // validación básica
    const valid = /^\S+@\S+\.\S+$/.test(value)
    if (!valid) {
      return NextResponse.json({ available: false, reason: 'invalid' }, { status: 200 })
    }

    // 1) PRIMERO: RPC que consulta auth.users (recomendado)
    const { data, error } = await supabaseAdmin.rpc('email_available', { p_email: value })
    if (!error && typeof data === 'boolean') {
      return NextResponse.json({ available: Boolean(data) }, { status: 200 })
    }

    // 2) FALLBACK: recorrer usuarios por la API Admin (solo si el RPC falta/falla)
    try {
      let page = 1
      let found = false
      // Nota: no hay filtro por email, se recorre por páginas.
      // Para entornos de producción con muchos usuarios, deja el RPC funcionando.
      // Aquí buscamos hasta 3 páginas como red de seguridad.
      while (page <= 3 && !found) {
        // @ts-ignore tipos del SDK
        const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
          page,
          perPage: 1000,
        })
        if (listErr) break
        const users = list?.users ?? []
        found = users.some((u: any) => (u.email ?? '').toLowerCase() === value)
        if (users.length < 1000) break
        page++
      }
      return NextResponse.json({ available: !found, reason: 'fallback' }, { status: 200 })
    } catch {
      // si también falla el fallback, devolvemos no-verificable
      return NextResponse.json({ available: false, reason: 'check_failed' }, { status: 200 })
    }
  } catch (e) {
    console.error('check-email error:', e)
    return NextResponse.json({ available: false, reason: 'check_failed' }, { status: 200 })
  }
}
