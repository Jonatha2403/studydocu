'use client'

import { useEffect, useState } from 'react'
import { DownloadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () =>
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowButton(false)
      }
    }
  }

  if (!showButton) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleInstallClick}
        className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-md rounded-full px-4 py-2 flex items-center gap-2"
      >
        <DownloadCloud className="w-4 h-4" />
        Instalar app
      </Button>
    </div>
  )
}
