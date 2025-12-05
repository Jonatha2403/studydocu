import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY)

function getPremiumHtml(link: string) {
  return `
    <h2>🌟 Bienvenido de nuevo a StudyDocu Premium</h2>
    <p>Haz clic en el botón para acceder a tu cuenta premium.</p>
    <a href="${link}" style="display:inline-block;background:linear-gradient(to right,#50c9ff,#f149ff);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:12px;">Entrar a StudyDocu Pro</a>
    <p style="margin-top:16px;color:#777;font-size:13px;">Este enlace expira en 5 minutos.</p>
  `
}

function getNormalHtml(link: string) {
  return `
    <h2>Bienvenido a StudyDocu</h2>
    <p>Haz clic en el botón para iniciar sesión en tu cuenta.</p>
    <a href="${link}" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:12px;">Entrar ahora</a>
    <p style="margin-top:16px;color:#777;font-size:13px;">Este enlace expira en 5 minutos.</p>
  `
}

export async function POST(req: Request) {
  const { email } = await req.json()

  // 1. Generar Magic Link (sin enviar automáticamente)
  const response = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'https://studydocu.ec/dashboard'
    }
  })

  if (response.error) {
    return NextResponse.json({ error: response.error.message }, { status: 400 })
  }

  // Acceder al enlace de acción manualmente
const rawLink = (response.data as any)?.action_link

if (!rawLink || typeof rawLink !== 'string') {
  return NextResponse.json({ error: 'No se pudo generar el enlace' }, { status: 500 })
}


  if (!rawLink) {
    return NextResponse.json({ error: 'No se pudo generar el enlace' }, { status: 500 })
  }

  // 2. Verificar si el usuario es Premium
  const { data: membership } = await supabase
    .from('user_memberships')
    .select('is_active')
    .eq('email', email)
    .single()

  const isPremium = membership?.is_active === true

  // 3. Agregar parámetros UTM al enlace
  const magicLinkWithUTM = `${rawLink}&utm_source=email&utm_medium=magiclink&utm_campaign=${isPremium ? 'premium-login' : 'login'}`

  // 4. Registrar en audit_logs
  await supabase.from('audit_logs').insert([{
    user_email: email,
    action: `Se generó un Magic Link para ${isPremium ? 'usuario Premium' : 'usuario normal'}`
  }])

  // 5. Enviar el correo con diseño personalizado
  await resend.emails.send({
    from: 'StudyDocu <noreply@studydocu.ec>',
    to: email,
    subject: isPremium
      ? '🔐 Tu acceso Premium a StudyDocu'
      : 'Tu acceso a StudyDocu',
    html: isPremium
      ? getPremiumHtml(magicLinkWithUTM)
      : getNormalHtml(magicLinkWithUTM),
  })

  return NextResponse.json({ success: true })
}
