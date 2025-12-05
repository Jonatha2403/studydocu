"use client"

import { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Documento {
  id: string
  file_name: string
  status: "subido" | "revision" | "aprobado"
  created_at: string
}

const columnas = {
  subido: "📤 Subido",
  revision: "🧐 En Revisión",
  aprobado: "✅ Aprobado"
}

export default function KanbanTablero() {
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDocumentos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("documents")
      .select("id, file_name, status, created_at")
      .order("created_at", { ascending: true })

    if (!error && data) setDocumentos(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchDocumentos()
  }, [])

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination || source.droppableId === destination.droppableId) return

    const updatedStatus = destination.droppableId as Documento["status"]
    await supabase.from("documents").update({ status: updatedStatus }).eq("id", draggableId)
    fetchDocumentos()
  }

  return (
    <div className="mt-6">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(columnas).map(([key, titulo]) => (
              <Droppable droppableId={key} key={key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow min-h-[300px]"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">{titulo}</h2>
                    {documentos
                      .filter((doc) => doc.status === key)
                      .map((doc, index) => (
                        <Draggable draggableId={doc.id} index={index} key={doc.id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3"
                            >
                              <Card className="bg-gray-50 dark:bg-gray-800">
                                <CardContent className="p-3 text-sm text-gray-700 dark:text-gray-200">
                                  {doc.file_name}
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  )
}
