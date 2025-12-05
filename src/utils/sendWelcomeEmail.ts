import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(to: string, username?: string) {
  if (!to || !to.includes('@')) {
    console.error('❌ Email inválido al intentar enviar correo de bienvenida')
    return
  }

  const name = username || 'Estudiante'

  const htmlContent = `
    <div style="font-family: 'Poppins', sans-serif; background-color: #f9f9fb; padding: 32px;">
      <div style="max-width: 520px; margin: auto; background: #ffffff; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
        <img src="https://studydocu.ec/logo-email.png" alt="StudyDocu" width="48" style="margin-bottom: 20px;" />
        <h2 style="color: #4f46e5; margin-bottom: 12px;">¡Bienvenido a StudyDocu, ${name}!</h2>
        <p style="color: #444; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Has dado el primer paso para transformar tu experiencia académica. 📚<br />
          Explora documentos, gana puntos, desbloquea logros y aprende con inteligencia artificial.
        </p>
        <a href="https://studydocu.ec/dashboard" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right,#50c9ff,#f149ff); color: #fff; border-radius: 12px; font-weight: 600; text-decoration: none;">
          Ir a mi panel
        </a>
        <p style="font-size: 13px; color: #888; margin-top: 30px;">
          Si no fuiste tú, puedes ignorar este mensaje.<br />
          Soporte: <a href="mailto:soporte@studydocu.ec" style="color: #6366f1;">soporte@studydocu.ec</a>
        </p>
      </div>
    </div>
  `

  const textContent = `¡Bienvenido a StudyDocu, ${name}!

Has dado el primer paso para transformar tu experiencia académica. 📚
Explora documentos, gana puntos, desbloquea logros y aprende con IA.

Accede a tu panel: https://studydocu.ec/dashboard

Si no fuiste tú, puedes ignorar este mensaje.
Soporte: soporte@studydocu.ec
`

  try {
    const response = await resend.emails.send({
      from: 'StudyDocu <notificaciones@studydocu.ec>',
      to,
      subject: '🎓 ¡Bienvenido a StudyDocu!',
      html: htmlContent,
      text: textContent, // ✅ Mejora entregabilidad
    })

    if (response.error) {
      console.error('❌ Error al enviar correo de bienvenida:', response.error)
    } else {
      console.log('✅ Correo de bienvenida enviado a:', to)
    }
  } catch (err) {
    console.error('❌ Error inesperado al enviar correo de bienvenida:', err)
  }
}
