// src/app/registrarse/layout.tsx
import type { ReactNode } from 'react'
import '@/app/globals.css'

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-transparent">
      {children}
    </main>
  )
}
