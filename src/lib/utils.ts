// src/lib/utils.ts

/**
 * Combina clases condicionales en un solo string, ignorando falsy values.
 * Ejemplo: cn('base', condition && 'activa') => "base activa"
 */
export default function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
