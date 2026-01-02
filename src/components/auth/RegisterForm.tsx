// src/components/auth/RegisterForm.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { toast } from 'sonner'

// ✅ cliente supabase (browser)
import { supabase } from '@/lib/supabase/client'

import {
  CheckCircle2,
  CircleSlash,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  UserCircle2,
  Mail,
  GraduationCap,
  KeyRound,
} from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'


/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type Status = 'idle' | 'checking' | 'available' | 'unavailable'
type Strength = 'débil' | 'media' | 'fuerte'

type UniversityRow = {
  id: string
  name: string // si tu columna es "nombre", cambia este type y el select abajo
}

/* -------------------------------------------------------------------------- */
/*                               Register Form UI                             */
/* -------------------------------------------------------------------------- */

export default function RegisterForm() {
  const [form, setForm] = useState({
    nombre_completo: '',
    username: '',
    email: '',
    password: '',
    universidad: '', // ✅ guarda id o "otra"
    universidad_otra: '',
    referido: '',
    role: 'estudiante',
    recordar: false,
    terms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockOn, setCapsLockOn] = useState(false)

  const [usernameStatus, setUsernameStatus] = useState<Status>('idle')
  const [emailStatus, setEmailStatus] = useState<Status>('idle')
  const [passwordStrength, setPasswordStrength] = useState<Strength>('débil')

  const { width, height } = useWindowSize()
  const submitted = useRef(false)

  // ✅ UI PRO: el formulario por email se despliega al hacer clic
  const [showEmailForm, setShowEmailForm] = useState(false)

  // ✅ Universidades desde Supabase
  const [universidades, setUniversidades] = useState<UniversityRow[]>([])
  const [loadingUnis, setLoadingUnis] = useState(false)

  /* ------------------------------ OAuth buttons ------------------------------ */
  const handleOAuth = async (provider: 'google' | 'facebook') => {
    const origin = window.location.origin
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })
    if (error) toast.error(`Error con ${provider}: ${error.message}`)
  }

  /* ----------------------- Cargar universidades (Supabase) ------------------- */
  useEffect(() => {
    let mounted = true

    const loadUniversidades = async () => {
      setLoadingUnis(true)

      // ✅ Si tu columna es "nombre" cambia aquí a: .select('id,nombre').order('nombre', ...)
      const { data, error } = await supabase
        .from('universities')
        .select('id,name')
        .order('name', { ascending: true })

      if (!mounted) return

      if (error) {
        console.error('Error cargando universities:', error)
        toast.error('No se pudieron cargar las universidades')
        setUniversidades([])
      } else {
        setUniversidades((data ?? []) as UniversityRow[])
      }

      setLoadingUnis(false)
    }

    loadUniversidades()
    return () => {
      mounted = false
    }
  }, [])

  /* ------------------------------ Username check ----------------------------- */
  useEffect(() => {
    const username = form.username.trim().toLowerCase()
    if (!username || username.length < 3) {
      setUsernameStatus('idle')
      return
    }
    setUsernameStatus('checking')

    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/user/check-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        })
        const json = await res.json()
        setUsernameStatus(json?.available ? 'available' : 'unavailable')
      } catch {
        setUsernameStatus('idle')
      }
    }, 500)

    return () => clearTimeout(t)
  }, [form.username])

  /* -------------------------------- Email check ------------------------------ */
  useEffect(() => {
    const email = form.email.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailStatus('idle')
      return
    }
    setEmailStatus('checking')

    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/user/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        const json = await res.json()
        setEmailStatus(json?.available ? 'available' : 'unavailable')
      } catch {
        setEmailStatus('idle')
      }
    }, 500)

    return () => clearTimeout(t)
  }, [form.email])

  /* ------------------------------ Recordar correo ---------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem('studydocu:last_email')
    if (saved) setForm((f) => ({ ...f, email: saved }))
  }, [])

  useEffect(() => {
    if (form.recordar) localStorage.setItem('studydocu:last_email', form.email)
  }, [form.recordar, form.email])

  /* ------------------------------ Password meter ----------------------------- */
  useEffect(() => {
    setPasswordStrength(getPasswordStrength(form.password))
  }, [form.password])

  const strengthPct = useMemo(() => {
    if (passwordStrength === 'fuerte') return 100
    if (passwordStrength === 'media') return 60
    return 25
  }, [passwordStrength])

  /* --------------------------------- Helpers -------------------------------- */
  const normalizeUsername = (v: string) =>
    v
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9._-]/g, '')

  const getPasswordStrength = (password: string): Strength => {
    const hasLen = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNum = /[0-9]/.test(password)
    const hasSym = /[^A-Za-z0-9]/.test(password)

    if (hasLen && hasUpper && hasLower && hasNum && hasSym) return 'fuerte'
    if (password.length >= 6 && ((hasUpper && hasNum) || (hasLower && hasNum))) return 'media'
    return 'débil'
  }

  const validate = () => {
    const e: Record<string, string> = {}

    if (!form.nombre_completo.trim()) e.nombre_completo = 'Campo requerido'

    const uname = form.username.trim().toLowerCase()
    if (!uname) e.username = 'Campo requerido'
    else if (uname.length < 3) e.username = 'Mínimo 3 caracteres'
    else if (usernameStatus === 'unavailable') e.username = 'Ya está en uso'

    if (!form.email.trim()) e.email = 'Campo requerido'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Correo inválido'
    else if (emailStatus === 'unavailable') e.email = 'Correo ya registrado'

    if (!form.password) e.password = 'Campo requerido'
    else if (passwordStrength === 'débil') e.password = 'Fortalece tu contraseña'

    if (!form.universidad) e.universidad = 'Campo requerido'
    if (form.universidad === 'otra' && !form.universidad_otra.trim()) {
      e.universidad_otra = 'Escribe el nombre de tu universidad'
    }

    if (!form.role) e.role = 'Campo requerido'
    if (!form.terms) e.terms = 'Debes aceptar los términos'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* --------------------------------- Submit --------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitted.current) return
    if (!validate()) return

    setLoading(true)
    submitted.current = true

    try {
      const email = form.email.trim().toLowerCase()

      // ✅ si elige otra -> texto; si no -> id
      const universidadPayload =
        form.universidad === 'otra' ? form.universidad_otra.trim() : form.universidad

      const res = await fetch('/api/auth/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: form.password,
          nombre_completo: form.nombre_completo.trim(),
          universidad: universidadPayload,
          referido: form.referido?.trim() || null,
          role: form.role,
        }),
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast.error(json?.error || 'Error al registrar')
        return
      }

      setShowSuccess(true)
      toast.success('¡Cuenta creada! Revisa tu correo para confirmar.')
      new Audio('/sounds/success-sound.wav').play().catch(() => {})
    } catch {
      toast.error('Error inesperado. Intenta de nuevo.')
    } finally {
      setLoading(false)
      setTimeout(() => (submitted.current = false), 600)
    }
  }

  /* ---------------------------------- UI fx --------------------------------- */
  const inputClass = (field: string) =>
    [
      'w-full px-4 py-3 rounded-xl border bg-white/70 dark:bg-zinc-900/60 text-sm',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
      errors[field] ? 'border-red-500' : 'border-gray-200 dark:border-zinc-800',
    ].join(' ')

  return (
    <div className="relative">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">Crear cuenta</h2>
        <p className="text-sm text-muted-foreground">Empieza a estudiar más rápido con StudyDocu</p>
      </div>

      {/* CTA: OAuth + Email (PRO) */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          className="flex items-center justify-center gap-2 py-3 border rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
        >
          <FcGoogle size={20} />
          <span className="text-sm font-medium">Continuar con Google</span>
        </button>

        <button
          type="button"
          onClick={() => setShowEmailForm((s) => !s)}
          className="flex items-center justify-center gap-2 py-3 border rounded-xl bg-white/5 hover:bg-white/10 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60 transition"
        >
          <Mail className="w-5 h-5 text-gray-300" />
          <span className="text-sm font-medium">
            {showEmailForm ? 'Ocultar formulario' : 'Registrarse con email'}
          </span>
        </button>
      </div>

      {/* Legal */}
      <p className="text-[12px] text-gray-400 leading-snug text-center mb-3">
        Al registrarte, aceptas los{' '}
        <Link href="/terminos" className="text-cyan-400 hover:underline">
          Términos y Condiciones
        </Link>{' '}
        y la{' '}
        <Link href="/privacidad" className="text-cyan-400 hover:underline">
          Política de Privacidad
        </Link>{' '}
        de StudyDocu.
      </p>

      {/* FORM por email colapsable */}
      <AnimatePresence initial={false}>
        {showEmailForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200/20" />
              <span className="mx-3 text-[11px] text-gray-400 tracking-wider">
                REGISTRO CON CORREO
              </span>
              <div className="flex-1 h-px bg-gray-200/20" />
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-3"
            >
              {/* Nombre */}
              <div>
                <div className="relative">
                  <UserCircle2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    className={`${inputClass('nombre_completo')} pl-10`}
                    placeholder="Nombre completo"
                    aria-label="Nombre completo"
                    autoComplete="name"
                    value={form.nombre_completo}
                    onChange={(e) => setForm({ ...form, nombre_completo: e.target.value })}
                  />
                </div>
                {errors.nombre_completo && <FieldError>{errors.nombre_completo}</FieldError>}
              </div>

              {/* Username */}
              <div>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    className={`${inputClass('username')} pl-10`}
                    placeholder="Nombre de usuario (min. 3, solo letras y números)"
                    aria-label="Nombre de usuario"
                    autoComplete="username"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: normalizeUsername(e.target.value) })
                    }
                  />
                  <StatusChip status={usernameStatus} />
                </div>
                <div className="mt-1 text-[11px] text-gray-500">
                  Se permite <span className="font-medium">a–z, 0–9, . _ -</span>
                </div>
                {errors.username && <FieldError>{errors.username}</FieldError>}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className={`${inputClass('email')} pl-10`}
                    placeholder="Correo electrónico"
                    aria-label="Correo electrónico"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <StatusChip status={emailStatus} />
                </div>
                {errors.email && <FieldError>{errors.email}</FieldError>}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`${inputClass('password')} pl-10 pr-10`}
                    placeholder="Contraseña"
                    aria-label="Contraseña"
                    autoComplete="new-password"
                    value={form.password}
                    onKeyDown={(e) => setCapsLockOn(e.getModifierState?.('CapsLock') ?? false)}
                    onKeyUp={(e) => setCapsLockOn(e.getModifierState?.('CapsLock') ?? false)}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-3 top-2.5 p-1 rounded-md hover:bg-gray-100/10"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Barra de fuerza */}
                <div className="mt-2">
                  <div className="h-2 w-full rounded-full bg-gray-200/20 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength === 'fuerte'
                          ? 'bg-green-500'
                          : passwordStrength === 'media'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${strengthPct}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-gray-500 flex items-center gap-2">
                    Fortaleza: <b className="capitalize">{passwordStrength}</b>
                    {capsLockOn && (
                      <span className="inline-flex items-center gap-1 text-red-500">
                        <CircleSlash className="w-3.5 h-3.5" /> Mayúsculas activadas
                      </span>
                    )}
                  </div>
                  <ul className="mt-1 text-[11px] text-gray-500 grid grid-cols-2 gap-x-3">
                    <Req ok={form.password.length >= 8}>Mínimo 8 caracteres</Req>
                    <Req ok={/[0-9]/.test(form.password)}>Al menos un número</Req>
                    <Req ok={/[A-Z]/.test(form.password)}>Una mayúscula</Req>
                    <Req ok={/[^A-Za-z0-9]/.test(form.password)}>Un símbolo</Req>
                  </ul>
                </div>

                {errors.password && <FieldError>{errors.password}</FieldError>}
              </div>

              {/* Universidad */}
              <div>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <select
                    className={`${inputClass('universidad')} pl-10 text-gray-700 dark:text-gray-300`}
                    value={form.universidad}
                    onChange={(e) => {
                      const v = e.target.value
                      setForm((f) => ({
                        ...f,
                        universidad: v,
                        universidad_otra: v === 'otra' ? f.universidad_otra : '',
                      }))
                    }}
                  >
                    <option value="">
                      {loadingUnis ? 'Cargando universidades…' : 'Selecciona tu universidad'}
                    </option>

                    {!loadingUnis &&
                      universidades.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}

                    <option value="otra">Otra</option>
                  </select>
                </div>

                {form.universidad === 'otra' && (
                  <div className="mt-2">
                    <input
                      className={inputClass('universidad_otra')}
                      placeholder="Escribe tu universidad"
                      value={form.universidad_otra}
                      onChange={(e) => setForm({ ...form, universidad_otra: e.target.value })}
                    />
                    {errors.universidad_otra && <FieldError>{errors.universidad_otra}</FieldError>}
                  </div>
                )}

                {errors.universidad && <FieldError>{errors.universidad}</FieldError>}
              </div>

              {/* Rol */}
              <div>
                <select
                  className={inputClass('role')}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                </select>
                {errors.role && <FieldError>{errors.role}</FieldError>}
              </div>

              {/* Referido */}
              <input
                className={inputClass('referido')}
                placeholder="Código de referido (opcional)"
                value={form.referido}
                onChange={(e) => setForm({ ...form, referido: e.target.value })}
              />

              {/* Checkboxes */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={form.recordar}
                    onChange={(e) => setForm({ ...form, recordar: e.target.checked })}
                  />
                  Recordar correo
                </label>
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={form.terms}
                    onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                  />
                  Acepto los{' '}
                  <Link href="/terminos" className="text-indigo-600 ml-1 hover:underline">
                    Términos y Privacidad
                  </Link>
                </label>
              </div>
              {errors.terms && <FieldError>{errors.terms}</FieldError>}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 text-white text-lg rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-lg hover:scale-[1.01] transition disabled:opacity-60"
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Registrando…
                  </span>
                ) : (
                  'Registrarme'
                )}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Link login */}
      <p className="text-center text-sm text-cyan-400 mt-5">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/iniciar-sesion" className="font-medium hover:underline">
          Inicia sesión aquí
        </Link>
      </p>

      {/* Success overlay + confetti */}
      <AnimatePresence>
        {showSuccess && (
          <>
            <div className="fixed inset-0 z-40 pointer-events-none">
              {width > 0 && height > 0 && (
                <Confetti width={width} height={height} numberOfPieces={280} recycle={false} />
              )}
            </div>

            <motion.div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl text-center max-w-sm border"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <CheckCircle2 className="mx-auto mb-3 text-green-500" size={48} />
                <h3 className="text-xl font-semibold mb-1">¡Cuenta creada!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Revisa tu correo para confirmar tu cuenta.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Volver al inicio
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                               UI subcomponents                              */
/* -------------------------------------------------------------------------- */

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-red-500 mt-1">{children}</p>
}

function StatusChip({ status }: { status: Status }) {
  if (status === 'idle') return null
  return (
    <span
      className={`absolute right-2 top-2.5 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] border ${
        status === 'available'
          ? 'text-emerald-700 border-emerald-200 bg-emerald-50'
          : status === 'unavailable'
            ? 'text-red-700 border-red-200 bg-red-50'
            : 'text-gray-600 border-gray-200 bg-gray-50'
      }`}
    >
      {status === 'checking' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {status === 'available' && <CheckCircle2 className="w-3.5 h-3.5" />}
      {status === 'unavailable' && <CircleSlash className="w-3.5 h-3.5" />}
      <span>
        {status === 'checking' ? 'Comprobando…' : status === 'available' ? 'Disponible' : 'En uso'}
      </span>
    </span>
  )
}

function Req({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 ${ok ? 'text-emerald-600' : 'text-gray-500'}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-gray-300'}`}
        aria-hidden="true"
      />
      {children}
    </span>
  )
}
