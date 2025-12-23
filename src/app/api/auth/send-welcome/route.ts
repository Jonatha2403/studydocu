// src/utils/sendWelcomeEmail.ts
import { getResend } from '@/lib/resend'

export async function sendWelcomeEmail(email: string) {
  const resend = getResend()

  await resend.emails.send({
    from: 'StudyDocu <registro@studydocu.ec>',
    to: email,
    subject: '¡Bienvenido a StudyDocu!',
    html: `
      <div style="font-family:sans-serif;padding:24px">
        <h2>🎉 ¡Bienvenido a StudyDocu!</h2>
        <p>Tu cuenta fue creada con éxito.</p>
        <p>Ya puedes iniciar sesión y empezar a organizar tus estudios.</p>
      </div>
    `,
  })
}
