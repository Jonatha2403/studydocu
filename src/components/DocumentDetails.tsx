'use client'

import { Calendar, GraduationCap, School, User2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Props {
  document: {
    title: string
    university: string
    career: string
    subject: string
    type: string
    description: string
    uploaded_by: string
    created_at: string
  }
}

export default function DocumentDetails({ document }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md space-y-4">
      <h2 className="text-2xl font-bold">{document.title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <School className="w-4 h-4 text-blue-600" />
          <span><strong>Universidad:</strong> {document.university}</span>
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-green-600" />
          <span><strong>Carrera:</strong> {document.career}</span>
        </div>

        <div className="flex items-center gap-2">
          <User2 className="w-4 h-4 text-purple-600" />
          <span><strong>Autor:</strong> {document.uploaded_by}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>
            <strong>Fecha de subida:</strong>{' '}
            {format(new Date(document.created_at), 'dd MMM yyyy', { locale: es })}
          </span>
        </div>

        <div className="sm:col-span-2">
          <span><strong>Materia:</strong> {document.subject}</span>
        </div>

        <div className="sm:col-span-2">
          <span><strong>Tipo de documento:</strong> {document.type}</span>
        </div>

        <div className="sm:col-span-2">
          <span><strong>Descripción:</strong> {document.description}</span>
        </div>
      </div>
    </div>
  )
}
