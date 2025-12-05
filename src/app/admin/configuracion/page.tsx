// src/app/admin/configuracion/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SlidersHorizontal, Settings, ArrowLeft } from 'lucide-react'
import { useUserContext } from '@/context/UserContext'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface AdminSettings {
  id: string
  max_file_size_free: number
  max_file_size_premium: number
  max_docs_free: number
  max_docs_premium: number
  price_monthly: number
  price_yearly: number
  stripe_public_key: string | null
  stripe_premium_product_id: string | null
  maintenance_mode: boolean
  enable_beta_features: boolean
}

export default function ConfiguracionPage() {
  const { perfil, loading: loadingPerfil } = useUserContext()
  const role = (perfil as any)?.role
  const adminId = (perfil as any)?.id

  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // 🔄 Cargar settings reales desde Supabase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('*')
          .limit(1)
          .single()

        if (error) {
          console.error('[ADMIN_SETTINGS_LOAD_ERROR]', error)
          toast.error('No se pudo cargar la configuración.')
        } else if (data) {
          setSettings(data as AdminSettings)
        }
      } catch (err) {
        console.error('[ADMIN_SETTINGS_LOAD_FATAL]', err)
        toast.error('Error inesperado al cargar la configuración.')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  // 🧱 Estados de carga / permisos
  if (loadingPerfil || loading) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 animate-spin" />
          <span>Cargando configuración…</span>
        </div>
      </main>
    )
  }

  if (role !== 'admin') {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-red-500 px-4">
        <p className="text-lg font-semibold text-center">
          No tienes permisos para ver esta sección (admin requerido).
        </p>
      </main>
    )
  }

  if (!settings) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 px-4">
        <p className="text-lg font-semibold text-center">
          No se encontró la configuración inicial. Revisa la tabla <code>admin_settings</code>.
        </p>
      </main>
    )
  }

  // 📝 Manejo de cambios en inputs
  const handleChange = (
    field: keyof AdminSettings,
    value: string | number | boolean
  ) => {
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            [field]:
              typeof prev[field] === 'number'
                ? Number(value)
                : value,
          }
        : prev
    )
  }

  const handleToggle = (field: keyof AdminSettings) => {
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            [field]: !prev[field],
          }
        : prev
    )
  }

  // 💾 Guardar en Supabase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    setSaving(true)
    try {
      const payload = {
        max_file_size_free: settings.max_file_size_free,
        max_file_size_premium: settings.max_file_size_premium,
        max_docs_free: settings.max_docs_free,
        max_docs_premium: settings.max_docs_premium,
        price_monthly: settings.price_monthly,
        price_yearly: settings.price_yearly,
        stripe_public_key: settings.stripe_public_key,
        stripe_premium_product_id: settings.stripe_premium_product_id,
        maintenance_mode: settings.maintenance_mode,
        enable_beta_features: settings.enable_beta_features,
        updated_at: new Date().toISOString(),
        updated_by: adminId ?? null,
      }

      const { error } = await supabase
        .from('admin_settings')
        .update(payload)
        .eq('id', settings.id)

      if (error) {
        console.error('[ADMIN_SETTINGS_SAVE_ERROR]', error)
        toast.error('No se pudo guardar la configuración.')
      } else {
        toast.success('Configuración guardada correctamente.')
      }
    } catch (err) {
      console.error('[ADMIN_SETTINGS_SAVE_FATAL]', err)
      toast.error('Error inesperado al guardar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      {/* HEADER */}
      <header className="mb-8 space-y-3">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al panel de administración
        </Link>

        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6" />
            Configuración avanzada
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ajusta límites de subida, planes Premium y parámetros avanzados del sistema.
          </p>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Límites de tamaño por archivo */}
        <section className="border rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold">
            Límites de tamaño por archivo
          </h2>
          <p className="text-xs text-muted-foreground">
            Define el tamaño máximo permitido por archivo para los usuarios gratuitos y Premium.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Máx. por archivo (usuarios free)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900/60"
                  placeholder="ej. 20"
                  value={settings.max_file_size_free}
                  onChange={(e) =>
                    handleChange('max_file_size_free', e.target.value)
                  }
                  min={1}
                />
                <span className="text-xs text-muted-foreground">MB</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Máx. por archivo (usuarios Premium)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900/60"
                  placeholder="ej. 100"
                  value={settings.max_file_size_premium}
                  onChange={(e) =>
                    handleChange('max_file_size_premium', e.target.value)
                  }
                  min={1}
                />
                <span className="text-xs text-muted-foreground">MB</span>
              </div>
            </div>
          </div>
        </section>

        {/* Número máximo de documentos por usuario */}
        <section className="border rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold">
            Número máximo de documentos por usuario
          </h2>
          <p className="text-xs text-muted-foreground">
            Controla cuántos documentos puede tener cada usuario según su plan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Límite usuarios free
              </label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900/60"
                placeholder="ej. 30"
                value={settings.max_docs_free}
                onChange={(e) =>
                  handleChange('max_docs_free', e.target.value)
                }
                min={1}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Límite usuarios Premium
              </label>
              <input
                type="number"
                className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900/60"
                placeholder="ej. 300"
                value={settings.max_docs_premium}
                onChange={(e) =>
                  handleChange('max_docs_premium', e.target.value)
                }
                min={1}
              />
            </div>
          </div>
        </section>

        {/* Precios de planes Premium */}
        <section className="border rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold">Precios de planes Premium</h2>
          <p className="text-xs text-muted-foreground">
            Configura los precios visibles en la página de upgrade (mensual, anual, etc.).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Plan mensual (USD)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900/60"
                placeholder="ej. 4.99"
                value={settings.price_monthly}
                onChange={(e) =>
                  handleChange('price_monthly', e.target.value)
                }
                min={0}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Plan anual (USD)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900/60"
                placeholder="ej. 39.99"
                value={settings.price_yearly}
                onChange={(e) =>
                  handleChange('price_yearly', e.target.value)
                }
                min={0}
              />
            </div>
          </div>
        </section>

        {/* Configuración de Stripe */}
        <section className="border rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold">Configuración de Stripe</h2>
          <p className="text-xs text-muted-foreground">
            Claves públicas, IDs de productos y otros parámetros de integración con Stripe.
            (⚠️ Para claves secretas usa variables de entorno, no la base de datos).
          </p>

          <div className="space-y-3 mt-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Stripe public key
              </label>
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900/60"
                placeholder="pk_live_..."
                value={settings.stripe_public_key ?? ''}
                onChange={(e) =>
                  handleChange('stripe_public_key', e.target.value)
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                ID producto Premium
              </label>
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900/60"
                placeholder="prod_..."
                value={settings.stripe_premium_product_id ?? ''}
                onChange={(e) =>
                  handleChange('stripe_premium_product_id', e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* Parámetros avanzados del sistema */}
        <section className="border rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold">Parámetros avanzados del sistema</h2>
          <p className="text-xs text-muted-foreground">
            Opciones generales como modo mantenimiento y features experimentales.
          </p>

          <div className="mt-3 space-y-2 text-xs text-muted-foreground">
            <label className="flex items-center justify-between gap-4">
              <span>Modo mantenimiento</span>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={settings.maintenance_mode}
                onChange={() => handleToggle('maintenance_mode')}
              />
            </label>

            <label className="flex items-center justify-between gap-4">
              <span>Habilitar features de prueba (beta)</span>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={settings.enable_beta_features}
                onChange={() => handleToggle('enable_beta_features')}
              />
            </label>
          </div>
        </section>

        {/* Botón guardar real */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </main>
  )
}
