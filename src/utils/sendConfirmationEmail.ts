// File: src/utils/sendConfirmationEmail.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

/**
 * Envía un correo de confirmación / acceso usando Resend.
 * IMPORTANTE: Este método recibe el LINK COMPLETO (actionLink) generado por Supabase
 * (por ejemplo, el link que viene de auth.admin.generateLink()).
 *
 * @param email - Correo del usuario
 * @param actionLink - Enlace completo generado por Supabase (action_link)
 * @param name - Nombre opcional del usuario
 */
export async function sendConfirmationEmail(email: string, actionLink: string, name?: string) {
  const userName = name?.trim() ? name.trim() : 'Estudiante'

  // Usamos el link tal cual viene (NO reconstruimos /auth/callback)
  const confirmLink = actionLink

  const html = `
    <div style="font-family:'Poppins',system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:32px;background:#f9f9fb;">
      <div style="max-width:520px;margin:auto;background:#ffffff;border-radius:16px;padding:40px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.06)">
        <img src="https://studydocu.ec/logo-email.png" alt="StudyDocu" width="42" style="margin-bottom:16px" />
        
        <h2 style="color:#4f46e5;margin:0 0 12px 0;">Confirma tu cuenta</h2>
        
        <p style="color:#555;font-size:15px;line-height:1.55;margin:0 0 24px 0;">
          ¡Hola ${userName}!<br/>
          Gracias por registrarte en <strong>StudyDocu</strong>.<br/>
          Haz clic en el botón para confirmar tu correo y continuar.
        </p>

        <a href="${confirmLink}"
           style="display:inline-block;margin-top:8px;padding:12px 24px;background:linear-gradient(to right,#6366f1,#8b5cf6);color:#fff;border-radius:12px;text-decoration:none;font-weight:600">
          Confirmar correo
        </a>

        <p style="font-size:13px;color:#999;line-height:1.5;margin-top:28px;">
          Si no solicitaste esta cuenta, puedes ignorar este mensaje.
        </p>

        <p style="font-size:13px;color:#999;margin-top:8px;">
          Soporte: <a href="mailto:soporte@studydocu.ec" style="color:#6366f1;text-decoration:none;">soporte@studydocu.ec</a>
        </p>
      </div>
    </div>
  `

  try {
    const { error } = await resend.emails.send({
      from: 'StudyDocu <notificaciones@studydocu.ec>',
      to: email,
      subject: '✅ Confirma tu cuenta StudyDocu',
      html,
    })

    if (error) {
      console.error('❌ Error al enviar correo de confirmación:', error)
      return { ok: false, error }
    }

    console.log('✅ Correo de confirmación enviado a', email)
    return { ok: true }
  } catch (err) {
    console.error('❌ Error general al enviar correo de confirmación:', err)
    return { ok: false, error: err }
  }
}
