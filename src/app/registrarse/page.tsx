// src/app/registrarse/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full bg-[#070B18]">
      {/* Fondo gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_30%,rgba(59,130,246,0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_20%,rgba(34,211,238,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_50%_90%,rgba(99,102,241,0.18),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-10 lg:py-16">
          {/* LEFT: marketing */}
          <motion.section
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            {/* chip */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
              <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              Únete a más de <b className="text-white">1 millón</b> de estudiantes
            </div>

            <div className="mt-6">
              <div className="text-white/90 text-3xl sm:text-4xl font-semibold tracking-tight">
                Study<span className="text-cyan-400">Docu</span>
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-white">
                Todas las herramientas para <br />
                <span className="text-cyan-300">el éxito académico</span>
              </h1>

              <p className="mt-6 text-white/70 text-lg leading-relaxed max-w-xl">
                Organiza tus documentos, estudia con IA y encuentra recursos por universidad,
                carrera y materia. Todo en un solo lugar.
              </p>

              {/* typed-like line */}
              <div className="mt-8 text-white/80 text-lg">
                Herramientas de IA para estudiantes:{' '}
                <span className="text-cyan-300 font-semibold">y mucho más…</span>
                <span className="ml-1 inline-block w-2 h-5 align-middle bg-cyan-300/80 animate-pulse" />
              </div>

              <p className="mt-16 text-white/50 text-sm">
                “El éxito es la suma de pequeños esfuerzos repetidos día tras día”
              </p>
            </div>
          </motion.section>

          {/* RIGHT: card */}
          <motion.section
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-lg">
              <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_-30px_rgba(0,0,0,0.6)]">
                {/* top glow */}
                <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="relative p-6 sm:p-8">
                  {/* title */}
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white">Crear Cuenta</h2>
                    <p className="mt-2 text-sm text-white/60">
                      Comienza tu viaje hacia el éxito académico
                    </p>
                  </div>

                  {/* FORM */}
                  <div className="mt-6">
                    <RegisterForm />
                  </div>
                </div>
              </div>

              {/* bottom link (extra) */}
              <div className="mt-6 text-center text-sm text-cyan-300">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/iniciar-sesion" className="font-semibold hover:underline">
                  Inicia sesión aquí
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  )
}
