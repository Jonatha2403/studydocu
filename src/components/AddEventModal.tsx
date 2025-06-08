'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface AddEventModalProps {
  open: boolean
  onClose: () => void
  onEventAdded: () => void
}

export default function AddEventModal({
  open,
  onClose,
  onEventAdded
}: AddEventModalProps) {
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [type, setType] = useState('General')
  const [saving, setSaving] = useState(false)

  const handleAddEvent = async () => {
    if (!title.trim() || !start || !end) {
      toast.error('Completa todos los campos obligatorios')
      return
    }

    setSaving(true)

    const { error } = await supabase.from('calendar_events').insert({
      title: title.trim(),
      start,
      end,
      type: type.trim()
    })

    if (error) {
      toast.error('Error al guardar el evento')
    } else {
      toast.success('✅ Evento agregado con éxito')
      onClose()
      onEventAdded()
      setTitle('')
      setStart('')
      setEnd('')
      setType('General')
    }

    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>📅 Agregar Evento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input
            placeholder="Título del evento *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />

          <Input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />

          <Input
            placeholder="Tipo (Ej: entrega, clase, asesoría)"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />

          <Button
            onClick={handleAddEvent}
            disabled={saving}
            className="w-full"
          >
            {saving ? 'Guardando...' : 'Agregar Evento'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
