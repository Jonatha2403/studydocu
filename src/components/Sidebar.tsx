'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  User2,
  UploadCloud,
  LayoutDashboard,
  FileText,
  Search,
  ShieldCheck,
  LogOut
} from 'lucide-react'
import { useUserContext } from '@/context/UserContext' // ✅ FUNCIONAL
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const links = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/perfil', label: 'Mi Perfil', icon: User2 },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/subir', label: 'Subir Docs', icon: UploadCloud },
  { href: '/explorar', label: 'Explorar', icon: Search },
  { href: '/mis-favoritos', label: 'Favoritos', icon: FileText },
]

const adminLinks = [
  { href: '/admin/dashboard', label: 'Panel Admin', icon: ShieldCheck }
]

export default function Sidebar() {
  const { user, perfil, loading } = useUserContext()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) toast.error(error.message)
    else router.push('/')
  }

  if (loading) return null

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary">📘 StudyDocu</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">@{perfil?.username || user?.email}</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 text-sm">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              pathname === href
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <Icon size={18} /> {label}
          </Link>
        ))}

        {perfil?.role === 'admin' && (
          <>
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 text-xs text-gray-500 dark:text-gray-400">ADMIN</div>
            {adminLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  pathname === href
                    ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300'
                    : 'text-red-500 hover:bg-red-100 dark:hover:bg-red-800'
                }`}
              >
                <Icon size={18} /> {label}
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded-md transition-all"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
