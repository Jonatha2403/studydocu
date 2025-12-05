'use client'

import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import AsesorProfileCard from '@/components/AsesorProfileCard'
import {
  JonathanAnimation,
  MariaAnimation,
  RousseAnimation,
  DalilaAnimation,
} from '@/assets/animations'
import { Button } from '@/components/ui/button'

const asesores = [
  {
    id: '1',
    name: 'Jonathan Rosado',
    specialty: 'CEO - Fundador',
    university: 'UTPL - Ecuador',
    email: 'jonathan@studydocu.ec',
    phone: '+593958757302',
    rating: 5,
    animation: JonathanAnimation,
  },
  {
    id: '2',
    name: 'María Belén',
    specialty: 'Contabilidad y Finanzas',
    university: 'UTM - Ecuador',
    email: 'maria@studydocu.ec',
    phone: '+593995226059',
    rating: 4,
    animation: MariaAnimation,
  },
  {
    id: '3',
    name: 'Rousse Antonella',
    specialty: 'Asesora Financiera',
    university: 'UNEMI - Ecuador',
    email: 'rousse@studydocu.ec',
    phone: '+593987453194',
    rating: 5,
    animation: RousseAnimation,
  },
  {
    id: '4',
    name: 'Dalila Lopez',
    specialty: 'Contabilidad y Auditoría',
    university: 'UIDE - Ecuador',
    email: 'dalila@studydocu.ec',
    phone: '+593997337305',
    rating: 4,
    animation: DalilaAnimation,
  },
]

export default function AsesorProfilePage() {
  const params = useParams()
  const id = params?.id?.toString()
  const asesor = asesores.find((a) => a.id === id)

  if (!id || !asesor) return notFound()

  return (
    <main className="min-h-screen py-20 px-6">
      <AsesorProfileCard
        name={asesor.name}
        title={asesor.specialty}
        university={asesor.university}
        email={asesor.email}
        phone={asesor.phone}
        rating={asesor.rating}
        animation={asesor.animation}
      />

      <div className="mt-8 flex justify-center">
        <a
          href={`https://wa.me/${asesor.phone.replace('+', '')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="bg-green-500 text-white hover:bg-green-600 text-lg px-6 py-3 rounded-full shadow">
            💬 Contactar por WhatsApp
          </Button>
        </a>
      </div>
    </main>
  )
}
