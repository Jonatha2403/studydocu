'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import AIChat from '@/components/AIChat'
import ResumenNotas from '@/components/ResumenNotas'
import { Brain, FileText, Sparkles } from 'lucide-react'

export default function IAPage() {
  const [modo, setModo] = useState<'chat' | 'resumen'>('chat')

  const tabs = [
    { id: 'chat', label: 'Chat IA', icon: Brain },
    { id: 'resumen', label: 'Notas a resumen', icon: FileText },
  ] as const

  return (
    <DashboardLayout>
      <section className="mx-auto mt-6 max-w-5xl px-4 pb-24">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-cyan-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="mb-2 flex items-center gap-2 text-cyan-600">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">IA Educativa</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Asistente academico StudyDocu
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Consulta conceptos, mejora redaccion y resume apuntes en segundos.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setModo(id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                modo === id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
              aria-pressed={modo === id}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
          {modo === 'chat' ? <AIChat /> : <ResumenNotas />}
        </div>
      </section>
    </DashboardLayout>
  )
}
