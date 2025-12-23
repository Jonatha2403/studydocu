// src/app/sobre-mi/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Jonathan Octavio Rosado Lopez – Fundador de StudyDocu',
  description:
    'Perfil de Jonathan Octavio Rosado Lopez, empresario y emprendedor digital, fundador de StudyDocu y creador de proyectos tecnológicos enfocados en educación, análisis de datos e innovación digital.',
  alternates: { canonical: '/sobre-mi' },
}

function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-gray-900/40 md:backdrop-blur-xl shadow-sm px-6 sm:px-8 py-7">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  )
}

export default function SobreMiPage() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jonathan Octavio Rosado Lopez',
    jobTitle: 'Empresario y Emprendedor Digital',
    url: 'https://www.studydocu.ec/sobre-mi',
    worksFor: {
      '@type': 'Organization',
      name: 'StudyDocu',
      url: 'https://www.studydocu.ec',
    },
    knowsAbout: [
      'Educación digital',
      'Plataformas web',
      'Inteligencia artificial',
      'Análisis de datos',
      'Criptomonedas',
      'Blockchain',
      'Producto digital',
      'UX/UI',
    ],
    // Opcional: agrega enlaces cuando los tengas
    // sameAs: ['https://www.linkedin.com/in/tuusuario', 'https://github.com/tuusuario'],
  }

  return (
    <main className="relative w-full max-w-5xl mx-auto px-4 py-14 sm:py-16">
      {/* HERO */}
      <header className="mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-gray-200/70 dark:border-white/10 md:backdrop-blur shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium tracking-[0.16em] uppercase text-gray-700 dark:text-gray-200">
            Fundador · Emprendimiento digital
          </span>
        </div>

        <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.08]">
          Jonathan Octavio Rosado Lopez
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Empresario y emprendedor digital. Fundador y creador de{' '}
          <span className="font-semibold text-gray-900 dark:text-white">StudyDocu</span>{' '}
          y fundador de{' '}
          <span className="font-semibold text-gray-900 dark:text-white">Betting Tips EC</span>.
          Construyo productos tecnológicos con enfoque en educación, datos y activos digitales.
        </p>

        {/* QUICK LINKS */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/que-es-studydocu"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Conocer StudyDocu
          </Link>
          <Link
            href="/explorar"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Explorar documentos
          </Link>
          <Link
            href="/registrarse"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </header>

      {/* CONTENIDO EN CARDS */}
      <div className="grid gap-6">
        <Card title="Sobre mí">
          <p>
            Soy <strong>Jonathan Octavio Rosado Lopez</strong>, empresario y emprendedor digital
            enfocado en crear plataformas tecnológicas orientadas a la educación, el análisis
            de datos y la innovación. Mi trabajo se centra en construir soluciones digitales
            que generen valor real, combinando producto, tecnología y visión estratégica.
          </p>
          <p>
            En <strong>StudyDocu</strong> desarrollo una plataforma académica diseñada para ayudar
            a estudiantes universitarios en Ecuador a organizar, compartir y comprender mejor
            apuntes y documentos mediante herramientas digitales e inteligencia artificial aplicada
            de forma responsable.
          </p>
        </Card>

        <Card title="Proyectos">
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 px-5 py-4">
              <p className="font-semibold text-gray-900 dark:text-white">StudyDocu</p>
              <p className="mt-1 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Plataforma académica para subir, encontrar y organizar documentos por universidad,
                carrera y materia, con enfoque en aprendizaje real, comunidad y herramientas inteligentes.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 px-5 py-4">
              <p className="font-semibold text-gray-900 dark:text-white">Betting Tips EC</p>
              <p className="mt-1 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Plataforma de pronósticos deportivos enfocada en análisis estadístico y toma de decisiones
                informadas, integrando modelos analíticos y tecnología aplicada al deporte.
              </p>
            </div>
          </div>
        </Card>

        <Card title="Visión y enfoque profesional">
          <p>
            Mi enfoque profesional se basa en construir productos digitales escalables, con prioridad en
            <strong> experiencia de usuario</strong>, <strong>rendimiento</strong> y <strong>arquitectura limpia</strong>.
            Creo en la tecnología como herramienta para democratizar el conocimiento y generar oportunidades reales.
          </p>
          <p>
            Trabajo bajo principios de <strong>ética digital</strong>, <strong>privacidad</strong> y uso responsable de IA,
            especialmente en proyectos relacionados con educación, información y análisis.
          </p>

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/70 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 px-5 py-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Áreas de enfoque</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Producto digital y UX/UI</li>
                <li>• Plataformas web modernas</li>
                <li>• Datos e IA aplicada</li>
                <li>• Escalabilidad y performance</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-white/70 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 px-5 py-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Principios</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Transparencia y confianza</li>
                <li>• Privacidad y control de datos</li>
                <li>• Calidad por encima de “humo”</li>
                <li>• Construcción a largo plazo</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card title="Inversiones y activos digitales">
          <p>
            Como parte de mi visión empresarial, invierto en activos digitales y tecnologías emergentes.
            Tengo experiencia en el ecosistema de criptomonedas, incluyendo{' '}
            <strong>Bitcoin (BTC)</strong>, <strong>VeChain (VET)</strong>, <strong>Ripple (XRP)</strong> y otros
            proyectos blockchain, siempre bajo un enfoque de análisis, diversificación y gestión responsable del riesgo.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nota: este contenido es informativo y no constituye asesoría financiera.
          </p>
        </Card>

        {/* CTA FINAL */}
        <section className="rounded-3xl border border-gray-200/70 dark:border-white/10 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-6 sm:px-8 py-8 text-white shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold">Construyamos algo de impacto</h2>
          <p className="mt-2 text-white/90 max-w-3xl">
            Si te interesa conocer StudyDocu o explorar documentos académicos organizados por materia,
            puedes empezar ahora mismo.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/explorar"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-gray-900 font-semibold hover:bg-white/90 transition"
            >
              Explorar en StudyDocu
            </Link>
            <Link
              href="/registrarse"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition"
            >
              Crear cuenta
            </Link>
          </div>
        </section>
      </div>

      {/* Schema Person */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </main>
  )
}
