'use client'

import { useEffect, useState } from 'react'

interface Props {
  className?: string
}

export default function AnimatedGradientBackground({ className = '' }: Props) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      const dark = document.documentElement.classList.contains('dark')
      setIsDark(dark)
    }

    // Verifica inicialmente
    checkDark()

    // Observa cambios en <html>
    const observer = new MutationObserver(() => checkDark())
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`fixed inset-0 -z-10 animate-gradient bg-[length:300%_300%] transition-colors duration-1000 ease-in-out
        ${
          isDark
            ? 'bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]' // 🌙 azul profundo - púrpura
            : 'bg-gradient-to-br from-[#f0fdfa] via-[#c7d2fe] to-[#fce7f3]' // ☀️ pastel: aqua suave → lavanda → rosado
        }
        ${className}
      `}
    />
  )
}
