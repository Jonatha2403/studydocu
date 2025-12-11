'use client'

import { usePathname } from 'next/navigation'
import FloatingButton from '@/components/ui/FloatingButton'
import WhatsappFloat from '@/components/WhatsappFloat'

export default function FloatingButtonsGroup() {
  const pathname = usePathname()

  // 🙈 En /servicios ocultamos el WhatsApp flotante
  const isServiciosPage = pathname === '/servicios'

  return (
    <div className="fixed bottom-24 right-4 md:bottom-28 md:right-24 z-50 flex flex-col items-center gap-3">
      <FloatingButton />

      {/* Solo mostramos el botón flotante de WhatsApp
          si NO estamos en la página /servicios */}
      {!isServiciosPage && <WhatsappFloat />}
    </div>
  )
}
