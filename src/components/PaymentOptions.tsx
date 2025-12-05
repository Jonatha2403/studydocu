'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useUserContext } from '@/context/UserContext'
import {
  MessageCircle,
  CreditCard,
  Bitcoin,
  DollarSign,
  ExternalLink,
} from 'lucide-react'

interface PaymentOption {
  name: string
  description?: string
  icon: React.ElementType
  iconColor: string
  href: string
  actionText: string
  isExternal: boolean
  simulateSuccess?: boolean
}

export default function PaymentOptions() {
  const router = useRouter()
  const { user } = useUserContext()


  // 🧾 Registro de pago en Supabase
  const registrarPago = async ({
    userId,
    method,
    amount = 0,
    status = 'completed',
    metadata = {},
  }: {
    userId: string
    method: string
    amount?: number
    status?: string
    metadata?: object
  }) => {
    const { error } = await supabase.from('payments').insert([
      {
        user_id: userId,
        method,
        amount,
        currency: 'USD',
        status,
        metadata,
      },
    ])
    if (error) {
      console.error('❌ Error al registrar el pago:', error.message)
      toast.error('Error al registrar el pago')
    } else {
      toast.success('🧾 Pago registrado con éxito')
    }
  }

  // 🌟 Activación automática de membresía
  const activarMembresia = async (userId: string) => {
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1) // 1 mes

    const { error } = await supabase
  .from('user_memberships')
  .upsert({
    user_id: userId,
    plan: 'premium',
    status: 'active',
    starts_at: new Date(),
    expires_at: expiresAt, // ✅ aquí es donde debes corregir
  }, { onConflict: 'user_id' })


    if (error) {
      console.error('❌ Error al activar membresía:', error.message)
      toast.error('Error al activar membresía')
    } else {
      toast.success('🎉 Membresía activada correctamente')
    }
  }

  // ✅ Flujo completo tras pago exitoso
  const handlePaymentSuccess = async () => {
    if (!user?.id) return toast.error('Usuario no autenticado')

    await registrarPago({
      userId: user.id,
      method: 'PayPhone',
      amount: 9.99,
      metadata: { simulacion: true },
    })

    await activarMembresia(user.id)

    toast.success('✅ Pago confirmado. Redirigiendo...')
    setTimeout(() => {
      router.push('/suscripcion/exito')
    }, 1500)
  }

  const paymentOptions: PaymentOption[] = [
    {
      name: 'WhatsApp (Transferencia Bancaria)',
      description: 'Contacta para recibir datos de transferencia.',
      icon: MessageCircle,
      iconColor: 'text-green-500 dark:text-green-400',
      href: 'https://wa.me/593958757302?text=Hola%20StudyDocu,%20quiero%20activar%20mi%20suscripción%20mediante%20transferencia%20bancaria.',
      actionText: 'Contactar',
      isExternal: true,
    },
    {
      name: 'PayPal',
      description: 'Paga de forma segura con tu cuenta PayPal.',
      icon: DollarSign,
      iconColor: 'text-blue-600 dark:text-blue-400',
      href: 'https://paypal.me/studydocu',
      actionText: 'Pagar con PayPal',
      isExternal: true,
    },
    {
      name: 'Binance (Criptomonedas)',
      description: 'Contacta para pagar con USDT u otra cripto.',
      icon: Bitcoin,
      iconColor: 'text-yellow-500 dark:text-yellow-400',
      href: 'https://wa.me/593958757302?text=Hola,%20deseo%20pagar%20por%20Binance%20para%20la%20suscripción%20de%20StudyDocu.',
      actionText: 'Solicitar Datos',
      isExternal: true,
    },
    {
      name: 'PayPhone',
      description: 'Paga con tarjeta usando la app PayPhone.',
      icon: CreditCard,
      iconColor: 'text-purple-500 dark:text-purple-400',
      href: '#',
      actionText: 'Simular Pago PayPhone',
      isExternal: false,
      simulateSuccess: true,
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-xl mt-6 max-w-lg mx-auto selection:bg-yellow-400 selection:text-black">
      <div className="flex items-center mb-6">
        <CreditCard className="text-blue-600 dark:text-yellow-400 mr-3" size={28} strokeWidth={2.5} />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Opciones de Suscripción
        </h2>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Elige tu método de pago preferido. Serás redirigido o contactarás con nosotros para completar el proceso.
      </p>

      <ul className="space-y-4">
        {paymentOptions.map((option) => {
          const Icon = option.icon

          const handleClick = (e: React.MouseEvent) => {
            if (option.simulateSuccess) {
              e.preventDefault()
              handlePaymentSuccess()
            }
          }

          return (
            <li
              key={option.name}
              className="bg-gray-50 dark:bg-gray-700/60 p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-grow">
                  <Icon className={`${option.iconColor}`} size={24} strokeWidth={2} />
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-white block">
                      {option.name}
                    </span>
                    {option.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  href={option.href}
                  onClick={handleClick}
                  target={option.isExternal ? '_blank' : '_self'}
                  rel={option.isExternal ? 'noopener noreferrer' : undefined}
                  aria-label={`Ir a ${option.name}`}
                  className="w-full sm:w-auto text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:bg-opacity-90 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-gray-900 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors"
                >
                  {option.actionText}
                  {option.isExternal && <ExternalLink size={14} className="ml-1 opacity-75" />}
                </Link>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-8 text-center">
        ¿Tienes dudas?{' '}
        <a
          href="https://wa.me/593958757302?text=Hola%20StudyDocu,%20tengo%20una%20pregunta%20sobre%20el%20pago."
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-yellow-400"
        >
          Contáctanos por WhatsApp
        </a>
        .
      </p>
    </div>
  )
}
