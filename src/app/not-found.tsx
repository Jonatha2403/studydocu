'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import ghostAnimation from '@/assets/animations/ghost-404.json'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <Lottie animationData={ghostAnimation} loop={true} style={{ width: 200, height: 200 }} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Página no encontrada
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Lo sentimos, la página que buscas no existe o fue movida.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold shadow-md hover:scale-105 transition-transform"
        >
          Volver al inicio
        </Link>
      </motion.div>
    </main>
  )
}
