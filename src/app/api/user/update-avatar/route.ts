import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

function sanitizeAvatarUrl(value: unknown) {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  return raw.split('?')[0]
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseServer()
    const { data: authData, error: authErr } = await supabase.auth.getUser()
    if (authErr || !authData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const avatarUrl = sanitizeAvatarUrl(body?.avatar_url)
    if (!avatarUrl) {
      return NextResponse.json({ error: 'Falta avatar_url' }, { status: 400 })
    }

    if (!avatarUrl.startsWith('/avatars/lottie/') && !avatarUrl.includes('/storage/v1/object/')) {
      return NextResponse.json({ error: 'URL de avatar no permitida' }, { status: 400 })
    }

    const { error: updateErr } = await supabaseAdmin
      .from('profiles')
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq('id', authData.user.id)

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, avatar_url: avatarUrl })
  } catch (e) {
    console.error('update-avatar error', e)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
