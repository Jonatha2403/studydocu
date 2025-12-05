// ✅ src/app/api/auth/resend-verification/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { sendVerificationEmail } from '@/utils/sendVerificationEmail'

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
  }

  try {
    // ✅ Buscar el usuario por email usando listUsers
    const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    if (listError) throw listError

    const user = userList.users.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // 🧠 Si ya está confirmado, no reenviar
    if (user.email_confirmed_at) {
      return NextResponse.json({ success: false, message: 'Este correo ya ha sido verificado.' }, { status: 200 })
    }

    // 🔗 Generar nuevo enlace de verificación (tipo 'signup' requiere dummy password)
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password: 'temporal1234', // requerido para 'signup'
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verificado`,
      },
    })

    if (linkError || !linkData?.properties?.action_link) {
      throw linkError || new Error('No se pudo generar el enlace de verificación.')
    }

    const actionLink = linkData.properties.action_link

    // 📤 Enviar correo con Resend
    await sendVerificationEmail(email, actionLink)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Error al reenviar verificación:', error)
    return NextResponse.json({ error: 'Error al reenviar verificación' }, { status: 500 })
  }
}
