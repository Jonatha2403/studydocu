// src/app/premium/page.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  Crown, Sparkles, ShieldCheck, BadgeCheck, Check, X,
  CreditCard, Banknote, Copy, CheckCircle2, ExternalLink, PhoneCall
} from 'lucide-react'
import { useUserContext } from '@/context/UserContext'
import { supabase } from '@/lib/supabase'

/* ----------------------------- Config & tipos ----------------------------- */
type Cycle = 'monthly' | 'yearly'
type PlanId = 'basic' | 'pro' | 'team'

type Plan = {
  id: PlanId
  name: string
  tagline: string
  highlight?: boolean
  display: Record<Cycle, { price: string; note?: string }>
  features: string[]
}

// UI: precios visibles. El priceId real lo resuelve el servidor.
const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    tagline: 'Para iniciar',
    display: {
      monthly: { price: '$2.99/mes' },
      yearly: { price: '$29.99/año', note: 'Ahorra 17%' },
    },
    features: ['Hasta 50 documentos/mes', 'Estadísticas esenciales', 'Soporte estándar'],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'El favorito',
    highlight: true,
    display: {
      monthly: { price: '$5.99/mes' },
      yearly: { price: '$59.99/año', note: 'Ahorra 16%' },
    },
    features: [
      'Documentos ilimitados',
      'Insights avanzados (mapas de calor, comparativas)',
      'Copias inteligentes + versiones',
      'Soporte prioritario',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'Equipos y grupos',
    display: {
      monthly: { price: '$19.99/mes' },
      yearly: { price: '$199/año', note: '2 meses gratis' },
    },
    features: ['Todo en Pro', 'Múltiples asientos', 'Panel de administración', 'Facturación unificada'],
  },
]

// Métodos alternativos (mismos datos que ya mostraste)
const PAYPHONE_LINK = 'https://ppls.me/bWYM3Lyr9GOCb7EI6AF4xQ'
const WHATSAPP_LINK = 'https://wa.me/593958757302'
const BANKS = [
  {
    bank: 'Banco 1 (Pichincha)',
    name: 'María Belén Sacon Muñoz',
    account: '2205651295',
    type: 'Ahorros',
    note: 'Solo recibimos transferencias del mismo banco o interbancarias efectivas al momento.',
  },
  {
    bank: 'Banco 2 (Produbanco)',
    name: 'María Belén Sacon Muñoz',
    account: '20002392265',
    type: 'Ahorros',
    ci: '1351471006',
    note: 'Envíanos el comprobante por WhatsApp.',
  },
]

