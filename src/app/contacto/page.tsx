import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MessageCircle, Clock3, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Canales oficiales de contacto de StudyDocu.',
  alternates: { canonical: '/contacto' },
}

const WHATSAPP_URL =
  'https://wa.me/593958757302?text=Hola%20StudyDocu,%20deseo%20informacion%20sobre%20la%20plataforma.'

export default function ContactoPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="mb-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          Contacto oficial
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Contacto StudyDocu</h1>
        <p className="mt-2 text-sm text-slate-600">
          Si necesitas ayuda con tu cuenta, documentos, pagos o reportes, estos son nuestros canales
          oficiales.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-slate-900">
            <MessageCircle className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">WhatsApp</h2>
          </div>
          <p className="mb-4 text-sm text-slate-600">Atencion rapida para consultas generales.</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Escribir por WhatsApp
          </a>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-slate-900">
            <Mail className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Correo</h2>
          </div>
          <p className="mb-4 text-sm text-slate-600">Soporte para temas de cuenta y legales.</p>
          <a
            href="mailto:soporte@studydocu.ec"
            className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            soporte@studydocu.ec
          </a>
        </article>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-2 flex items-center gap-2 text-slate-900">
            <Clock3 className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold">Horarios referenciales</h3>
          </div>
          <p className="text-sm text-slate-600">
            Lunes a viernes: 09:00 a 19:00 (GMT-5). Fuera de ese horario, respondemos en cuanto sea
            posible.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-2 flex items-center gap-2 text-slate-900">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold">Reportes y cumplimiento</h3>
          </div>
          <p className="text-sm text-slate-600">
            Para reportes de contenido, revisa tambien{' '}
            <Link href="/terminos" className="text-blue-700 underline">
              Terminos y condiciones
            </Link>{' '}
            y{' '}
            <Link href="/privacidad" className="text-blue-700 underline">
              Politica de privacidad
            </Link>
            .
          </p>
        </article>
      </section>
    </main>
  )
}
