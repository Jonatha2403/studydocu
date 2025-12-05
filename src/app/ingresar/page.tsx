'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function IngresarRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/iniciar-sesion')
  }, [router])

  return null
}
