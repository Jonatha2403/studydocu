'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollProgress() {
  const [scroll, setScroll] = useState(0)
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight

      const scrollProgress = (totalScroll / windowHeight) * 100
      setScroll(scrollProgress)

      // Mostrar solo si hay algo de scroll
      setVisible(scrollProgress > 1)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Colores personalizados por ruta (opcional)
  const getColor = () => {
    if (pathname?.startsWith('/dashboard')) return 'bg-green-500 dark:bg-green-400'
    if (pathname?.startsWith('/admin')) return 'bg-red-500 dark:bg-red-400'
    return 'bg-indigo-500 dark:bg-yellow-400'
  }

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[60] bg-transparent">
      <div
        className={`h-full transition-all duration-200 ease-out ${getColor()}`}
        style={{ width: visible ? `${scroll}%` : '0%' }}
      />
    </div>
  )
}
