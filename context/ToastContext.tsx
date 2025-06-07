'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { toast } from 'sonner'

export interface ToastContextProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

export const ToastContext = createContext<ToastContextProps | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    toast[type](message)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe usarse dentro de un <ToastProvider>')
  }
  return context
}
