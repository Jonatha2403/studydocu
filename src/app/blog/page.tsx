'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Lottie from 'lottie-react'
import Link from 'next/link'

import blogApa from '@/assets/animations/blog-apa.json'
import blogEstudio from '@/assets/animations/blog-estudio.json'
import blogIa from '@/assets/animations/blog-ia.json'

interface Article {
  id: string
  title: string
  excerpt: string
  date: string
  image_url: string
  category: string
}

function getAnimation(title: string) {
  const lower = title.toLowerCase()
  if (lower.includes('apa')) return blogApa
  if (lower.includes('ia')) return blogIa
  return blogEstudio // default
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .order('date', { ascending: false })
      if (!error && data) setArticles(data)
    }
    fetchArticles()
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <motion.section
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 justify-center mb-3">
          <Sparkles className="text-purple-500" size={24} />
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">
            Blog educativo
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Aprende, mejora y comparte conocimiento
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Consejos, tutoriales y recursos para potenciar tu experiencia universitaria.
        </p>
      </motion.section>

      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((post, index) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="block">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:scale-105 transition-all"
            >
              <div className="relative h-48 w-full">
                <Lottie
                  animationData={getAnimation(post.title)}
                  loop
                  autoplay
                  className="h-48 w-full object-contain"
                />
              </div>
              <div className="p-5">
                <span className="text-xs text-purple-700 dark:text-purple-300 uppercase font-medium">
                  {post.category}
                </span>
                <h2 className="text-lg font-semibold mt-2 mb-1 text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {post.excerpt}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{post.date}</p>
              </div>
            </motion.article>
          </Link>
        ))}
      </section>
    </main>
  )
}
