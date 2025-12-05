'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function LoadingOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-4 text-center text-gray-800 dark:text-gray-200">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Cargando StudyDocu...</p>
      </div>
    </motion.div>
  )
}
