import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Exámenes de Validación en Ecuador | Preparación Universitaria – StudyDocu',
  description:
    'Preparación para exámenes de validación universitaria en Ecuador. Acompañamiento académico estratégico, repaso estructurado y orientación personalizada.',
  keywords: [
    'examenes de validacion Ecuador',
    'examen de validacion universitario',
    'validacion UTPL',
    'examen validacion universidad Ecuador',
    'preparacion examen validacion',
  ],
  alternates: {
    canonical: 'https://studydocu.ec/examenes-validacion',
  },
  openGraph: {
    title: 'Exámenes de Validación en Ecuador | StudyDocu',
    description: 'Preparación estratégica para exámenes de validación universitaria en Ecuador.',
    url: 'https://studydocu.ec/examenes-validacion',
    siteName: 'StudyDocu',
    locale: 'es_EC',
    type: 'website',
  },
}

export default function ExamenesValidacionPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold">Exámenes de Validación en Ecuador</h1>

        <p className="mt-4 text-lg text-slate-700">
          Te ayudamos a prepararte para tu examen de validación universitaria con metodología
          estratégica, repaso por áreas y acompañamiento académico profesional.
        </p>

        <div className="mt-8 space-y-3">
          <Item text="Preparación por competencias y materias" />
          <Item text="Simulacros tipo examen real" />
          <Item text="Resolución explicada paso a paso" />
          <Item text="Orientación académica personalizada" />
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/contacto"
            className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-black transition"
          >
            Solicitar preparación <ArrowRight className="inline h-4 w-4 ml-2" />
          </Link>

          <Link
            href="/servicios"
            className="border border-slate-300 px-6 py-3 rounded-xl hover:bg-slate-50 transition"
          >
            Ver todos los servicios
          </Link>
        </div>

        {/* SEO contenido extendido */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold">¿Qué es un examen de validación?</h2>

          <p className="mt-4 text-slate-700 leading-relaxed">
            El examen de validación es una evaluación académica que permite comprobar conocimientos
            previos o aprobar asignaturas pendientes. En Ecuador, este tipo de evaluación es
            utilizado por varias universidades para procesos de homologación o regularización
            académica.
          </p>

          <h3 className="text-xl font-semibold mt-8">¿Cómo prepararte correctamente?</h3>

          <p className="mt-3 text-slate-700 leading-relaxed">
            La clave está en estudiar por áreas temáticas, practicar con preguntas tipo examen y
            reforzar conceptos críticos. Una estrategia estructurada mejora significativamente la
            probabilidad de aprobación.
          </p>
        </div>

        <p className="mt-12 text-xs text-slate-500">
          Orientación académica independiente. No afiliados a universidades.
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
