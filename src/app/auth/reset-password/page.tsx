'use client'

import PasswordResetForm from '@/components/auth/PasswordResetForm'

export default function ResetPasswordPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-muted">
      <div className="text-center mb-8 max-w-md">
        <div className="text-5xl mb-3">🔒</div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">¿Olvidaste tu contraseña?</h1>
        <p className="text-muted-foreground text-base">
          No te preocupes, te ayudamos a recuperarla fácilmente.
        </p>
      </div>

      <PasswordResetForm />
    </section>
  )
}
