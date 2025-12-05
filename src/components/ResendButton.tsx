// ✅ Archivo: src/components/ResendButton.tsx
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Props {
  email: string
}

export default function ResendButton({ email }: Props) {
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // 🔁 Persistir cooldown tras recargar
  useEffect(() => {
    const storedCooldown = localStorage.getItem('resendCooldown')
    if (storedCooldown) {
      const remaining = parseInt(storedCooldown) - Date.now()
      if (remaining > 0) setCooldown(Math.ceil(remaining / 1000))
    }
  }, [])

  useEffect(() => {
    if (cooldown > 0) {
      const timeout = setInterval(() => {
        setCooldown((prev) => {
          const next = prev - 1
          if (next <= 0) localStorage.removeItem('resendCooldown')
          return next
        })
      }, 1000)
      localStorage.setItem('resendCooldown', `${Date.now() + cooldown * 1000}`)
      return () => clearInterval(timeout)
    }
  }, [cooldown])

  const maskEmail = (email: string) => {
    const [user, domain] = email.split('@')
    const masked = user.length > 1 ? user[0] + '***' + user[user.length - 1] : '***'
    return `${masked}@${domain}`
  }

  const handleResend = async () => {
    if (!navigator.onLine) {
      toast.error('❌ No tienes conexión a internet')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al reenviar correo')

      toast.success('📩 Correo reenviado correctamente')
      setCooldown(60) // 60 segundos
    } catch (error: any) {
      console.error('❌ Error al reenviar correo:', error)
      toast.error(error.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center mt-6">
      <Button onClick={handleResend} disabled={loading || cooldown > 0} variant="outline">
        {loading ? 'Enviando...' : cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Reenviar correo'}
      </Button>
      <p className="text-sm text-muted-foreground mt-2">
        Correo de verificación a <strong>{maskEmail(email)}</strong>
      </p>
    </div>
  )
}
