'use client'

import { Crown } from 'lucide-react'

export default function PremiumBadge() {
  return (
    <div className="inline-flex items-center gap-1 bg-yellow-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm dark:bg-yellow-500">
      <Crown size={14} className="stroke-[2.5]" />
      <span>Miembro Premium</span>
    </div>
  )
}
