// ✅ Archivo completo: src/app/api/auth/send-magic-link/route.ts

import { NextResponse } from 'next/server'
import { getResend } from '@/lib/resend'
import { supabase } from '@/lib/supabase'

function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/+$/, '')

  const vercel = process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`

  return 'http://localhost:3000'
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const siteUrl = getSiteUrl()

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/verificado`,
      },
    })

    if (error) {
      console.error('❌ Supabase OTP error:', error)
      return NextResponse.json({ error: 'Error generando enlace mágico' }, { status: 500 })
    }

    const rawLink = (data as any)?.properties?.action_link
    if (!rawLink) {
      return NextResponse.json({ error: 'No se pudo obtener el enlace mágico' }, { status: 500 })
    }

    const magicLink = rawLink.replace('#', '?')

    const resend = getResend()
    await resend.emails.send({
      from: 'StudyDocu <registro@studydocu.ec>',
      to: email,
      subject: 'Verifica tu cuenta en StudyDocu',
      html: `
        <div style="font-family:sans-serif;padding:24px">
          <h2>👋 ¡Bienvenido a StudyDocu!</h2>
          <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
          <p><a href="${magicLink}" style="color:#2563eb;font-weight:bold">${magicLink}</a></p>
          <p>Si no solicitaste este correo, puedes ignorarlo.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('❌ Error general:', err)
    return NextResponse.json(
      { error: 'Error enviando correo mágico (verifica variables de entorno)' },
      { status: 500 }
    )
  }
}
