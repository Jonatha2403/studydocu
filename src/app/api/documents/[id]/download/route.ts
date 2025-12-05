import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const { error } = await supabase.rpc("increment_downloads", { doc_id: id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
