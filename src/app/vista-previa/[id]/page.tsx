// src/app/vista-previa/[id]/page.tsx

import VistaPreviaClient from './VistaPreviaClient'

interface PageProps {
  params: {
    id: string
  }
}

export default function VistaPreviaPage({ params }: PageProps) {
  // 👇 Sin auth en el servidor, sin redirect.
  //    La lógica de usuario (favoritos, comentarios, etc.)
  //    ya la maneja VistaPreviaClient con useUserContext.
  return <VistaPreviaClient id={params.id} />
}
