'use client'

import Link from 'next/link'
import PaymentOptions from '@/components/PaymentOptions'
import Lottie from 'lottie-react'
import paymentAnimation from '@/assets/animations/payment-card.json'

export default function SuscripcionPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-stone-200 dark:from-gray-900 dark:via-slate-800 dark:to-gray-800 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 selection:bg-yellow-400 selection:text-black">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800/80 backdrop-blur-md shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 transform transition-all hover:scale-[1.01] duration-300 border border-gray-200 dark:border-gray-700">
        
        <div className="flex justify-center mb-4">
          <Lottie animationData={paymentAnimation} loop autoplay style={{ width: 180, height: 180 }} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-4 text-gray-900 dark:text-white">
          🎁 Elige tu Método de Pago
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 text-sm sm:text-base">
          Estás a un paso de desbloquear todos nuestros beneficios premium. Completa tu suscripción de forma segura.
        </p>

        {/* Opciones de pago (PayPhone, Binance, WhatsApp, etc.) */}
        <PaymentOptions />

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>🔒 Transacciones 100% seguras y protegidas.</p>
          <p className="mt-1">
            Al continuar, aceptas nuestros{' '}
            <Link
              href="/terminos"
              className="underline hover:text-blue-600 dark:hover:text-yellow-400"
            >
              Términos y Condiciones
            </Link>.
          </p>
        </div>
      </div>

      <footer className="mt-12 text-center">
        <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
          ← Volver al inicio
        </Link>
      </footer>
    </main>
  )
}
