// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  // ✅ Ajustes para que no te bloquee el desarrollo
  {
    rules: {
      // Permitir any (puedes cambiar a "warn" si quieres ir mejorándolo poco a poco)
      '@typescript-eslint/no-explicit-any': 'off',

      // Quitar esta regla (te está marcando setState dentro de useEffect como error)
      'react-hooks/set-state-in-effect': 'off',

      // Shadcn/ui suele traer interfaces vacías, no vale la pena bloquear por eso
      '@typescript-eslint/no-empty-object-type': 'off',

      // Si quieres, deja este como warning (no error)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Ignorados recomendados
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
  ]),
])
