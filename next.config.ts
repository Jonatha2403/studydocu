// next.config.ts
import type { NextConfig } from 'next'
import type { Configuration } from 'webpack'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Nueva ubicación de typedRoutes en Next 16
  typedRoutes: true,

  images: {
    // Uso de remotePatterns en lugar de images.domains (recomendado en Next 16)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'abcxyz.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.studydocu.ec',
      },
    ],
  },

  experimental: {
    // typedRoutes ya no va aquí, solo webVitalsAttribution
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

    // 🔒 Enforce case-sensitive paths (evita bugs entre Windows y Linux)
    if (config.plugins) {
      config.plugins.push(new CaseSensitivePathsPlugin())
    }

    return config
  },
}

export default nextConfig
