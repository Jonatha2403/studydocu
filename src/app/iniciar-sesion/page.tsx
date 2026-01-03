// src/app/iniciar-sesion/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#F6F5FF] dark:bg-[#070B18]">
      {/* Fondo claro pro (igual que registrarse) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 dark:hidden bg-[radial-gradient(1200px_700px_at_20%_18%,rgba(124,58,237,0.18),transparent_55%)]" />
        <div className="absolute inset-0 dark:hidden bg-[radial-gradient(1000px_650px_at_80%_25%,rgba(34,211,238,0.18),transparent_55%)]" />
        <div className="absolute inset-0 dark:hidden bg-[radial-gradient(900px_650px_at_50%_85%,rgba(59,130,246,0.10),transparent_60%)]" />

        <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(1200px_700px_at_20%_18%,rgba(124,58,237,0.18),transparent_55%)]" />
        <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(1000px_650px_at_80%_25%,rgba(34,211,238,0.16),transparent_55%)]" />
        <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(900px_650px_at_50%_88%,rgba(59,130,246,0.08),transparent_60%)]" />

        <div className="absolute inset-0 opacity-70 dark:opacity-40 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),transparent_30%,transparent_70%,rgba(255,255,255,0.35))] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent_25%,transparent_70%,rgba(255,255,255,0.02))]" />
      </div>

      {/* ✅ Espacio para header fijo + bottom nav fijo */}
      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-[92px] pb-[120px] md:pt-[110px] md:pb-[90px]"
        style={{ paddingBottom: 'calc(120px + env(safe-area-inset-bottom))' }}
      >
        <div className="min-h-[calc(100vh-92px)] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <motion.section
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/60 px-4 py-2 text-sm text-gray-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-white/80">
              <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              Continúa en <b className="text-gray-900 dark:text-white">StudyDocu</b>
            </div>

            <div className="mt-6">
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white/90">
                Study<span className="text-cyan-500 dark:text-cyan-300">Docu</span>
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Vuelve a tu <br />
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  espacio de estudio
                </span>
              </h1>

              <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-xl dark:text-white/70">
                Accede para organizar tus documentos, explorar recursos y estudiar más rápido con
                IA.
              </p>

              <p className="mt-14 text-gray-500 text-sm max-w-xl italic dark:text-white/50">
                “Tu progreso se nota cuando vuelves a intentarlo.”
              </p>
            </div>
          </motion.section>

          {/* RIGHT */}
          <motion.section
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-lg">
              <div className="relative rounded-3xl border border-black/5 bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_-25px_rgba(17,24,39,0.35)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_80px_-30px_rgba(0,0,0,0.60)]">
                <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-400/12" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-400/10" />

                <div className="relative p-6 sm:p-8">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                      Iniciar sesión
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-white/60">
                      Accede para continuar con tu cuenta
                    </p>
                  </div>

                  <div className="mt-6">
                    <LoginForm />
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-indigo-600 dark:text-cyan-300">
                ¿No tienes cuenta?{' '}
                <Link href="/registrarse" className="font-semibold hover:underline">
                  Regístrate aquí
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  )
}
