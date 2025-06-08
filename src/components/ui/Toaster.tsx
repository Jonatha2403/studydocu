'use client'

import { Toaster as SonnerToaster } from 'sonner'

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        duration: 3000,
        classNames: {
          toast: 'rounded-xl shadow-md px-4 py-3 text-sm font-medium',
          title: 'font-semibold text-base',
          description: 'text-xs opacity-80',
          actionButton: 'bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 text-sm',
          cancelButton: 'text-gray-500 hover:text-black',
        },
      }}
    />
  )
}
