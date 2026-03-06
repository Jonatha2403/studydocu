'use client'

import ClientWrapper from '@/components/ClientWrapper'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ClientWrapper>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 transition-all">{children}</main>
      </div>
    </ClientWrapper>
  )
}
