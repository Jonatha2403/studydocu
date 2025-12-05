import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPremiumConfirmationEmail(email: string, name?: string) {
  const userName = name || 'Estudiante'
  const html = `
    <div style="font-family:'Poppins',sans-serif;padding:32px;background:#f9f9fb;">
      <div style="max-width:520px;margin:auto;background:white;border-radius:16px;padding:40px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.06)">
        <img src="https://studydocu.ec/logo-email.png" alt="StudyDocu" width="42" style="margin-bottom:16px" />
        <h2 style="color:#8B5CF6;margin-bottom:12px;">🌟 ¡Bienvenido a StudyDocu Premium!</h2>
        <p style="color:#555;font-size:15px;margin-bottom:24px;">
          Hola ${userName},<br/>
          Tu cuenta ha sido actualizada exitosamente.<br/>
          Ahora tienes acceso a funciones exclusivas, descargas ilimitadas, IA educativa avanzada y más.
        </p>
        <a href="https://studydocu.ec/dashboard" style="display:inline-block;margin-top:12px;padding:12px 24px;background:linear-gradient(to right,#8B5CF6,#4F46E5);color:white;border-radius:12px;text-decoration:none;font-weight:500">
          Explorar beneficios Premium
        </a>
        <p style="font-size:13px;color:#999;margin-top:32px;">
          Si tienes preguntas, escríbenos a
          <a href="mailto:soporte@studydocu.ec" style="color:#6366f1;">soporte@studydocu.ec</a>
        </p>
      </div>
    </div>
  `

  try {
    const { error } = await resend.emails.send({
      from: 'StudyDocu <notificaciones@studydocu.ec>',
      to: email,
      subject: '🌟 ¡Tu cuenta Premium está activada!',
      html,
    })

    if (error) {
      console.error('❌ Error al enviar correo Premium:', error)
    } else {
      console.log('✅ Correo Premium enviado a', email)
    }
  } catch (err) {
    console.error('❌ Error general:', err)
  }
}
