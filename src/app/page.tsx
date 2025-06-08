'use client'

import Link from 'next/link'
import '@/styles/helpers.css'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  CheckCircle,
  LayoutDashboard,
  MessageSquare,
  Brain,
  CalendarDays,
  Goal,
  FileText,
  CreditCard,
  Star,
  ShieldCheck,
  Eye,
  Gift,
} from 'lucide-react'

const featureItems = [
  { name: 'Tareas', icon: CheckCircle, description: 'Organiza y gestiona tus pendientes.' },
  { name: 'Documentos', icon: FileText, description: 'Crea y colabora en documentos.' },
  { name: 'Chat', icon: MessageSquare, description: 'Colabora en tiempo real.' },
  { name: 'IA Asistente', icon: Brain, description: 'Potencia tu productividad con IA.' },
  { name: 'Calendario', icon: CalendarDays, description: 'Visualiza tus plazos y eventos.' },
  { name: 'Metas', icon: Goal, description: 'Define y sigue tus objetivos.' },
  { name: 'Suscripciones', icon: CreditCard, description: 'Accede a funciones premium.' },
  { name: 'Dashboards', icon: LayoutDashboard, description: 'Visualiza tus datos clave.' },
]

const advancedFeatures = [
  {
    name: 'Resumen automático',
    icon: Brain,
    description: 'IA que resume tus documentos al subirlos.',
  },
  { name: 'Vista previa inteligente', icon: Eye, description: 'Explora documentos sin abrirlos.' },
  { name: 'Moderación automática', icon: ShieldCheck, description: 'IA revisa contenido por ti.' },
  {
    name: 'Sistema de recompensas',
    icon: Gift,
    description: 'Gana puntos y premios por participar.',
  },
]

export default function HomePage() {
  return (
    <main className="relative overflow-hidden min-h-screen bg-background text-text selection:bg-primary/20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />

      {/* Hero principal */}
      <section className="w-full pt-28 pb-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            🌟 Bienvenido a StudyDocu
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Organiza tus documentos, tareas, apuntes y metas en un solo lugar. Hecho para
            estudiantes como tú.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/subir">
              <Button
                size="lg"
                className="text-base shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:brightness-110"
              >
                Empezar ahora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/suscripcion">
              <Button variant="secondary" size="lg" className="text-base">
                Ver planes
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Funciones gratuitas disponibles. Desbloquea más con Premium.
          </p>
        </motion.div>
      </section>

      {/* Funcionalidades destacadas */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900 border-t border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {featureItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background border border-muted rounded-xl p-6 shadow-sm text-center"
            >
              <item.icon className="w-8 h-8 mx-auto mb-3 text-primary" strokeWidth={1.5} />
              <h3 className="text-sm font-semibold mb-1 text-foreground">{item.name}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/caracteristicas">
            <Button variant="link">
              Y mucho más <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonios + universidades */}
      <section className="py-20 px-4 bg-muted dark:bg-muted/10 border-t border-border">
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Estudiantes que confían en StudyDocu</h2>
            <p className="text-muted-foreground mb-6">
              Miles de estudiantes de distintas universidades ya están mejorando su organización y
              desempeño académico.
            </p>
            <ul className="space-y-4">
              {[
                ['Maria P.', '“Subí todos mis resúmenes y ahora los tengo siempre a mano.”'],
                ['Carlos R.', '“Lo uso para organizar mi tesis, ¡me salvó la vida!”'],
                ['Sofía L.', '“Mucho mejor que tener mis documentos sueltos en el Drive.”'],
              ].map(([name, quote]) => (
                <li key={name} className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <span>
                    <strong>{name}</strong>: {quote}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-center"
          >
            {['ESPOL', 'PUCE', 'UDLA', 'UTPL', 'USFQ', 'Universidad Central'].map((uni) => (
              <div
                key={uni}
                className="bg-white dark:bg-background border border-border rounded-lg py-3 px-4 text-center text-sm font-medium text-foreground shadow"
              >
                🎓 {uni}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Funciones con IA */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Funciones avanzadas con IA</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedFeatures.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-muted border border-border rounded-xl p-6 text-center shadow"
              >
                <item.icon className="w-8 h-8 mx-auto mb-3 text-primary" strokeWidth={1.5} />
                <h3 className="text-sm font-semibold text-foreground mb-1">{item.name}</h3>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/explorar">
              <Button size="lg" className="text-base shadow">
                Explorar documentos públicos <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
