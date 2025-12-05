// src/components/Spotlight.tsx
'use client';
import { useEffect, useRef } from 'react';

export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      el.style.background = `radial-gradient(220px 220px at ${x}px ${y}px, rgba(255,255,255,0.12), transparent 60%)`;
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return <div ref={ref} className="pointer-events-none fixed inset-0 -z-10" />;
}
