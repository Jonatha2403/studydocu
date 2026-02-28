// next.config.ts
import type { NextConfig } from 'next'
import type { Configuration } from 'webpack'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Nueva ubicación de typedRoutes en Next 16
  typedRoutes: true,

  images: {
    // Uso de remotePatterns en lugar de images.domains (Next 16)
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
    webVitalsAttribution: ['CLS', 'FCP', 'FID', 'LCP', 'TTFB'],
  },

  // 🔁 Redirects
  async redirects() {
    return [
      // ✅ FORZAR WWW (SEO)  studydocu.ec -> www.studydocu.ec
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'studydocu.ec',
          },
        ],
        destination: 'https://www.studydocu.ec/:path*',
        permanent: true,
      },

      // ✅ Tu redirect actual
      {
        source: '/dashboard/perfil/mi-cuenta',
        destination: '/dashboard/perfil',
        permanent: true,
      },
    ]
  },

  // 🚫 CACHE CONTROL GLOBAL (SOLUCIÓN AL PROBLEMA)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
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

    // 🔒 Enforce case-sensitive paths (Windows ↔ Linux)
    if (config.plugins) {
      config.plugins.push(new CaseSensitivePathsPlugin())
    }

    return config
  },
}

export default nextConfig
