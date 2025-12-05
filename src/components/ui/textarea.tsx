// src/components/ui/textarea.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'   // <-- CORREGIDO (import nombrado)

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full min-h-[100px] rounded-md border border-gray-300 dark:border-gray-700',
          'bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-white',
          'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
