// src/lib/utils.ts

/**
 * Combina clases condicionales para usar con Tailwind CSS.
 * Filtra valores falsy como `false`, `null`, `undefined` o `''`.
 *
 * @param classes Lista de clases condicionales
 * @returns Una cadena de clases válidas
 */
export default function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
