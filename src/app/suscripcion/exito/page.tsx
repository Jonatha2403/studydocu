'use client'

import Link from 'next/link'
import Lottie from 'lottie-react'
import successAnimation from '@/assets/animations/success.json'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function SuscripcionExitoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <Lottie animationData={successAnimation} loop={false} autoplay style={{ width: 200, height: 200 }} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          ¡Suscripción exitosa!
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Ahora tienes acceso completo a todos los beneficios premium de StudyDocu. 🚀
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-md hover:scale-105 transition-transform"
        >
          <Sparkles size={18} />
          Ir al Panel
        </Link>
      </motion.div>
    </main>
  )
}
