// ✅ Archivo: src/utils/sendVerificationEmail.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(to: string, link: string) {
  const htmlContent = `
    <div style="font-family:'Poppins',sans-serif;padding:32px;background:#f9f9fb;">
      <div style="max-width:520px;margin:auto;background:white;border-radius:16px;padding:40px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.06)">
        <img src="https://studydocu.ec/logo-email.png" alt="StudyDocu" width="42" style="margin-bottom:16px" />
        <h2 style="color:#4f46e5;margin-bottom:8px;">Confirma tu correo electrónico</h2>
        <p style="color:#555;font-size:15px;margin-bottom:24px;">
          Estás a un paso de activar tu cuenta en <strong>StudyDocu</strong>.<br />
          Haz clic en el botón para verificar tu correo y comenzar a explorar.
        </p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:linear-gradient(to right,#50c9ff,#f149ff);color:white;border-radius:12px;text-decoration:none;font-weight:500;font-size:16px;">
          ✅ Verificar mi correo
        </a>
        <p style="font-size:13px;color:#999;margin-top:32px;">
          Si no fuiste tú, puedes ignorar este mensaje.<br/>
          Soporte: <a href="mailto:soporte@studydocu.ec" style="color:#6366f1;">soporte@studydocu.ec</a>
        </p>
      </div>
    </div>
  `

  const textContent = `Confirma tu correo electrónico para activar tu cuenta en StudyDocu.\n\nHaz clic aquí para verificar tu correo: ${link}\n\nSi no fuiste tú, puedes ignorar este mensaje.\n\nSoporte: soporte@studydocu.ec`

  try {
    const result = await resend.emails.send({
      from: 'StudyDocu <notificaciones@studydocu.ec>',
      to,
      subject: '🔐 Verifica tu cuenta en StudyDocu',
      html: htmlContent,
      text: textContent, // Fallback de texto plano
    })

    if (result.error) {
      console.error('❌ Error al enviar correo de verificación:', result.error)
    } else {
      console.log('✅ Correo de verificación enviado a', to)
    }
  } catch (err) {
    console.error('❌ Error inesperado al enviar correo:', err)
  }
}
