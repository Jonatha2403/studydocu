// src/app/dashboard/perfil/usuario/[username]/page.tsx
import { notFound } from 'next/navigation'
import PerfilPublicoClient from './PerfilPublicoClient'

type Params = Promise<{ username: string }>

export default async function Page({ params }: { params: Params }) {
  const { username } = await params
  if (!username) notFound()
  return <PerfilPublicoClient username={username} />
}

// Opcional: SEO dinámico
export async function generateMetadata({ params }: { params: Params }) {
  const { username } = await params
  const u = (username ?? 'usuario').toLowerCase()
  return {
    title: `Perfil de @${u} | StudyDocu`,
    description: `Explora documentos y logros de @${u} en StudyDocu.`,
  }
}
