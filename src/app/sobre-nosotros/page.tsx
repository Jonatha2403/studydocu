import type { Metadata } from 'next'
import Link from 'next/link'
import { Target, ShieldCheck, BookOpenCheck, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre nosotros',
  description: 'Conoce la mision, vision y compromiso de StudyDocu.',
  alternates: { canonical: '/sobre-nosotros' },
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-slate-700">{children}</div>
    </article>
  )
}

export default function SobreNosotrosPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          StudyDocu
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sobre nosotros</h1>
        <p className="mt-2 text-sm text-slate-600">
          StudyDocu es una plataforma academica para estudiantes que organiza documentos, facilita
          el aprendizaje y promueve una comunidad responsable de intercambio academico.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card title="Mision">
          <p>
            Ayudar a estudiantes a estudiar con mayor claridad y estructura, centralizando material
            academico y herramientas de apoyo en un solo entorno.
          </p>
        </Card>
        <Card title="Vision">
          <p>
            Construir una biblioteca academica digital confiable para Ecuador, con procesos de
            calidad, seguridad y mejora continua.
          </p>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card title="Principios de operacion">
          <p className="inline-flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-600" /> Utilidad academica real para el usuario.
          </p>
          <p className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Respeto de normas, privacidad y
            seguridad.
          </p>
          <p className="inline-flex items-center gap-2">
            <BookOpenCheck className="h-4 w-4 text-blue-600" /> Calidad y trazabilidad del
            contenido.
          </p>
          <p className="inline-flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-600" /> Comunidad con convivencia y reporte
            responsable.
          </p>
        </Card>

        <Card title="Compromiso con la comunidad">
          <p>
            Fomentamos el uso etico de la plataforma. No promovemos plagio ni usos ilicitos del
            contenido. Los usuarios deben publicar solo material sobre el que tengan derechos o
            permiso de uso.
          </p>
          <p>
            Para mas detalle legal revisa{' '}
            <Link href="/terminos" className="text-blue-700 underline">
              Terminos y condiciones
            </Link>{' '}
            y{' '}
            <Link href="/privacidad" className="text-blue-700 underline">
              Politica de privacidad
            </Link>
            .
          </p>
        </Card>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-2 text-lg font-semibold text-slate-900">Contacto institucional</h3>
        <p className="text-sm text-slate-700">
          Si necesitas informacion comercial, soporte o cumplimiento legal, escribe a{' '}
          <a href="mailto:soporte@studydocu.ec" className="text-blue-700 underline">
            soporte@studydocu.ec
          </a>{' '}
          o visita la pagina de{' '}
          <Link href="/contacto" className="text-blue-700 underline">
            Contacto
          </Link>
          .
        </p>
      </section>
    </main>
  )
}
