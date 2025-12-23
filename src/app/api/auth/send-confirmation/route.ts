// src/app/api/auth/send-confirmation/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendConfirmationEmail } from '@/utils/sendConfirmationEmail'

function getEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL

  const finalAppUrl =
    appUrl && appUrl.startsWith('http')
      ? appUrl
      : appUrl
      ? `https://${appUrl}`
      : null

  if (!supabaseUrl || !supabaseServiceKey || !finalAppUrl) {
    throw new Error(
      'Missing env: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_APP_URL (or NEXT_PUBLIC_SITE_URL)'
    )
  }

  return { supabaseUrl, supabaseServiceKey, appUrl: finalAppUrl.replace(/\/+$/, '') }
}

function getSupabaseAdmin() {
  const { supabaseUrl, supabaseServiceKey } = getEnv()
  return createClient(supabaseUrl, supabaseServiceKey)
}

function normEmail(v: unknown) {
  return String(v ?? '').trim().toLowerCase()
}
function normText(v: unknown) {
  return String(v ?? '').trim()
}
function genUsername(name: string, uid: string) {
  const base = (name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'user').slice(0, 20)
  return `${base}_${uid.slice(0, 6)}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = normEmail(body?.email)
    const password = String(body?.password ?? '')
    const nombre_completo = normText(body?.nombre_completo)
    const universidad = body?.universidad ? String(body.universidad) : null
    const referido = body?.referido ? String(body.referido) : null
    const role = body?.role ? String(body.role) : 'estudiante'

    // -------- Validaciones de entrada --------
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 })
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 })
    }
    if (!nombre_completo) {
      return NextResponse.json({ error: 'El nombre completo es obligatorio.' }, { status: 400 })
    }

    // -------- Init Supabase Admin (lazy) --------
    const supabaseAdmin = getSupabaseAdmin()
    const { appUrl } = getEnv()

    // -------- Chequeo previo en auth.users (RPC) --------
    const { data: available, error: rpcErr } = await supabaseAdmin.rpc('email_available', { p_email: email })
    if (!rpcErr && available === false) {
      return NextResponse.json({ error: 'Este correo ya está registrado. Intenta iniciar sesión.' }, { status: 409 })
    }

    // -------- Crear usuario en Auth --------
    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {
        nombre_completo,
        universidad,
        referido,
        role,
        created_at: new Date().toISOString(),
      },
    })

    if (createError || !createdUser?.user) {
      console.error('createUser error:', createError?.name, createError?.message, createError)
      const msg = (createError?.message || '').toLowerCase()

      if (msg.includes('already') || msg.includes('registered') || msg.includes('exists')) {
        return NextResponse.json({ error: 'Este correo ya está registrado. Intenta iniciar sesión.' }, { status: 409 })
      }
      if (msg.includes('password')) {
        return NextResponse.json({ error: 'La contraseña no cumple la política mínima.' }, { status: 400 })
      }
      if (msg.includes('rate') || msg.includes('limit')) {
        return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta en un momento.' }, { status: 429 })
      }
      if (msg.includes('domain') || msg.includes('email not allowed')) {
        return NextResponse.json({ error: 'Dominio de correo no permitido en la configuración de Auth.' }, { status: 400 })
      }

      return NextResponse.json({ error: createError?.message || 'No se pudo crear el usuario.' }, { status: 500 })
    }

    const userId = createdUser.user.id

    // -------- Crear/actualizar perfil público --------
    const username = genUsername(nombre_completo, userId)
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: userId,
      email,
      username,
      nombre_completo,
      universidad,
      referido,
      role,
      points: 0,
      subscription_active: false,
      onboarding_complete: false,
      created_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error('profile upsert error:', profileError)
      try {
        await supabaseAdmin.auth.admin.deleteUser(userId)
      } catch {}
      return NextResponse.json({ error: 'Error guardando perfil: ' + profileError.message }, { status: 500 })
    }

    // -------- Magic link --------
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: `${appUrl}/verificado` },
    })

    if (linkError || !linkData?.properties?.action_link) {
      console.error('generateLink error:', linkError)
      return NextResponse.json({ error: linkError?.message || 'No se pudo generar el enlace de acceso.' }, { status: 500 })
    }

    let rawLink = linkData.properties.action_link as string

    if (rawLink.includes('#')) {
      const [, hash] = rawLink.split('#')
      const params = new URLSearchParams(hash)
      const fixed = new URL(`${appUrl}/verificado`)
      for (const [k, v] of params.entries()) fixed.searchParams.set(k, v)
      rawLink = fixed.toString()
    }

    await sendConfirmationEmail(email, rawLink)

    return NextResponse.json({ message: 'Cuenta creada. Revisa tu correo para continuar.' }, { status: 200 })
  } catch (err: any) {
    console.error('[send-confirmation] ❌ Error inesperado:', err)
    return NextResponse.json(
      { error: err?.message || 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
