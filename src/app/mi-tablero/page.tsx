'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { format } from 'date-fns'
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult
} from '@hello-pangea/dnd'

interface Documento {
  id: string
  file_name: string
  status: 'subido' | 'revision' | 'aprobado'
  created_at: string
}

const ESTADOS: Record<Documento['status'], string> = {
  subido: '📤 Subido',
  revision: '🕵️ En Revisión',
  aprobado: '✅ Aprobado'
}

export default function MiTableroPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([])

  const fetchDocs = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('id, file_name, status, created_at')
      .order('created_at', { ascending: true })

    if (!error && data) {
      setDocumentos(data as Documento[])
    } else {
      console.error('Error al obtener documentos:', error)
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination || source.droppableId === destination.droppableId) return

    const nuevoEstado = destination.droppableId as Documento['status']

    const { error } = await supabase
      .from('documents')
      .update({ status: nuevoEstado })
      .eq('id', draggableId)

    if (!error) {
      setDocumentos((prev) =>
        prev.map((doc) =>
          doc.id === draggableId ? { ...doc, status: nuevoEstado } : doc
        )
      )
    } else {
      console.error('Error actualizando documento:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          📂 Mi Tablero de Documentos
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['subido', 'revision', 'aprobado'] as Documento['status'][]).map(
              (estado) => (
                <Droppable droppableId={estado} key={estado}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow h-[500px] overflow-y-auto"
                    >
                      <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                        {ESTADOS[estado]}
                      </h2>
                      {documentos
                        .filter((doc) => doc.status === estado)
                        .map((doc, index) => (
                          <Draggable draggableId={doc.id} index={index} key={doc.id}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-3 shadow-sm"
                              >
                                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                  📄 {doc.file_name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-300">
                                  {format(new Date(doc.created_at), 'dd/MM/yyyy HH:mm')}
                                </p>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )
            )}
          </div>
        </DragDropContext>
      </div>
    </DashboardLayout>
  )
}
