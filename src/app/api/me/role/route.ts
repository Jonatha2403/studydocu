import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = await supabaseServer()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth?.user) return NextResponse.json({ role: null }, { status: 401 })

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', auth.user.id)
    .maybeSingle()

  if (error) return NextResponse.json({ role: null }, { status: 500 })
  return NextResponse.json({ role: data?.role ?? null })
}
