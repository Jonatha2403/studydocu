'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import BodyLayout from './BodyLayout';

/**
 * Wrapper que:
 * - aplica animaciones suaves entre rutas (excepto en dashboard/admin)
 * - asegura scroll al tope en cada cambio
 */
export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard =
    pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  // 🔝 Restablece scroll al cambiar de página
  useEffect(() => {
    if (!isDashboard) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, isDashboard]);

  // ✨ Si es dashboard, se renderiza sin efectos visuales
  if (isDashboard) return <>{children}</>;

  // 💫 Animación global entre rutas normales
  return (
    <BodyLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="min-h-screen will-change-transform"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </BodyLayout>
  );
}
