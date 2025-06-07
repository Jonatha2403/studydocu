// En el archivo: lib/utils.ts (o src/lib/utils.ts si usas carpeta src)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string { // Tipo de retorno explícito añadido
  return twMerge(clsx(inputs))
}