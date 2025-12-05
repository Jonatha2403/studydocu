// components/Footer.tsx
'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-950 border-t border-border px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} StudyDocu. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/terminos" className="hover:underline">Términos</Link>
            <Link href="/privacidad" className="hover:underline">Privacidad</Link>
            <Link href="/contacto" className="hover:underline">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
