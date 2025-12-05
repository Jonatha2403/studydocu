'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// CARD (contenedor principal)
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border bg-white text-gray-900 shadow-sm',
      'dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100',
      'transition-colors duration-300 ease-in-out',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

// HEADER (zona superior)
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'p-4 border-b dark:border-gray-800',
      'flex flex-col space-y-1.5',
      className
    )}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

// TITLE (título grande)
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold tracking-tight text-lg', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

// DESCRIPTION (texto pequeño debajo del título)
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

// CONTENT (cuerpo del card)
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-4 text-sm leading-relaxed', className)}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

// FOOTER (parte inferior)
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-4 border-t dark:border-gray-800', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
}
