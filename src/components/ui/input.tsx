import * as React from 'react'
import { cn } from '@/lib/utils' // ajusta si tu helper está en otra ruta

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors ' +
          'file:border-0 file:bg-transparent file:text-sm file:font-medium ' +
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
          'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

// Exporta ambas formas para evitar futuros dolores de cabeza:
export { Input }         // import { Input } from '@/components/ui/input'
export default Input     // import Input from '@/components/ui/input'
