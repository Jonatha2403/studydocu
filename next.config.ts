import type { NextConfig } from 'next'
import type { Configuration } from 'webpack'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: ['abcxyz.supabase.co', 'cdn.studydocu.ec'],
  },

  experimental: {
    typedRoutes: true,
    webVitalsAttribution: ['CLS', 'FCP', 'FID', 'LCP', 'TTFB'],
  },

  webpack(config: Configuration) {
    config.module?.rules?.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name][ext]',
      },
    })

    return config
  },
}

export default nextConfig
