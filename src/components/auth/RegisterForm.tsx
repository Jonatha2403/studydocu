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
  Sparkles,
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
  const handleOAuth = async (provider: 'google') => {
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
      // base
      'w-full px-4 py-3 rounded-xl border text-sm transition',
      // backgrounds
      'bg-white/80 dark:bg-white/5',
      // border
      errors[field] ? 'border-red-500/70' : 'border-gray-200/80 dark:border-white/10',
      // text
      'text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40',
      // focus
      'focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40',
      // hover
      'hover:border-gray-300/80 dark:hover:border-white/20',
    ].join(' ')

  const softCard =
    'rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 ' +
    'shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl'

  return (
    <div className="relative">
      {/* Header PRO */}
      <div className="text-center mb-5">
        <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-white/70">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          <span>Crear tu cuenta en StudyDocu</span>
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-white">Crear cuenta</h2>
        <p className="mt-1 text-sm text-white/60">
          Empieza a estudiar más rápido con IA y organización real.
        </p>
      </div>

      {/* CTA: OAuth + Email (PRO) */}
      <div className={`grid grid-cols-1 gap-3 mb-4 p-3 ${softCard}`}>
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          className={[
            'w-full flex items-center justify-center gap-2 py-3 rounded-xl transition',
            'bg-white text-gray-900 hover:bg-white/90',
            'shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]',
          ].join(' ')}
        >
          <FcGoogle size={20} />
          <span className="text-sm font-semibold">Continuar con Google</span>
        </button>

        <button
          type="button"
          onClick={() => setShowEmailForm((s) => !s)}
          className={[
            'w-full flex items-center justify-center gap-2 py-3 rounded-xl transition',
            'border border-white/10 bg-white/5 hover:bg-white/10',
            'text-white/90',
          ].join(' ')}
        >
          <Mail className="w-5 h-5 text-cyan-300" />
          <span className="text-sm font-semibold">
            {showEmailForm ? 'Ocultar formulario' : 'Registrarse con email'}
          </span>
        </button>
      </div>

      {/* Legal */}
      <p className="text-[12px] text-white/60 leading-snug text-center mb-4 px-1">
        Al registrarte, aceptas los{' '}
        <Link href="/terminos" className="text-cyan-300 hover:underline">
          Términos y Condiciones
        </Link>{' '}
        y la{' '}
        <Link href="/privacidad" className="text-cyan-300 hover:underline">
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
              <div className="flex-1 h-px bg-white/10" />
              <span className="mx-3 text-[11px] text-white/50 tracking-wider">
                REGISTRO CON CORREO
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`space-y-3 p-4 ${softCard}`}
            >
              {/* Nombre */}
              <div>
                <div className="relative">
                  <UserCircle2 className="absolute left-3 top-3.5 w-5 h-5 text-white/45" />
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
                  <ShieldCheck className="absolute left-3 top-3.5 w-5 h-5 text-white/45" />
                  <input
                    className={`${inputClass('username')} pl-10 pr-24`}
                    placeholder="Nombre de usuario (min. 3)"
                    aria-label="Nombre de usuario"
                    autoComplete="username"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: normalizeUsername(e.target.value) })
                    }
                  />
                  <StatusChip status={usernameStatus} />
                </div>
                <div className="mt-1 text-[11px] text-white/50">
                  Se permite <span className="font-medium text-white/70">a–z, 0–9, . _ -</span>
                </div>
                {errors.username && <FieldError>{errors.username}</FieldError>}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-white/45" />
                  <input
                    type="email"
                    className={`${inputClass('email')} pl-10 pr-24`}
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
                  <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-white/45" />
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
                    className="absolute right-3 top-2.5 p-1 rounded-md hover:bg-white/10 transition"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-white/70" />
                    ) : (
                      <Eye className="w-5 h-5 text-white/70" />
                    )}
                  </button>
                </div>

                {/* Barra de fuerza */}
                <div className="mt-2">
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength === 'fuerte'
                          ? 'bg-emerald-400'
                          : passwordStrength === 'media'
                            ? 'bg-yellow-300'
                            : 'bg-rose-400'
                      }`}
                      style={{ width: `${strengthPct}%` }}
                    />
                  </div>

                  <div className="mt-1 text-[11px] text-white/60 flex items-center gap-2">
                    Fortaleza: <b className="capitalize text-white/80">{passwordStrength}</b>
                    {capsLockOn && (
                      <span className="inline-flex items-center gap-1 text-rose-300">
                        <CircleSlash className="w-3.5 h-3.5" /> Mayúsculas activadas
                      </span>
                    )}
                  </div>

                  <ul className="mt-1 text-[11px] text-white/60 grid grid-cols-2 gap-x-3">
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
                  <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-white/45" />
                  <select
                    className={`${inputClass('universidad')} pl-10`}
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

              {/* Checkboxes PRO */}
              <div className="flex flex-col gap-2 pt-1">
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-white/10 text-cyan-400 focus:ring-cyan-400/40"
                    checked={form.recordar}
                    onChange={(e) => setForm({ ...form, recordar: e.target.checked })}
                  />
                  Recordar correo
                </label>

                <label className="flex items-start gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/10 text-cyan-400 focus:ring-cyan-400/40"
                    checked={form.terms}
                    onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                  />
                  <span>
                    Acepto los{' '}
                    <Link href="/terminos" className="text-cyan-300 hover:underline">
                      Términos y Privacidad
                    </Link>
                  </span>
                </label>

                {errors.terms && <FieldError>{errors.terms}</FieldError>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={[
                  'w-full py-3 rounded-xl font-semibold transition',
                  'text-white',
                  'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500',
                  'hover:shadow-[0_18px_45px_-22px_rgba(56,189,248,0.65)] hover:scale-[1.01]',
                  'disabled:opacity-60 disabled:hover:scale-100',
                ].join(' ')}
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
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

      {/* Link login (solo 1, limpio) */}
      <p className="text-center text-sm text-cyan-300 mt-5">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/iniciar-sesion" className="font-semibold hover:underline">
          Inicia sesión aquí
        </Link>
      </p>

      {/* Success overlay + confetti */}
      <AnimatePresence>
        {showSuccess && (
          <>
            <div className="fixed inset-0 z-40 pointer-events-none">
              {width > 0 && height > 0 && (
                <Confetti width={width} height={height} numberOfPieces={260} recycle={false} />
              )}
            </div>

            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl text-center max-w-sm w-full border border-black/5 dark:border-white/10"
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
              >
                <CheckCircle2 className="mx-auto mb-3 text-emerald-500" size={48} />
                <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
                  ¡Cuenta creada!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Revisa tu correo para confirmar tu cuenta.
                </p>

                <Link
                  href="/"
                  className="mt-4 inline-flex justify-center w-full px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold hover:opacity-95 transition"
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
  return <p className="text-[12px] text-rose-300 mt-1">{children}</p>
}

function StatusChip({ status }: { status: Status }) {
  if (status === 'idle') return null

  const base =
    'absolute right-2 top-2.5 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] border backdrop-blur'
  const styles =
    status === 'available'
      ? 'text-emerald-200 border-emerald-400/20 bg-emerald-500/10'
      : status === 'unavailable'
        ? 'text-rose-200 border-rose-400/20 bg-rose-500/10'
        : 'text-white/70 border-white/15 bg-white/10'

  return (
    <span className={`${base} ${styles}`}>
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
    <span className={`inline-flex items-center gap-1 ${ok ? 'text-emerald-200' : 'text-white/55'}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-300' : 'bg-white/25'}`}
        aria-hidden="true"
      />
      {children}
    </span>
  )
}
