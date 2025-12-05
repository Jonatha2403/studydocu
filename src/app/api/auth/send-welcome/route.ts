import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/utils/sendWelcomeEmail'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Email válido requerido' }, { status: 400 })
    }

    await sendWelcomeEmail(email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Error enviando welcome email:', error)
    return NextResponse.json({ error: 'Error enviando correo' }, { status: 500 })
  }
}
