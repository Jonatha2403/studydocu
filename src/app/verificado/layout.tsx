'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function VerificadoLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-[#f9f9fb] to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/70 dark:bg-gray-900/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 text-center"
      >
        {children}
      </motion.div>
    </main>
  )
}
