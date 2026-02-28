import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Exámenes Bimestrales en Ecuador | Apoyo Académico – StudyDocu',
  description:
    'Apoyo en exámenes bimestrales y parciales universitarios en Ecuador. Explicaciones claras y acompañamiento académico profesional.',
  alternates: {
    canonical: 'https://studydocu.ec/examenes-bimestrales',
  },
}

export default function ExamenesBimestralesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold">Exámenes Bimestrales y Parciales</h1>

        <p className="mt-4 text-lg text-slate-700">
          Te apoyamos en evaluaciones parciales, quices y recuperaciones con enfoque en comprensión
          y aprobación académica.
        </p>

        <div className="mt-8 space-y-3">
          <Item text="Preparación por materias" />
          <Item text="Explicación paso a paso" />
          <Item text="Simulaciones tipo examen" />
          <Item text="Orientación académica personalizada" />
        </div>

        <div className="mt-10">
          <Link
            href="/contacto"
            className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-black transition"
          >
            Solicitar apoyo <ArrowRight className="inline h-4 w-4 ml-2" />
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
