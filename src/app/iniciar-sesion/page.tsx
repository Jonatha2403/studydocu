// src/app/iniciar-sesion/page.tsx
'use client'

import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-muted">
      <div className="text-center mb-8 max-w-md">
        <div className="text-5xl mb-3">👋</div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Bienvenido de nuevo</h1>
        <p className="text-muted-foreground text-base">
          Inicia sesión para acceder a tu cuenta StudyDocu.
        </p>
      </div>

      <LoginForm />
    </section>
  )
}
