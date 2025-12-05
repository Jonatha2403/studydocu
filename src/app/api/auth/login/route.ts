// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { getRouteHandlerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await getRouteHandlerClient() // 👈 ahora con await

  // Intentar parsear el body
  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Body JSON inválido.' },
      { status: 400 }
    )
  }

  const email = (body.email ?? '').trim()
  const password = body.password ?? ''

  if (!email || !password) {
    return NextResponse.json(
      { error: 'El correo y la contraseña son requeridos.' },
      { status: 400 }
    )
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { user: data.user, session: data.session },
      { status: 200 }
    )
  } catch (err) {
    console.error('[LOGIN_ROUTE_ERROR]', err)
    return NextResponse.json(
      { error: 'Ocurrió un error interno del servidor.' },
      { status: 500 }
    )
  }
}
