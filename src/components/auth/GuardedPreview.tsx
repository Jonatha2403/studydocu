"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Eye } from "lucide-react";

const LOGIN_PATH = "/iniciar-sesion";   // <-- usa tus rutas reales
const REGISTER_PATH = "/registrate";

type Props = { docId: string; className?: string };

export default function GuardedPreview({ docId, className }: Props) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
  }, []);

  if (loggedIn === null) {
    return (
      <span className={className}>
        <Eye className="w-4 h-4 mr-1 inline-block animate-pulse" />
        Cargando…
      </span>
    );
  }

  if (!loggedIn) {
    const go = (path: string) => {
      const cb = encodeURIComponent(window.location.href);
      router.push(`${path}?callbackUrl=${cb}`);
    };
    return (
      <span className="flex gap-2 justify-center">
        <button onClick={() => go(LOGIN_PATH)}
                className={className}>
          <Eye className="w-4 h-4 mr-1" /> Vista previa
        </button>
        <button onClick={() => go(REGISTER_PATH)}
                className="text-[11px] underline text-muted-foreground">
          o regístrate
        </button>
      </span>
    );
  }

  // Con sesión → Link normal
  return (
    <Link href={`/vista-previa/${docId}`} className={className}>
      <Eye className="w-4 h-4 mr-1" /> Vista previa
    </Link>
  );
}
