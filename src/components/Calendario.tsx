'use client'

import { CalendarDays, Clock } from 'lucide-react'

interface EventoCalendario {
  id: string
  title: string
  start: string
  end: string
  type: string
}

export default function Calendario({ events }: { events: EventoCalendario[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">📅 Calendario de Actividad</h2>

      {events.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No hay eventos programados.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((evento) => {
            const startDate = new Date(evento.start)
            const fecha = startDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            const hora = startDate.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <li key={evento.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{evento.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <CalendarDays size={16} /> {fecha}
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {hora}
                  </span>
                </p>
                {evento.type && (
                  <p className="text-xs text-indigo-500 dark:text-indigo-300 mt-1">{evento.type}</p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
