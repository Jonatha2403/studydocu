// src/app/layout.tsx  (Server Component ✅)
import './globals.css'
import localFont from 'next/font/local'
import type { Metadata, Viewport } from 'next'

import Spotlight from '@/components/Spotlight' // client component, ok
import { UserProvider } from '@/context/UserContext'
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper'

/* ---------------------- FUENTE SF PRO ---------------------- */
const sfPro = localFont({
  src: [
    { path: '../fonts/SF-Pro-Display-Regular.otf', weight: '400' },
    { path: '../fonts/SF-Pro-Display-Medium.otf', weight: '500' },
    { path: '../fonts/SF-Pro-Display-Semibold.otf', weight: '600' },
    { path: '../fonts/SF-Pro-Display-Bold.otf', weight: '700' },
  ],
  variable: '--font-sf',
  display: 'swap',
  preload: true,
})

/* ---------------------- METADATOS (solo en server) ---------------------- */
export const metadata: Metadata = {
  metadataBase: new URL('https://studydocu.ec'),
  title: {
    default: 'StudyDocu',
    template: '%s | StudyDocu',
  },
  description: 'Plataforma académica inteligente',
  openGraph: {
    title: 'StudyDocu — Plataforma académica inteligente',
    description:
      'Comparte apuntes, optimiza tu estudio y conecta con tu comunidad.',
    url: 'https://studydocu.ec',
    siteName: 'StudyDocu',
    images: [
      {
        url: '/og-image.png', // asegúrate de tener este archivo en /public
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyDocu — Plataforma académica inteligente',
    description:
      'Comparte apuntes, optimiza tu estudio y conecta con tu comunidad.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',      // 👈 tu logo en /public
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFCE00' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1220' },
  ],
}

/* ---------------------- ROOT LAYOUT (server) ---------------------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={sfPro.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white antialiased">
        {/* Capas visuales globales */}
        <div className="aurora-bg" />
        <div className="radial-layer" />
        <div className="bg-grid fixed inset-0 -z-50 opacity-[.22] dark:opacity-[.16] pointer-events-none" />
        <div className="noise-layer" />
        <Spotlight />

        {/* Client boundaries */}
        <UserProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </UserProvider>
      </body>
    </html>
  )
}
