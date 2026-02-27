// src/app/registrarse/layout.tsx
import type { ReactNode } from 'react'

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return (
    <main
      className={[
        'min-h-screen w-full',
        'bg-transparent',
        // Safe area (iOS)
        'pt-[env(safe-area-inset-top)]',
        'pb-[env(safe-area-inset-bottom)]',
      ].join(' ')}
    >
      {/* Wrapper para consistencia */}
      <div className="w-full min-h-screen">{children}</div>
    </main>
  )
}
