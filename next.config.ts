// next.config.ts
import type { NextConfig } from 'next'
import type { Configuration } from 'webpack'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    // Puedes dejarlo en true si no quieres bloquear el build por lint.
    ignoreDuringBuilds: true,
  },

  images: {
    // Si luego usas más buckets/dominos, agrégalos aquí.
    domains: ['abcxyz.supabase.co', 'cdn.studydocu.ec'],
    // Alternativa si necesitas patrones:
    // remotePatterns: [
    //   { protocol: 'https', hostname: '*.supabase.co' },
    //   { protocol: 'https', hostname: 'cdn.studydocu.ec' },
    // ],
  },

  experimental: {
    typedRoutes: true,
    webVitalsAttribution: ['CLS', 'FCP', 'FID', 'LCP', 'TTFB'],
  },

  // Redirect para enlaces antiguos / compatibilidad
  async redirects() {
    return [
      {
        source: '/dashboard/perfil/mi-cuenta',
        destination: '/dashboard/perfil',
        permanent: true, // 308/301
      },
    ]
  },

  webpack(config: Configuration) {
    // Fuentes locales
    config.module?.rules?.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name][ext]',
      },
    })

    // 🔒 Enforce case‑sensitive paths (evita bugs entre Windows y Linux)
    if (config.plugins) {
      config.plugins.push(new CaseSensitivePathsPlugin())
    }

    return config
  },
}

export default nextConfig
