// app/ranking/page.tsx (o la ruta donde tengas esta página)

// Al quitar 'use client', este componente se convierte en un Server Component por defecto,
// lo que permite el uso de 'export const metadata'.
// Si RankingTable es un Client Component, puede ser importado y usado aquí sin problemas.

import RankingTable from '@/components/RankingTable'; // Asegúrate que la ruta sea correcta
import type { Metadata } from 'next';
import Link from 'next/link'; // Link se usa en la sección de ayuda opcional
import { Trophy } from 'lucide-react'; // Icono para el encabezado

// Metadata para la página
export const metadata: Metadata = {
  title: 'Ranking de Usuarios - StudyDocu',
  description: 'Consulta el ranking de los usuarios más activos y con más puntos en la comunidad StudyDocu.',
  // Puedes añadir más metadatos aquí (keywords, openGraph, etc.) si lo deseas
  // openGraph: {
  //   title: 'Ranking de Usuarios en StudyDocu',
  //   description: 'Descubre a los líderes de nuestra comunidad estudiantil.',
  //   images: [{ url: '/images/ranking-og.png' }], // Ejemplo de imagen para compartir
  // },
};

export default function RankingPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-8 sm:py-12 selection:bg-yellow-400 selection:text-black">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado de la Página */}
        <div className="mb-8 sm:mb-10 text-center border-b border-gray-200 dark:border-gray-700 pb-6">
          <Trophy 
            className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" 
            strokeWidth={1.5} 
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white tracking-tight">
            Ranking de la Comunidad
          </h1>
          <p className="mt-3 text-md sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Descubre a los usuarios más destacados de StudyDocu. ¡Sube documentos, participa y escala posiciones!
          </p>
        </div>

        {/* Tabla de Ranking */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden">
          {/* RankingTable probablemente maneje su propio padding y título interno si lo tiene */}
          <RankingTable />
        </div>

        {/* Opcional: Sección de cómo funciona el ranking o FAQs */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Los puntos se actualizan periódicamente. ¿Quieres saber más sobre cómo ganar puntos? 
            <Link href="/ayuda/puntos" className="text-blue-600 dark:text-yellow-400 hover:underline ml-1 font-medium">
              Visita nuestra sección de ayuda.
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}