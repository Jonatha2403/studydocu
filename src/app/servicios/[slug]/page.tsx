import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { getSeoService, seoServices } from '@/lib/servicesCatalog'

const SITE_URL = 'https://www.studydocu.ec'
const WHATSAPP_NUMBER = '593958757302'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return seoServices.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getSeoService(slug)
  if (!service) return {}

  const url = `${SITE_URL}/servicios/${service.slug}`
  return {
    title: { absolute: `${service.title} | StudyDocu` },
    description: service.description,
    keywords: service.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: service.title,
      description: service.description,
      url,
      siteName: 'StudyDocu',
      locale: 'es_EC',
      type: 'website',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: service.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.title,
      description: service.description,
      images: ['/og-image.jpg'],
    },
  }
}

export default async function ServiceSeoPage({ params }: PageProps) {
  const { slug } = await params
  const service = getSeoService(slug)
  if (!service) notFound()

  const pageUrl = `${SITE_URL}/servicios/${service.slug}`
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola StudyDocu, deseo información sobre ${service.shortTitle}.`
  )}`
  const related = seoServices
    .filter((item) => item.slug !== service.slug)
    .sort(
      (a, b) => Number(b.category === service.category) - Number(a.category === service.category)
    )
    .slice(0, 3)
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.description,
      url: pageUrl,
      serviceType: service.shortTitle,
      areaServed: { '@type': 'Country', name: 'Ecuador' },
      provider: { '@type': 'Organization', name: 'StudyDocu', url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: service.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Servicios', item: `${SITE_URL}/servicios` },
        { '@type': 'ListItem', position: 3, name: service.shortTitle, item: pageUrl },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#09090b] dark:text-white">
      <Script
        id={`schema-${service.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative overflow-hidden px-5 pb-20 pt-20 sm:px-8 lg:pb-24 lg:pt-28">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_22%_12%,rgba(59,130,246,.2),transparent_34%),radial-gradient(circle_at_80%_28%,rgba(139,92,246,.14),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <nav
            aria-label="Migas de pan"
            className="flex flex-wrap items-center gap-2 text-sm text-[#6e6e73] dark:text-zinc-400"
          >
            <Link href="/" className="hover:text-black dark:hover:text-white">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/servicios" className="hover:text-black dark:hover:text-white">
              Servicios
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-black dark:text-white">{service.shortTitle}</span>
          </nav>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_.68fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/[.07] bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[.07]">
                <Sparkles className="h-4 w-4 text-blue-600" /> {service.category} · Ecuador
              </span>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.03] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                {service.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6e6e73] dark:text-zinc-300">
                {service.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0071e3] px-6 font-semibold text-white transition hover:bg-[#0077ed]"
                >
                  <MessageCircle className="h-5 w-5" /> Solicitar orientación
                </a>
                <Link
                  href="/servicios"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/60 px-6 font-semibold dark:border-white/15 dark:bg-white/[.07]"
                >
                  Ver todos los servicios
                </Link>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-black/[.07] bg-white/80 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/[.06] sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                  <BookOpenCheck className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#86868b]">
                    Orientación personalizada
                  </p>
                  <h2 className="font-semibold">¿Qué puedes conseguir?</h2>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {service.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 rounded-xl bg-[#f5f5f7] p-4 dark:bg-white/[.06]"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#6e6e73] dark:text-zinc-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> Acompañamiento académico
                independiente y orientado al aprendizaje.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 dark:bg-[#0d0d0f] sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-blue-600">Cómo funciona</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Un proceso claro desde el primer contacto
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {service.process.map((step, index) => (
              <article
                key={step}
                className="rounded-[1.5rem] bg-[#f5f5f7] p-7 dark:bg-white/[.055]"
              >
                <span className="text-4xl font-semibold text-blue-200 dark:text-blue-900">
                  0{index + 1}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{step}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.7fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-violet-600">Preguntas frecuentes</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Información antes de comenzar
            </h2>
            <p className="mt-4 leading-7 text-[#6e6e73] dark:text-zinc-400">
              Si necesitas una respuesta específica para tu universidad o materia, escríbenos.
            </p>
          </div>
          <div className="space-y-3">
            {service.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-black/[.06] bg-white p-5 dark:border-white/[.08] dark:bg-white/[.055]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  <span>{item.question}</span>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-black/[.05] transition group-open:rotate-45 dark:bg-white/10">
                    +
                  </span>
                </summary>
                <p className="mt-4 border-t border-black/[.06] pt-4 leading-7 text-[#6e6e73] dark:border-white/[.08] dark:text-zinc-400">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 dark:bg-[#0d0d0f] sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-blue-600">También puede interesarte</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Servicios relacionados</h2>
            </div>
            <Link
              href="/servicios"
              className="hidden items-center gap-2 font-semibold text-blue-600 sm:inline-flex"
            >
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/servicios/${item.slug}`}
                className="group rounded-2xl bg-[#f5f5f7] p-6 transition hover:-translate-y-1 hover:shadow-lg dark:bg-white/[.055]"
              >
                <FileText className="h-6 w-6 text-blue-600" />
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#86868b]">
                  {item.category}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{item.shortTitle}</h3>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                  Ver servicio{' '}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 rounded-[2rem] bg-[#1d1d1f] px-7 py-12 text-center text-white sm:px-12 lg:flex-row lg:text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <CheckCircle2 className="h-5 w-5" /> Orientación inicial
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Cuéntanos qué necesitas y revisamos tu caso
            </h2>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-black sm:w-auto"
          >
            <MessageCircle className="h-5 w-5" /> Consultar por WhatsApp
          </a>
        </div>
      </section>
    </main>
  )
}
