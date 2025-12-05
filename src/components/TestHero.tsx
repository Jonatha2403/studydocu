'use client'

import { Button } from '@/components/ui/button'

export default function TestHero() {
  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-100 to-purple-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Test Hero</h1>
      <div className="flex gap-4">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full">
          Botón 1
        </Button>
        <Button variant="outline" className="px-6 py-3 rounded-full">
          Botón 2
        </Button>
      </div>
    </section>
  )
}
