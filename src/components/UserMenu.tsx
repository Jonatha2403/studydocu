'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase' // Asegúrate que la ruta sea correcta

// RECOMENDACIÓN: Mover UserProfile a un archivo de tipos compartido (ej. /types/index.ts)
// e importarlo aquí y en Navbar.tsx para evitar dependencias directas o duplicación.
import { UserProfile } from './layouts/Navbar' 
// Ejemplo de cómo sería si estuviera en /types:
// import type { UserProfile } from '@/types'; 

import { 
  LogOut, Settings, UserCircle as ProfileIcon, ChevronDown, 
  Loader2, ShieldCheck 
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'


interface UserMenuProps {
  userProfile: UserProfile | null;
  loading?: boolean;
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

export default function UserMenu({ userProfile, loading, isMobile, closeMobileMenu }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null); // Ref para el contenedor del menú (dropdown y botón)

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleItemClick = () => {
    setIsOpen(false); // Cierra el dropdown de escritorio
    if (isMobile && closeMobileMenu) {
      closeMobileMenu(); // Cierra el menú móvil general
    }
  };

  const handleLogout = async () => {
    handleItemClick(); // Cierra menús
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('✅ Sesión cerrada correctamente.');
      router.push('/'); // Redirige al inicio
      router.refresh(); // Fuerza la recarga de datos del servidor y reevaluación de middleware
    } catch (error: any) {
      toast.error('❌ Error al cerrar sesión: ' + error.message);
      console.error("Logout error:", error);
    }
  };

  // Cerrar dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen && !isMobile) { // Solo aplicar para el dropdown de escritorio
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMobile]);

  if (loading) {
    return (
      <div className={`p-2 ${isMobile ? 'flex items-center justify-start w-full px-3' : 'flex items-center'}`}>
        <Loader2 className="w-6 h-6 animate-spin text-gray-500 dark:text-gray-400" />
        {isMobile && <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Cargando...</span>}
      </div>
    );
  }

  if (!userProfile) {
    return null; 
  }

  const menuItems = [
    { label: 'Mi Perfil', href: '/perfil', icon: ProfileIcon },
    { label: 'Configuración', href: '/configuracion', icon: Settings },
    ...(userProfile.role === 'admin' ? [{ 
        label: 'Panel Admin', 
        href: '/admin/dashboard', 
        icon: ShieldCheck, 
        className: 'text-red-600 dark:text-red-400 hover:!bg-red-50 dark:hover:!bg-red-900/30' 
    }] : []),
  ];

  // Contenido del botón que abre el dropdown o se muestra en móvil
  const triggerOrMobileHeaderContent = (
    <>
      {userProfile.avatar_url ? (
        <Image 
          src={userProfile.avatar_url} 
          alt={userProfile.username || "Avatar"} 
          width={isMobile ? 28 : 32} 
          height={isMobile ? 28 : 32} 
          className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" 
        />
      ) : (
        <ProfileIcon size={isMobile ? 28 : 32} className="text-gray-500 dark:text-gray-400" />
      )}
      <span className={`text-sm font-medium text-gray-700 dark:text-gray-300 ml-2 ${isMobile ? '' : 'hidden lg:block'}`}>
        {userProfile.username || 'Usuario'}
      </span>
      {!isMobile && <ChevronDown size={16} className={`ml-1 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
    </>
  );

  if (isMobile) {
    // En móvil, renderizar directamente los enlaces y el botón de logout dentro del panel del menú móvil principal
    return (
      <div className="px-2 py-1 space-y-1">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-gray-200 dark:border-gray-700">
          {triggerOrMobileHeaderContent}
        </div>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            // Esto llamará a closeMobileMenu
            onClick={handleItemClick}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${item.className || ''}`}
            legacyBehavior>
            <item.icon size={18} className={item.className ? 'opacity-80' : 'text-gray-500 dark:text-gray-400'} />
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout} // handleLogout ya llama a handleItemClick
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 w-full transition-colors"
        >
          <LogOut size={18} className="opacity-80" />
          Cerrar Sesión
        </button>
      </div>
    );
  }

  // En escritorio, renderizar como un dropdown
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleOpen}
        type="button"
        id="user-menu-button" // ID para aria-labelledby
        className="flex items-center p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 focus-visible:ring-blue-500 dark:focus-visible:ring-yellow-500 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="sr-only">Abrir menú de usuario</span>
        {triggerOrMobileHeaderContent}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.1 } }} // Transición de salida más rápida
            transition={{ duration: 0.15, ease: "easeOut" }} // Transición de entrada más rápida
            className="origin-top-right absolute right-0 mt-2 w-60 rounded-md shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-50"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button" // Corresponde al ID del botón
          >
            <div className="py-1" role="none">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {userProfile.username || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                  Rol: {userProfile.role || 'user'}
                </p>
              </div>
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleItemClick}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${item.className || ''}`}
                  role="menuitem"
                  legacyBehavior>
                  <item.icon size={16} className={item.className ? 'opacity-80' : 'text-gray-500 dark:text-gray-400'} />
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                role="menuitem"
              >
                <LogOut size={16} className="opacity-80" />
                Cerrar Sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}