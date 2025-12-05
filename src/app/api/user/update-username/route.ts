// ✅ File: src/app/api/user/update-username/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'   // server client (lee cookies)
import { supabaseAdmin } from '@/lib/supabaseAdmin'     // service role (bypassa RLS)

// (opcional) bloquea nombres reservados
const RESERVED = ['admin', 'root', 'support', 'studydocu']

// Normaliza igual que en SQL: lower + trim + sin espacios + solo a-z 0-9 . _ -
function normalize(u: unknown) {
  return String(u ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9._-]/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseServer()

    // 🔐 usuario autenticado
    const { data: authData, error: authErr } = await supabase.auth.getUser()
    if (authErr || !authData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const me = authData.user

    // 📦 payload
    const body = await req.json().catch(() => ({}))
    const value = normalize(body?.username)

    // ✅ validaciones
    if (!value) return NextResponse.json({ error: 'Falta username' }, { status: 400 })
    if (value.length < 3 || value.length > 20 || !/^[a-z0-9._-]{3,20}$/.test(value)) {
      return NextResponse.json({ error: 'Nombre de usuario inválido' }, { status: 400 })
    }
    if (RESERVED.includes(value)) {
      return NextResponse.json({ error: 'Nombre de usuario no disponible' }, { status: 409 })
    }

    // Si no cambia, termina rápido
    const { data: current, error: curErr } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', me.id)
      .maybeSingle()

    if (curErr) {
      return NextResponse.json({ error: 'No se pudo leer tu perfil' }, { status: 500 })
    }
    if (current?.username?.toLowerCase?.() === value) {
      return NextResponse.json({ success: true, unchanged: true })
    }

    // 🔎 disponibilidad (excluyendo mi propio id) con service role
    const { count, error: chkErr } = await supabaseAdmin
      .from('profiles')
      .select('id', { head: true, count: 'exact' })
      .ilike('username', value) // comparación exacta case-insensitive (sin %)
      .neq('id', me.id)

    if (chkErr) {
      return NextResponse.json({ error: 'No se pudo validar disponibilidad' }, { status: 500 })
    }
    if ((count ?? 0) > 0) {
      return NextResponse.json({ error: 'Nombre de usuario no disponible' }, { status: 409 })
    }

    // ✍️ actualización con server client (RLS: update own profile)
    const { error: updErr } = await supabase
      .from('profiles')
      .update({ username: value })
      .eq('id', me.id)

    if (updErr) {
      // colisión por carrera (índice único) → 409
      if ((updErr as any).code === '23505') {
        return NextResponse.json({ error: 'Nombre de usuario no disponible' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
    }

    return NextResponse.json({ success: true, username: value })
  } catch (e) {
    console.error('update-username error', e)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
