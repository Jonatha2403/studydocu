import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tareas UTPL | Apoyo Académico – StudyDocu',
  description:
    'Apoyo en tareas UTPL: plataformas, ensayos, trabajos y actividades académicas con orientación profesional.',
  keywords: ['tareas UTPL', 'ayuda tareas UTPL', 'plataforma UTPL'],
  alternates: { canonical: 'https://studydocu.ec/tareas-utpl' },
}

export default function TareasUTPLPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold">Tareas UTPL</h1>

        <p className="mt-4 text-lg text-slate-700">
          Acompañamiento académico para estudiantes de la UTPL: tareas, foros, actividades en
          plataforma y proyectos.
        </p>

        <div className="mt-8 space-y-3">
          <Item text="Plataformas virtuales UTPL" />
          <Item text="Ensayos y trabajos académicos" />
          <Item text="Resolución explicada paso a paso" />
          <Item text="Normas APA y formato correcto" />
        </div>

        <div className="mt-10">
          <Link
            href="/contacto"
            className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-black transition"
          >
            Solicitar apoyo UTPL <ArrowRight className="inline h-4 w-4 ml-2" />
          </Link>
        </div>

        <p className="mt-10 text-xs text-slate-500">
          Orientación académica independiente. No afiliados a la UTPL.
        </p>
      </section>
    </main>
  )
}

function Item({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-700">
      <CheckCircle2 className="h-5 w-5 text-indigo-600" />
      {text}
    </div>
  )
}
