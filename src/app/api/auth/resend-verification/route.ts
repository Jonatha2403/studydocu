// src/app/api/auth/resend-verification/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { sendVerificationEmail } from '@/utils/sendVerificationEmail'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      )
    }

    // 🔍 Obtener lista de usuarios
    const { data: userList, error: listError } =
      await supabaseAdmin.auth.admin.listUsers()

    if (listError) throw listError

    const user = userList.users.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // 🧠 Ya verificado → no reenviar
    if (user.email_confirmed_at) {
      return NextResponse.json(
        { success: false, message: 'Este correo ya ha sido verificado.' },
        { status: 200 }
      )
    }

    // 🌐 Usa tu dominio real SIEMPRE en producción
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://www.studydocu.ec' // fallback seguro si la variable no existe

    // 🔗 Generar nuevo enlace de verificación
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: 'signup',
        email,
        password: 'temporal1234', // necesario para generateLink con type signup
        options: {
          redirectTo: `${siteUrl}/verificado`,
        },
      })

    if (linkError || !linkData?.properties?.action_link) {
      console.error('❌ Error al generar enlace:', linkError)
      throw new Error('No se pudo generar el enlace de verificación.')
    }

    const actionLink = linkData.properties.action_link

    // 📤 Enviar correo usando Resend
    await sendVerificationEmail(email, actionLink)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Error al reenviar verificación:', error)
    return NextResponse.json(
      { error: 'Error al reenviar verificación' },
      { status: 500 }
    )
  }
}
