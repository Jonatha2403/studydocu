// /lib/calendar-events.ts
import { supabase } from '@/lib/supabase'

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  description?: string
  type?: 'entrega' | 'asesoria' | 'tarea'
}

export async function getEventsByUser(userId: string): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId)
    .order('start', { ascending: true })

  if (error) {
    console.error('Error al obtener eventos:', error)
    return []
  }

  return data.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    description: event.description,
    type: event.type
  }))
}

export async function addEvent(userId: string, event: Omit<CalendarEvent, 'id'>): Promise<boolean> {
  const { error } = await supabase.from('calendar_events').insert({
    ...event,
    user_id: userId,
  })

  if (error) {
    console.error('Error al agregar evento:', error)
    return false
  }

  return true
}
