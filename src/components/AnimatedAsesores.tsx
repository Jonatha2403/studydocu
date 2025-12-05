'use client'

import { motion } from 'framer-motion'
import { Button } from './ui/button'
import Link from 'next/link'
import Lottie from 'lottie-react'

// ✅ Rutas locales corregidas
import JonathanAnimation from '@/assets/animations/jonathan-rosado.json'
import MariaAnimation from '@/assets/animations/maria-belen.json'
import RousseAnimation from '@/assets/animations/rousse-antonella.json'
import DalilaAnimation from '@/assets/animations/dalila-lopez.json'


const advisors = [
  {
    id: 1,
    name: 'Jonathan Rosado',
    animation: JonathanAnimation,
    specialty: 'CEO - Fundador',
    whatsapp: '+593958757302',
    university: 'UTPL - Ecuador',
  },
  {
    id: 2,
    name: 'María Belén',
    animation: MariaAnimation,
    specialty: 'Contabilidad y Finanzas',
    whatsapp: '+593995226059',
    university: 'UTM - Ecuador',
  },
  {
    id: 3,
    name: 'Rousse Antonella',
    animation: RousseAnimation,
    specialty: 'Asesora Financiera',
    whatsapp: '+593987453194',
    university: 'UNEMI - Ecuador',
  },
  {
    id: 4,
    name: 'Dalila Lopez',
    animation: DalilaAnimation,
    specialty: 'Contabilidad y Auditoría',
    whatsapp: '+593997337305',
    university: 'UIDE - Ecuador',
  },
]

export default function AnimatedAsesores() {
  return (
    <section className="w-full max-w-screen-2xl mx-auto pt-0 pb-6 px-6 md:px-12">
      <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">Asesores verificados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {advisors.map((advisor, i) => (
          <motion.div
            key={advisor.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 text-center shadow hover:shadow-xl hover:scale-[1.03] transition-all duration-300 ease-out"
          >
            <div className="h-40 w-40 mx-auto mb-4">
              <Lottie animationData={advisor.animation} loop autoplay />
            </div>
            <h3 className="text-xl font-semibold text-foreground flex items-center justify-center">
              {advisor.name}
              <span className="ml-2 text-blue-500 text-lg" title="Asesor verificado">✅</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-1">{advisor.specialty}</p>
            <p className="text-xs text-muted-foreground">{advisor.university}</p>

            <div className="mt-4 space-y-2">
              <a
                href={`https://wa.me/${advisor.whatsapp.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  Contactar por WhatsApp
                </Button>
              </a>
              <Link href={`/asesores/${advisor.id}`}>
                <Button variant="ghost" className="w-full">
                  Ver perfil completo
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
