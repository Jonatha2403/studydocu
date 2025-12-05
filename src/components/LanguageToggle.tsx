// src/components/LanguageToggle.tsx
'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'
import { Button } from './ui/button'

const LanguageToggle = () => {
  const [lang, setLang] = useState<'es' | 'en'>('es')

  const toggleLang = () => {
    const newLang = lang === 'es' ? 'en' : 'es'
    setLang(newLang)
    localStorage.setItem('lang', newLang)
    // Aquí puedes disparar lógica de internacionalización real si usas i18n
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleLang}
      className="rounded-full border border-gray-300 dark:border-gray-600"
    >
      <Globe size={20} />
      <span className="sr-only">Cambiar idioma</span>
    </Button>
  )
}

export default LanguageToggle
