// ✅ Archivo: /app/upgrade/success/page.tsx
'use client'

import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function UpgradeSuccessPage() {
  const { width, height } = useWindowSize()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 px-6">
      <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
      >
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-14 h-14" />
        </div>
        <h1 className="text-3xl font-bold mb-2">¡Actualización Exitosa!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tu cuenta ahora tiene acceso completo a los beneficios Premium. 🎉
        </p>
        <Link href="/dashboard">
          <Button className="text-base px-6 py-2 rounded-xl">
            Ir al Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
