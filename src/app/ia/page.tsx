'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import AIChat from '@/components/AIChat'
import ResumenNotas from '@/components/ResumenNotas'
import { Sparkles } from 'lucide-react'

export default function IAPage() {
  const [modo, setModo] = useState<'chat' | 'resumen'>('chat')

  const tabs = [
    { id: 'chat', label: '🧠 Chat con IA' },
    { id: 'resumen', label: '📄 Notas a Resumen' },
  ] as const

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto mt-6 px-4 pb-32">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-purple-500" size={28} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">IA Educativa</h1>
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setModo(id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${
                modo === id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
              }`}
              aria-pressed={modo === id}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-4 bg-white dark:bg-gray-900">
          {modo === 'chat' ? <AIChat /> : <ResumenNotas />}
        </div>
      </div>
    </DashboardLayout>
  )
}
