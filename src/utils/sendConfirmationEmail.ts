// File: src/utils/sendPasswordResetEmail.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

/**
 * Envía un correo personalizado de restablecimiento de contraseña
 * usando el flujo CORRECTO de Supabase (PKCE + callback).
 *
 * @param email - Correo del usuario
 * @param token - Token PKCE generado por Supabase
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  // 👇 Enlace CORRECTO: pasa por /auth/callback y luego a /auth/reset-password
  const resetLink = `https://studydocu.ec/auth/callback?type=recovery&code=${token}&next=%2Fauth%2Freset-password`

  const htmlContent = `
    <div style="font-family:'Poppins',sans-serif;padding:32px;background:#f9f9fb;">
      <div style="max-width:520px;margin:auto;background:white;border-radius:16px;padding:40px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.06)">
        <img src="https://studydocu.ec/logo-email.png" alt="StudyDocu" width="42" style="margin-bottom:16px" />
        <h2 style="color:#4f46e5;margin-bottom:8px;">Restablecer contraseña</h2>

        <p style="color:#555;font-size:15px;margin-bottom:24px;">
          Haz clic en el botón de abajo para crear una nueva contraseña.<br />
          Este enlace expira pronto por tu seguridad.
        </p>

        <a href="${resetLink}"
          style="display:inline-block;margin-top:12px;padding:12px 24px;
          background:linear-gradient(to right,#50c9ff,#f149ff);color:white;
          border-radius:12px;text-decoration:none;font-weight:500">
          Restablecer contraseña
        </a>

        <p style="font-size:13px;color:#999;margin-top:32px;">
          Si no solicitaste esto, puedes ignorar este mensaje.<br/>
          Soporte: <a href="mailto:soporte@studydocu.ec" style="color:#6366f1;">soporte@studydocu.ec</a>
        </p>
      </div>
    </div>
  `

  try {
    const { error } = await resend.emails.send({
      from: 'StudyDocu <notificaciones@studydocu.ec>',
      to: email,
      subject: '🔐 Restablece tu contraseña de StudyDocu',
      html: htmlContent,
    })

    if (error) {
      console.error('❌ Error al enviar correo de restablecimiento:', error)
    } else {
      console.log('✅ Correo de restablecimiento enviado a', email)
    }
  } catch (err) {
    console.error('❌ Error general:', err)
  }
}
