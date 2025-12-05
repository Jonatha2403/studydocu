// src/app/registrarse/layout.tsx
import type { ReactNode } from 'react'
import '@/app/globals.css'

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return (
    <main className="pt-20 min-h-screen bg-white dark:bg-black">
      {children}
    </main>
  )
}