/* --------------------------------- Página --------------------------------- */
export default function PremiumPage() {
  const { user, perfil } = useUserContext()
  const [billing, setBilling] = useState<Cycle>('monthly')
  const [isPremium, setIsPremium] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  // Modal de métodos de pago
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  useEffect(() => {
    let m = true
    ;(async () => {
      if (!user) return setIsPremium(false)
      const { data } = await supabase.from('profiles').select('is_premium').eq('id', user.id).maybeSingle()
      if (m) setIsPremium(Boolean(data?.is_premium))
    })()
    return () => { m = false }
  }, [user])

  // Llama a Stripe Checkout (el servidor resuelve priceId por plan/cycle)
  const goStripeCheckout = async (planId: PlanId) => {
    if (!user?.id || !user?.email) {
      alert('Debes iniciar sesión para continuar.')
      return
    }
    try {
      setLoading(true)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email, planId, cycle: billing }),
      })
      const data = await res.json()
      if (data?.url) window.location.href = data.url
      else alert(data?.error || 'No se pudo iniciar el checkout')
    } finally {
      setLoading(false)
    }
  }

  const manageBilling = async () => {
    try {
      setLoading(true)
      const customerId = (perfil as any)?.stripe_customer_id
      if (!customerId) return alert('No se encontró tu cliente de Stripe.')
      const res = await fetch('/api/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      })
      const data = await res.json()
      if (data?.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-b from-violet-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-950 min-h-[80vh]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 rounded-2xl border bg-white/70 dark:bg-zinc-900/60 backdrop-blur p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Premium
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Desbloquea estadísticas avanzadas, pronósticos y funciones exclusivas.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <FeatureCard
            icon={<Sparkles className="w-5 h-5" />}
            title="Insights avanzados"
            desc="Mapas de calor, comparativas históricas y métricas PRO."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Copias inteligentes"
            desc="Historial extendido y restauración de versiones."
          />
          <FeatureCard
            icon={<BadgeCheck className="w-5 h-5" />}
            title="Soporte prioritario"
            desc="Respuestas más rápidas y atención dedicada."
          />
        </div>

        {/* Toggle de ciclo */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-3 py-1.5 rounded-full border ${billing === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-zinc-900'}`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`px-3 py-1.5 rounded-full border ${billing === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-zinc-900'}`}
          >
            Anual
          </button>
        </div>

        {/* Grid de planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const disp = plan.display[billing]
            return (
              <div
                key={plan.id}
                className={`rounded-2xl border bg-white dark:bg-zinc-900 p-6 flex flex-col gap-4 ${
                  plan.highlight ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
              >
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                </div>

                <div>
                  <div className="text-2xl font-bold">{disp.price}</div>
                  {disp.note && <div className="text-xs text-green-600 mt-1">{disp.note}</div>}
                </div>

                <ul className="space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 text-emerald-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled={loading || isPremium === true}
                  onClick={() => setSelectedPlan(plan)}
                  className={`mt-auto rounded-xl px-4 py-2 font-medium ${
                    isPremium
                      ? 'bg-gray-200 text-gray-600 dark:bg-zinc-800 dark:text-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isPremium ? 'Ya eres Premium' : 'Elegir plan'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Gestionar suscripción si ya es premium */}
        {isPremium && (
          <div className="mt-6 text-center">
            <button
              onClick={manageBilling}
              disabled={loading}
              className="rounded-xl px-4 py-2 border hover:bg-white/60 dark:hover:bg-zinc-800/60"
            >
              Gestionar suscripción
            </button>
          </div>
        )}
      </div>

      {/* Modal de métodos de pago */}
      <PaymentModal
        open={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan}
        billing={billing}
        onPayCard={() => {
          if (selectedPlan) goStripeCheckout(selectedPlan.id)
        }}
      />
    </div>
  )
}

/* ------------------------------- Subcomponentes ------------------------------- */

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-white dark:bg-zinc-900 p-5 hover:shadow-md transition">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
        {icon}
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

function PaymentModal({
  open, onClose, plan, billing, onPayCard,
}: {
  open: boolean
  onClose: () => void
  plan: Plan | null
  billing: Cycle
  onPayCard: () => void
}) {
  const [copied, setCopied] = useState<string>('')

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(''), 1600)
    } catch {
      // noop
    }
  }

  if (!open || !plan) return null
  const disp = plan.display[billing]

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-2xl
                   rounded-2xl border bg-white dark:bg-zinc-900 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Has elegido</p>
            <h3 className="text-lg font-semibold">
              {plan.name} — <span className="font-normal">{billing === 'monthly' ? 'Mensual' : 'Anual'}</span>
            </h3>
            <p className="text-sm">{disp.price}{disp.note ? ` · ${disp.note}` : ''}</p>
          </div>
          <button
            aria-label="Cerrar"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Métodos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Tarjeta / Stripe */}
          <div className="rounded-xl border p-4 bg-white dark:bg-zinc-900">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <p className="font-medium">Pagar con tarjeta</p>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Redirección segura a Stripe Checkout.
            </p>
            <button
              onClick={onPayCard}
              className="w-full rounded-lg bg-blue-600 text-white py-2 hover:bg-blue-700"
            >
              Ir a pagar
            </button>
          </div>

          {/* Payphone */}
          <div className="rounded-xl border p-4 bg-white dark:bg-zinc-900">
            <div className="flex items-center gap-2 mb-2">
              <PhoneCall className="w-5 h-5 text-indigo-600" />
              <p className="font-medium">Payphone</p>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Si prefieres Payphone, usa el enlace directo.
            </p>
            <a
              href={PAYPHONE_LINK}
              target="_blank"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Abrir Payphone <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Transferencias */}
          <div className="md:col-span-2 rounded-xl border p-4 bg-white dark:bg-zinc-900">
            <div className="flex items-center gap-2 mb-2">
              <Banknote className="w-5 h-5 text-emerald-600" />
              <p className="font-medium">Transferencia bancaria</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {BANKS.map((b) => (
                <div key={b.bank} className="rounded-lg border p-3">
                  <p className="font-medium">{b.bank}</p>
                  <p className="text-sm">Nombre: <b>{b.name}</b></p>
                  <p className="text-sm">Cuenta de {b.type.toLowerCase()}: <b>{b.account}</b></p>
                  {b.ci && <p className="text-sm">CI: <b>{b.ci}</b></p>}
                  <p className="text-xs text-muted-foreground mt-1">{b.note}</p>

                  <div className="flex gap-2 mt-3">
                    <CopyBtn
                      label="Cuenta"
                      copied={copied === b.account}
                      onCopy={() => copy(b.account, b.account)}
                    />
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-4">
          Después de transferir, envíanos el comprobante por WhatsApp para activar tu plan manualmente.
        </p>
      </div>
    </div>
  )
}

function CopyBtn({ onCopy, copied, label }: { onCopy: () => void; copied: boolean; label: string }) {
  return (
    <button
      onClick={onCopy}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
    >
      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
      {copied ? 'Copiado' : `Copiar ${label}`}
    </button>
  )
}
