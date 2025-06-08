// src/components/layouts/DashboardLayout.tsx
'use client'

import Sidebar from '@/components/Sidebar'
import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  )
}
