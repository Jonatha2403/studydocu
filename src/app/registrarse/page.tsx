'use client'

import RegisterForm from '@/components/auth/RegisterForm'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import rocketAnim from '@/assets/animations/signup-rocket.json'

export default function RegisterPage() {
  return (
    <>
      

      <motion.main
        initial={{ opacity: 0, backgroundColor: '#ffffff' }}
        animate={{ opacity: 1, backgroundColor: '#dbeafe' }}
        transition={{ duration: 1.5 }}
        className="flex items-center justify-center px-4 pt-2 pb-12 min-h-[calc(100vh-4rem)]" // ← más preciso para móviles
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-6 pt-6 pb-5"
        >
          {/* Animación superior */}
          <div className="flex justify-center mb-2 -mt-2">
            <Lottie animationData={rocketAnim} className="h-24 sm:h-28" loop={false} autoplay />
          </div>

          {/* Encabezado */}
          <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            🚀 Crea tu cuenta
          </h1>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">
            Únete a StudyDocu y empieza a explorar recursos educativos ilimitados.
          </p>

          {/* Formulario */}
          <RegisterForm />
        </motion.div>
      </motion.main>
    </>
  )
}
