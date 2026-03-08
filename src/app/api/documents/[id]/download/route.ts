import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const FREE_DOWNLOAD_LIMIT = 2
const POINTS_PER_DOWNLOAD = 15

type RouteParams = { id: string } | Promise<{ id: string }>

export async function POST(_: Request, context: { params: RouteParams }) {
  const resolvedParams = await context.params
  const id = resolvedParams?.id
  if (!id) return NextResponse.json({ error: 'ID de documento inválido.' }, { status: 400 })

  try {
    const supabase = await supabaseServer()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para descargar.' }, { status: 401 })
    }

    const { data: doc, error: docError } = await supabaseAdmin
      .from('documents')
      .select('id, user_id, approved')
      .eq('id', id)
      .maybeSingle()

    if (docError || !doc) {
      return NextResponse.json({ error: 'Documento no encontrado.' }, { status: 404 })
    }

    if (!doc.approved) {
      return NextResponse.json(
        { error: 'Este documento aún no está aprobado para descarga.' },
        { status: 403 }
      )
    }

    let accessMode: 'owner' | 'premium' | 'free' | 'contributor' | 'points' = 'owner'
    let remainingFreeDownloads: number | null = null
    let pointsCharged = 0
    let remainingPoints: number | null = null

    const isOwner = doc.user_id === user.id
    if (!isOwner) {
      let profile: {
        subscription_active?: boolean | null
        free_downloads_used?: number | null
        points?: number | null
      } | null = null
      let hasFreeCounterColumn = true

      const { data: profileWithCounter, error: profileWithCounterError } = await supabaseAdmin
        .from('profiles')
        .select('subscription_active, free_downloads_used, points')
        .eq('id', user.id)
        .maybeSingle()

      if (profileWithCounterError && profileWithCounterError.code === '42703') {
        hasFreeCounterColumn = false
        const { data: profileWithoutCounter, error: profileWithoutCounterError } =
          await supabaseAdmin
            .from('profiles')
            .select('subscription_active, points')
            .eq('id', user.id)
            .maybeSingle()
        if (profileWithoutCounterError) {
          return NextResponse.json(
            { error: `No se pudo validar tu perfil: ${profileWithoutCounterError.message}` },
            { status: 500 }
          )
        }
        profile = {
          ...profileWithoutCounter,
          free_downloads_used: 0,
        }
      } else {
        if (profileWithCounterError) {
          return NextResponse.json(
            { error: `No se pudo validar tu perfil: ${profileWithCounterError.message}` },
            { status: 500 }
          )
        }
        profile = profileWithCounter as typeof profile
      }

      if (!profile) {
        return NextResponse.json({ error: 'No se encontró tu perfil.' }, { status: 404 })
      }

      if (profile.subscription_active) {
        accessMode = 'premium'
      } else {
        const freeUsed = Number(profile.free_downloads_used ?? 0)
        const points = Number(profile.points ?? 0)

        if (hasFreeCounterColumn && freeUsed < FREE_DOWNLOAD_LIMIT) {
          const nextFreeUsed = freeUsed + 1
          const { error: freeUpdateError } = await supabaseAdmin
            .from('profiles')
            .update({ free_downloads_used: nextFreeUsed })
            .eq('id', user.id)

          if (freeUpdateError) {
            return NextResponse.json(
              { error: `No se pudo registrar tu descarga gratis: ${freeUpdateError.message}` },
              { status: 500 }
            )
          }
          accessMode = 'free'
          remainingFreeDownloads = Math.max(0, FREE_DOWNLOAD_LIMIT - nextFreeUsed)
        } else if (points >= POINTS_PER_DOWNLOAD) {
          const nextPoints = points - POINTS_PER_DOWNLOAD
          const { error: pointsError } = await supabaseAdmin
            .from('profiles')
            .update({ points: nextPoints })
            .eq('id', user.id)

          if (pointsError) {
            return NextResponse.json(
              { error: `No se pudieron descontar puntos: ${pointsError.message}` },
              { status: 500 }
            )
          }

          accessMode = 'points'
          pointsCharged = POINTS_PER_DOWNLOAD
          remainingPoints = nextPoints
        } else {
          const { count: approvedOwnedCount, error: approvedOwnedError } = await supabaseAdmin
            .from('documents')
            .select('id', { head: true, count: 'exact' })
            .eq('user_id', user.id)
            .eq('approved', true)

          if (approvedOwnedError) {
            return NextResponse.json(
              {
                error: `No se pudo validar tus documentos aprobados: ${approvedOwnedError.message}`,
              },
              { status: 500 }
            )
          }

          if (Number(approvedOwnedCount ?? 0) > 0) {
            accessMode = 'contributor'
          } else {
            return NextResponse.json(
              {
                error: `Ya usaste tus 2 descargas gratis y no tienes puntos suficientes. Necesitas ${POINTS_PER_DOWNLOAD} puntos, subir un documento aprobado o activar Premium.`,
              },
              { status: 402 }
            )
          }
        }
      }
    }

    const { data: currentDoc, error: currentDocError } = await supabaseAdmin
      .from('documents')
      .select('download_count')
      .eq('id', id)
      .maybeSingle()

    if (currentDocError || !currentDoc) {
      return NextResponse.json(
        { error: currentDocError?.message || 'No se pudo leer el contador de descargas.' },
        { status: 400 }
      )
    }

    const nextDownloadCount = Number(currentDoc.download_count ?? 0) + 1
    const { error: updateError } = await supabaseAdmin
      .from('documents')
      .update({ download_count: nextDownloadCount })
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      accessMode,
      remainingFreeDownloads,
      pointsCharged,
      remainingPoints,
      pointsPerDownload: POINTS_PER_DOWNLOAD,
      freeDownloadLimit: FREE_DOWNLOAD_LIMIT,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Error inesperado al descargar.' },
      { status: 500 }
    )
  }
}
