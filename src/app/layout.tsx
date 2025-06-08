// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import type { Viewport as NextViewport } from 'next'
import localFont from 'next/font/local'
import { Toaster } from 'sonner'
import { ToastProvider } from '@/context/ToastContext'
import ClientWrapper from '@/components/ClientWrapper'
import WhatsappFloat from '@/components/WhatsappFloat'

// Fuente SF Pro personalizada
const sfPro = localFont({
  src: [
    { path: '../fonts/SF-Pro-Display-Thin.otf', weight: '100', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-ThinItalic.otf', weight: '100', style: 'italic' },
    { path: '../fonts/SF-Pro-Display-Ultralight.otf', weight: '200', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-UltralightItalic.otf', weight: '200', style: 'italic' },
    { path: '../fonts/SF-Pro-Display-Light.otf', weight: '300', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-LightItalic.otf', weight: '300', style: 'italic' },
    { path: '../fonts/SF-Pro-Display-Regular.otf', weight: '400', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-RegularItalic.otf', weight: '400', style: 'italic' },
    { path: '../fonts/SF-Pro-Display-Medium.otf', weight: '500', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-MediumItalic.otf', weight: '500', style: 'italic' },
    { path: '../fonts/SF-Pro-Display-Semibold.otf', weight: '600', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-SemiboldItalic.otf', weight: '600', style: 'italic' },
    { path: '../fonts/SF-Pro-Display-Bold.otf', weight: '700', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-BoldItalic.otf', weight: '700', style: 'italic' },
    { path: '../fonts/SF-Pro-Display-Heavy.otf', weight: '800', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-HeavyItalic.otf', weight: '800', style: 'italic' },
    { path: '../fonts/SF-Pro-Display-Black.otf', weight: '900', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-BlackItalic.otf', weight: '900', style: 'italic' },
  ],
  variable: '--font-sf',
  display: 'swap',
  preload: true,
})

// Metadata global
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'StudyDocu - Gestor Académico Inteligente',
    template: '%s | StudyDocu',
  },
  description: 'Sube, organiza, comparte y descubre documentos de estudio universitarios.',
  applicationName: 'StudyDocu',
  referrer: 'origin-when-cross-origin',
  keywords: ['StudyDocu', 'estudiantes', 'universidad'],
  authors: [{ name: 'StudyDocu Team' }],
  creator: 'StudyDocu',
  publisher: 'StudyDocu',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', type: 'image/png' }],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#7B68EE' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    url: process.env.NEXT_PUBLIC_BASE_URL || '/',
    title: 'StudyDocu - Tu Plataforma Académica Definitiva',
    description: 'Descubre, comparte y organiza documentos de estudio universitarios.',
    siteName: 'StudyDocu',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StudyDocu - Plataforma para estudiantes',
      },
    ],
    locale: 'es_EC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyDocu: Revoluciona tu Estudio Universitario',
    description: 'La herramienta esencial para estudiantes universitarios.',
    images: ['/twitter-image.png'],
  },
}

// Viewport extendido para PWA
interface ExtendedViewport extends NextViewport {
  appleWebApp?: {
    capable?: boolean | 'yes'
    statusBarStyle?: 'default' | 'black' | 'black-translucent'
    title?: string
  }
}

export const viewport: ExtendedViewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1120' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StudyDocu',
  },
}

// Layout raíz
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${sfPro.variable} scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans bg-appBackground-light text-appForeground-light dark:bg-appBackground-dark dark:text-appForeground-dark transition-colors duration-300">
        <Toaster position="top-right" richColors />
        <ToastProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </ToastProvider>
        <WhatsappFloat />
      </body>
    </html>
  )
}
