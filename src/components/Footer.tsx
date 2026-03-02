// src/components/Footer.tsx
'use client'

import Link from 'next/link'
import { Mail, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react'

const WHATSAPP_URL =
  'https://wa.me/593958757302?text=Hola%20StudyDocu,%20deseo%20conocer%20m%C3%A1s%20sobre%20la%20plataforma%20y%20sus%20servicios.'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Top */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-slate-900 shadow-[0_10px_26px_-18px_rgba(2,6,23,0.35)]" />
              <div>
                <p className="text-base font-semibold text-slate-900">StudyDocu</p>
                <p className="text-xs text-slate-500">Plataforma académica con IA en Ecuador</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-sm">
              Organiza, estudia y avanza con apoyo académico profesional. Enfoque en rendimiento,
              claridad y estructura (tesis, exámenes, tareas y normas APA).
            </p>

            {/* Mini contact (pro + liviano) */}
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                WhatsApp
              </a>

              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                <Mail className="w-4 h-4" />
                Contacto
              </Link>

              <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                <ShieldCheck className="w-4 h-4 text-slate-900" />
                Privacidad
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-8">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {/* Servicios */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Servicios</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      href="/tesis-pregrado"
                      className="text-slate-600 hover:text-slate-900 transition"
                    >
                      Tesis Pregrado
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ayuda-en-tesis-ecuador"
                      className="text-slate-600 hover:text-slate-900 transition"
                    >
                      Ayuda en Tesis Ecuador
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tesis-utpl"
                      className="text-slate-600 hover:text-slate-900 transition"
                    >
                      Tesis UTPL
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servicios"
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition"
                    >
                      Todos los servicios <ArrowRight className="w-4 h-4" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Exámenes */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Exámenes</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      href="/examen-complexivo"
                      className="text-slate-600 hover:text-slate-900 transition"
                    >
                      Examen Complexivo
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/examenes-bimestrales"
                      className="text-slate-600 hover:text-slate-900 transition"
                    >
                      Exámenes Bimestrales
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/examenes-validacion"
                      className="text-slate-600 hover:text-slate-900 transition"
                    >
                      Exámenes de Validación
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tareas-utpl"
                      className="text-slate-600 hover:text-slate-900 transition"
                    >
                      Tareas UTPL
                    </Link>
                  </li>
                </ul>

                <p className="mt-4 text-xs text-slate-500">
                  *Si alguna ruta aún no existe, la creamos después (lista para SEO).
                </p>
              </div>

              {/* Empresa */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Empresa</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      href="/contacto"
                      className="text-slate-600 hover:text-slate-900 transition"
                    >
                      Contacto
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servicios"
                      className="text-slate-600 hover:text-slate-900 transition"
                    >
                      Servicios
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      href="/terminos"
                      className="text-slate-600 hover:text-slate-900 transition"
                    >
                      Términos y condiciones
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacidad"
                      className="text-slate-600 hover:text-slate-900 transition"
                    >
                      Política de privacidad
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 text-center sm:text-left">
            &copy; {year} StudyDocu. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/terminos" className="text-slate-500 hover:text-slate-900 transition">
              Términos
            </Link>
            <Link href="/privacidad" className="text-slate-500 hover:text-slate-900 transition">
              Privacidad
            </Link>
            <Link href="/contacto" className="text-slate-500 hover:text-slate-900 transition">
              Contacto
            </Link>
          </div>
        </div>

        {/* Small note */}
        <p className="mt-4 text-xs text-slate-400 text-center">
          Orientación académica independiente. No afiliados a universidades.
        </p>
      </div>
    </footer>
  )
}
