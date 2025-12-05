'use client'

import * as React from 'react'
import { cn } from '@/lib/utils' // usa `clsx` o `tailwind-merge` si tienes

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // valor entre 0 y 100
}

export function Progress({ value, className = '', ...props }: ProgressProps) {
  return (
    <div
      role="progressbar"
      aria-label="Progreso"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn(
        'w-full h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800',
        className
      )}
      {...props}
    >
      <div
        className="h-full transition-all duration-500 ease-out bg-gradient-to-r from-purple-500 to-indigo-500"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
