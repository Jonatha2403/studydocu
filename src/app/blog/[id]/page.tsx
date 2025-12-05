'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

import blogApa from '@/assets/animations/blog-apa.json'
import blogEstudio from '@/assets/animations/blog-estudio.json'
import blogIa from '@/assets/animations/blog-ia.json'

interface Article {
  id: string
  title: string
  excerpt: string
  date: string
  content: string
  image_url: string
  category: string
}

function getAnimation(title: string) {
  const lower = title.toLowerCase()
  if (lower.includes('apa')) return blogApa
  if (lower.includes('ia')) return blogIa
  return blogEstudio
}

export default function BlogDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? ''
  const [article, setArticle] = useState<Article | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) setArticle(data)
    }

    if (id) fetchArticle()
  }, [id])

  if (!article) {
    return (
      <div className="text-center py-32 text-gray-500 dark:text-gray-400">
        Cargando artículo...
      </div>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/blog"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Volver al blog
        </Link>

        <div className="mb-6">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            <Link href="/" className="hover:underline">Inicio</Link> / <Link href="/blog" className="hover:underline">Blog</Link> / {article.title}
          </p>
          <span className="text-sm text-purple-600 dark:text-purple-400 font-medium uppercase">
            {article.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {article.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Publicado el {article.date}
          </p>
        </div>

        <div className="mb-6 rounded-xl overflow-hidden">
          <Lottie
            animationData={getAnimation(article.title)}
            loop
            autoplay
            className="w-full h-60 object-contain"
          />
        </div>

        <article className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-img:rounded-lg prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-blue-600">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>

        <div className="flex gap-4 mt-8 text-sm">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=https://studydocu.ec/blog/${article.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Compartir en Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=https://studydocu.ec/blog/${article.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline"
          >
            Compartir en Facebook
          </a>
        </div>

        <div className="mt-14 bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-xl text-white text-center shadow-lg">
          <p className="text-lg font-semibold mb-2">¿Te gustó este contenido?</p>
          <p className="text-sm mb-4">
            Recibe más recursos útiles en tu WhatsApp o suscríbete a nuestro blog.
          </p>
          <a
            href="https://wa.me/593958757302?text=Hola%20StudyDocu,%20quiero%20recibir%20más%20contenido%20del%20blog"
            target="_blank"
            className="inline-block bg-white text-purple-700 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </motion.div>
    </main>
  )
}
