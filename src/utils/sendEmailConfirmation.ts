// src/utils/sendEmailConfirmation.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmailConfirmation(
  email: string,
  token: string,
  name?: string
) {
  // ✅ Usar el callback de Supabase, no /confirmar directo
  // type=signup para que tu /auth/callback lo trate como alta/confirmación
  // next=%2Fverificado → luego de crear sesión, va a /verificado
  const confirmLink = `https://studydocu.ec/auth/callback?type=signup&code=${token}&next=%2Fverificado`
  const userName = name || 'Estudiante'

  const html = `
    <div style="font-family:'Poppins',sans-serif;padding:32px;background:#f9f9fb;">
      <div style="max-width:520px;margin:auto;background:white;border-radius:16px;padding:40px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.06)">
        <img src="https://studydocu.ec/logo-email.png" alt="StudyDocu" width="42" style="margin-bottom:16px" />
        <h2 style="color:#4f46e5;margin-bottom:12px;">Confirma tu cuenta</h2>
        <p style="color:#555;font-size:15px;margin-bottom:24px;">
          ¡Hola ${userName}!<br/>
          Gracias por registrarte en <strong>StudyDocu</strong>.<br/>
          Haz clic en el botón para verificar tu correo electrónico.
        </p>
        <a href="${confirmLink}" style="display:inline-block;margin-top:12px;padding:12px 24px;background:linear-gradient(to right,#6366f1,#8b5cf6);color:white;border-radius:12px;text-decoration:none;font-weight:500">
          Confirmar correo
        </a>
        <p style="font-size:13px;color:#999;margin-top:32px;">
          Si no solicitaste esta cuenta, puedes ignorar este mensaje.<br/>
          Soporte: <a href="mailto:soporte@studydocu.ec" style="color:#6366f1;">soporte@studydocu.ec</a>
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
    } else {
      console.log('✅ Correo de confirmación enviado a', email)
    }
  } catch (err) {
    console.error('❌ Error general:', err)
  }
}
