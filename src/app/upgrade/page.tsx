// ✅ Archivo: /app/upgrade/page.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Crown, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function UpgradePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <div className="flex justify-center mb-4">
          <Crown className="text-yellow-500 w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Acceso Premium Requerido</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Esta sección es exclusiva para usuarios con membresía activa. ¡Actualiza tu plan para acceder!
        </p>
        <Link href="/premium">
          <Button className="text-base px-6 py-2 rounded-xl">
            Ir a Premium <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
