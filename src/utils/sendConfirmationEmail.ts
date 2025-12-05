// File: src/utils/sendConfirmationEmail.ts
import { Resend } from 'resend'

// ✅ Verificación de API key
const resendApiKey = process.env.RESEND_API_KEY
if (!resendApiKey) {
  throw new Error('❌ Falta la variable de entorno RESEND_API_KEY')
}

// ✅ Inicializa cliente Resend
const resend = new Resend(resendApiKey)

/**
 * Envía un correo de confirmación de cuenta usando Resend.
 * @param email - Correo del usuario.
 * @param actionLink - Enlace generado por Supabase (con access_token corregido).
 */
export async function sendConfirmationEmail(email: string, actionLink: string): Promise<void> {
  const htmlContent = `
    <div style="font-family: 'Poppins', sans-serif; background: #f9f9fb; padding: 40px; border-radius: 16px; max-width: 520px; margin: auto;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://studydocu.ec/logo-email.png" alt="StudyDocu" width="60" style="margin-bottom: 12px;" />
        <h1 style="margin: 0; font-size: 24px; color: #4f46e5;">¡Bienvenido a StudyDocu!</h1>
      </div>
      <p style="color: #333; font-size: 16px; text-align: center; line-height: 1.5;">
        Gracias por registrarte en <strong>StudyDocu</strong> 🎓<br />
        Para activar tu cuenta y comenzar a disfrutar de la plataforma, haz clic en el botón de abajo:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${actionLink}" target="_blank" style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #50c9ff, #f149ff); color: #fff; text-decoration: none; font-weight: 600; border-radius: 12px; font-size: 16px;">
          Confirmar cuenta
        </a>
      </div>
      <p style="font-size: 14px; color: #888; text-align: center;">
        Si no solicitaste este correo, puedes ignorar este mensaje.
      </p>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: 'StudyDocu <noreply@studydocu.ec>',
      to: [email],
      subject: 'Confirma tu cuenta en StudyDocu',
      html: htmlContent,
    })

    console.log('[✅ Correo enviado con Resend]', result)
  } catch (error: any) {
    console.error('[❌ Error al enviar correo con Resend]', error)
    throw new Error('No se pudo enviar el correo de confirmación.')
  }
}
