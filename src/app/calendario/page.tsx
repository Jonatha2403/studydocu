'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, CalendarDays } from 'lucide-react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Calendario from '@/components/Calendario'
import AddEventModal from '@/components/AddEventModal'

interface EventItem {
  id: string
  title: string
  start: string
  end: string
  type: string
}

export default function CalendarioPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start', { ascending: true })

    if (!error && data) setEvents(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto mt-6 px-4 relative pb-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-blue-500" size={28} />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Calendario de Actividad
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
          </div>
        ) : (
          <Calendario events={events} />
        )}

        {/* Botón flotante estilo iOS */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-blue-600 dark:text-blue-400 rounded-full p-4 shadow-xl hover:scale-105 transition-all duration-200"
          aria-label="Agregar evento"
        >
          <span className="text-2xl">＋</span>
        </button>

        <AddEventModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onEventAdded={fetchEvents}
        />
      </div>
    </DashboardLayout>
  )
}
