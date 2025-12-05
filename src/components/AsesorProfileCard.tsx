'use client'

import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { Mail, Phone, Star, School } from 'lucide-react'
import Image from 'next/image'

type Props = {
  name: string
  title: string
  university: string
  email: string
  phone: string
  rating: number
  animation: any
  avatarUrl?: string
}

export default function AsesorProfileCard({
  name,
  title,
  university,
  email,
  phone,
  rating,
  animation,
  avatarUrl,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 p-6 md:p-10 rounded-3xl shadow-xl border border-gray-200 dark:border-zinc-700"
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-40 h-40 flex-shrink-0 rounded-full overflow-hidden shadow-md">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={name} width={160} height={160} className="object-cover" />
          ) : (
            <Lottie animationData={animation} loop />
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-1">{name}</h2>
          <p className="text-muted-foreground text-lg">{title}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1"><School size={16} /> {university}</div>
            <div className="flex items-center gap-1"><Mail size={16} /> {email}</div>
            <div className="flex items-center gap-1"><Phone size={16} /> {phone}</div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                fill={i < rating ? 'currentColor' : 'none'}
              />
            ))}
            <span className="ml-2 text-sm font-medium">Valoración: {rating}/5</span>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
