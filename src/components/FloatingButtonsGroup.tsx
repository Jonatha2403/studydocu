'use client'

import FloatingButton from '@/components/ui/FloatingButton'
import WhatsappFloat from '@/components/WhatsappFloat'

export default function FloatingButtonsGroup() {
  return (
    <div className="fixed bottom-24 right-4 md:bottom-28 md:right-24 z-50 flex flex-col items-center gap-3">
      <FloatingButton />
      <WhatsappFloat />
    </div>
  )
}
