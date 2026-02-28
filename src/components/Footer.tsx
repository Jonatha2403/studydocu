'use client'

import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-white dark:bg-gray-950">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Top grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-amber-500" />
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-white">StudyDocu</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Plataforma académica con IA en Ecuador
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Organiza, estudia y avanza con apoyo académico profesional. Enfoque en rendimiento,
              claridad y estructura (tesis, exámenes, tareas y normas APA).
            </p>
          </div>

          {/* Servicios (SEO: Tesis) */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Servicios Académicos
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/tesis-pregrado"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  Tesis Pregrado
                </Link>
              </li>
              <li>
                <Link
                  href="/ayuda-en-tesis-ecuador"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  Ayuda en Tesis Ecuador
                </Link>
              </li>
              <li>
                <Link
                  href="/tesis-utpl"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  Tesis UTPL
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  Todos los Servicios
                </Link>
              </li>
            </ul>
          </div>

          {/* Exámenes (listo para futuras páginas) */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Exámenes</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/examen-complexivo"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  Examen Complexivo
                </Link>
              </li>
              <li>
                <Link
                  href="/examenes-bimestrales"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  Exámenes Bimestrales
                </Link>
              </li>
              <li>
                <Link
                  href="/examenes-validacion"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  Exámenes de Validación
                </Link>
              </li>
              <li>
                <Link
                  href="/tareas-utpl"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  Tareas UTPL
                </Link>
              </li>
            </ul>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
              *Si alguna ruta aún no existe, la creamos después (ya queda lista para SEO).
            </p>
          </div>

          {/* Empresa / Soporte */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Empresa</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/contacto"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  Servicios
                </Link>
              </li>
            </ul>

            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 mt-8">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/terminos"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
            &copy; {year} StudyDocu. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/terminos"
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
            >
              Términos
            </Link>
            <Link
              href="/privacidad"
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
            >
              Privacidad
            </Link>
            <Link
              href="/contacto"
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
            >
              Contacto
            </Link>
          </div>
        </div>

        {/* Small note */}
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 text-center">
          Orientación académica independiente. No afiliados a universidades.
        </p>
      </div>
    </footer>
  )
}
