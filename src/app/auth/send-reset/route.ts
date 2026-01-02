// src/app/auth/send-reset/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getResend } from '@/lib/resend'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'El correo es obligatorio.' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studydocu.ec'

    // ✅ CLAVE: pasar por callback y forzar cambiar-clave
    const redirectTo = `${baseUrl}/auth/callback?type=recovery&next=/auth/cambiar-clave`

    // 1) Solicitar a Supabase el correo con token de recuperación
    const { error } = await supabase.auth.resetPasswordForEmail(
      String(email).trim().toLowerCase(),
      { redirectTo }
    )

    if (error) {
      console.error('[SUPABASE_RESET_ERROR]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 2) Correo estético opcional (no sustituye al correo de Supabase)
    try {
      const resend = getResend()

      const htmlTemplate = `
        <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background: #f9fafb; border-radius: 16px;">
          <div style="padding: 32px; text-align: center; background: white; border-radius: 16px;">
            <img src="https://studydocu.ec/logo-mail.png" width="60" height="60" />
            <h2 style="font-size: 24px; font-weight: bold; margin: 16px 0;">Recupera tu contraseña 🔐</h2>
            <p style="color: #555;">
              Has solicitado cambiar tu contraseña. Revisa tu correo, Supabase te enviará un enlace seguro.
            </p>

            <p style="font-size: 14px; margin-top: 24px; color: #777;">
              Si no solicitaste este cambio, puedes ignorar este mensaje.
            </p>
          </div>
          <div style="text-align: center; color: #aaa; font-size: 12px; padding: 16px;">
            © ${new Date().getFullYear()} StudyDocu
          </div>
        </div>
      `

      await resend.emails.send({
        from: 'StudyDocu <no-responder@studydocu.ec>',
        to: String(email).trim().toLowerCase(),
        subject: 'Recuperación de contraseña solicitada',
        html: htmlTemplate,
      })
    } catch (e) {
      console.warn('[SEND_RESET] Resend no configurado o falló. Se omite correo estético.', e)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[SEND_RESET_ERROR]', err)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
