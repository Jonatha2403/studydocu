'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

export default function Toast({ message, type = 'info', duration = 3000 }: ToastProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  const typeClasses: Record<string, string> = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 right-6 z-50 px-4 py-2 rounded shadow-lg ${typeClasses[type]}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
