import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  // ✅ CREAR EL CLIENTE DE SUPABASE CORRECTAMENTE
  const supabase = await createClient()

  const { email } = await req.json()

  if (!email) {
    return NextResponse.json(
      { error: 'El correo es obligatorio.' },
      { status: 400 }
    )
  }

  try {
    // Solicitar el envío del enlace de recuperación con redirección personalizada
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/cambiar-clave`
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Enviar correo visual con Resend (branding StudyDocu)
    const htmlTemplate = `
      <div style="max-width: 600px; margin: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; background: #f9fafb; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        <div style="padding: 32px; text-align: center; background: white;">
          <img src="https://studydocu.ec/logo-mail.png" alt="StudyDocu Logo" width="60" height="60" style="margin-bottom: 16px;" />
          <h2 style="margin-bottom: 8px; font-size: 24px; font-weight: 700;">Recupera tu contraseña 🔐</h2>
          <p style="font-size: 16px; color: #4b5563;">Has solicitado cambiar tu contraseña. Haz clic en el botón de abajo para continuar.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/cambiar-clave" target="_blank"
            style="display: inline-block; margin-top: 24px; padding: 14px 24px; background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 600;">
            Cambiar contraseña
          </a>
          <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">
            Si no solicitaste este cambio, puedes ignorar este mensaje.
          </p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #9ca3af; padding: 16px;">
          © ${new Date().getFullYear()} StudyDocu · Todos los derechos reservados
        </div>
      </div>
    `

    await resend.emails.send({
      from: 'StudyDocu <no-responder@studydocu.ec>',
      to: email,
      subject: 'Recupera tu contraseña',
      html: htmlTemplate
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[SEND_RESET_ERROR]', err)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
