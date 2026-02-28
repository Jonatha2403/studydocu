import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Examen Complexivo en Ecuador | Preparación Académica – StudyDocu',
  description:
    'Preparación para examen complexivo en Ecuador. Acompañamiento estratégico, repaso por áreas, simulacros y orientación académica profesional.',
  keywords: [
    'examen complexivo Ecuador',
    'preparación examen complexivo',
    'ayuda examen complexivo',
    'complexivo UTPL',
  ],
  alternates: { canonical: 'https://studydocu.ec/examen-complexivo' },
}

export default function ExamenComplexivoPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold">Examen Complexivo en Ecuador</h1>

        <p className="mt-4 text-lg text-slate-700">
          Te ayudamos a prepararte para tu examen complexivo con estrategia, repaso estructurado y
          acompañamiento académico profesional.
        </p>

        <div className="mt-8 space-y-3">
          <Item text="Simulacros tipo examen" />
          <Item text="Repaso por áreas clave" />
          <Item text="Explicaciones paso a paso" />
          <Item text="Orientación personalizada" />
        </div>

        <div className="mt-10 flex gap-4">
          <Link
            href="/contacto"
            className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-black transition"
          >
            Solicitar apoyo <ArrowRight className="inline h-4 w-4 ml-2" />
          </Link>

          <Link
            href="/servicios"
            className="border border-slate-300 px-6 py-3 rounded-xl hover:bg-slate-50 transition"
          >
            Ver servicios
          </Link>
        </div>

        <p className="mt-10 text-xs text-slate-500">Orientación académica independiente.</p>
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
