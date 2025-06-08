'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import WhatsappFloat from '@/components/WhatsappFloat'

const servicios = [
  { titulo: 'Realizamos todo tipo de ensayo' },
  { titulo: 'Realizamos Exámenes bimestrales' },
  { titulo: 'Realizamos Exámenes de recuperación' },
  { titulo: 'Realizamos Exámenes complexivo' },
  { titulo: 'Realizamos Exámenes de validación' },
  { titulo: 'programación Python UTPL' },
  { titulo: 'Revisión de Normas APA' },
  { titulo: 'Elaboramos mapas conceptuales' },
  { titulo: 'Aprobamos Plataformas Completas De Todas Las Carreras' },
  { titulo: 'PLATAFORMAS COMPLETAS DE LA CARRERA DE DERECHO 📚' },
  { titulo: '🟡PLATAFORMAS COMPLETAS DE LA CARRERA ADMINISTRACIÓN DE EMPRESA📚' },
  { titulo: '🟢PLATAFORMAS COMPLETAS DE LA CARRERA CONTABILIDAD AUDITORÍA 📚' },
  { titulo: '🟡PLATAFORMA COMPLETA DE LA CARRERA PSICOLOGÍA 📚' },
  { titulo: '📄 Ensayos académicos - Entregas en APA con fuentes confiables.' },
  { titulo: '✍️ Resúmenes - Resúmenes claros y estructurados.' },
  { titulo: '🧪 Exámenes / Quices Online - Asistencia segura en plataformas universitarias.' },
  { titulo: '🧠 Tareas o deberes personalizados - Resolución detallada y explicada.' },
  { titulo: '📊 Presentaciones PowerPoint - Diseño profesional y visual.' },
  { titulo: '🧾 Asesorías por Zoom - Apoyo en tiempo real para entender los temas.' },
]

export default function ServiciosPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <section className="text-center mb-10">
        <div className="inline-flex items-center gap-2 justify-center mb-3">
          <Sparkles className="text-purple-500" size={24} />
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">
            StudyDocu Services
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Servicios Académicos Profesionales
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto">
          Apoyo completo en ensayos, exámenes, plataformas, asesorías y más. Calidad garantizada.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {servicios.map((servicio, index) => (
          <Card
            key={index}
            className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition duration-200 bg-white dark:bg-gray-900"
          >
            <CardContent className="p-5">
              <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed">
                {servicio.titulo}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="mt-14 text-center">
        <Link
          href="https://wa.me/593958757302?text=Hola%20StudyDocu,%20deseo%20contratar%20un%20servicio%20acad%C3%A9mico"
          target="_blank"
        >
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg px-10 py-4 rounded-2xl shadow-xl transition duration-300">
            📲 Solicitar servicio por WhatsApp
          </Button>
        </Link>
      </div>

      <WhatsappFloat />
    </main>
  )
}
