// src/app/vista-previa/[id]/page.tsx

import VistaPreviaClient from './VistaPreviaClient'

interface PageProps {
  params:
    | {
        id: string
      }
    | Promise<{
        id: string
      }>
}

export default async function VistaPreviaPage({ params }: PageProps) {
  const resolvedParams = await params
  // 👇 Sin auth en el servidor, sin redirect.
  //    La lógica de usuario (favoritos, comentarios, etc.)
  //    ya la maneja VistaPreviaClient con useUserContext.
  return <VistaPreviaClient id={resolvedParams?.id ?? ''} />
}
