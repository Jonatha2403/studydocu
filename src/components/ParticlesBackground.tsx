'use client';

import { useCallback, useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadBasic } from '@tsparticles/basic';
import type { Container } from '@tsparticles/engine';

interface Props {
  className?: string;
}

export default function ParticlesBackground({ className }: Props) {
  const [isDark, setIsDark] = useState(false);
  const [engineReady, setEngineReady] = useState(false);

  // Inicializa engine (v3)
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadBasic(engine);
    }).then(() => setEngineReady(true));
  }, []);

  // Modo oscuro dinámico
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const particlesLoaded = useCallback(async (_container?: Container) => {
    // opcional
  }, []);

  return (
    <div className={`fixed inset-0 -z-10 pointer-events-none ${className ?? ''}`}>
      {/* Fondo degradado */}
      <div
        className={`absolute inset-0 w-full h-full animate-gradient bg-[length:300%_300%] transition-colors duration-1000 ease-in-out ${
          isDark
            ? 'bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]'
            : 'bg-gradient-to-br from-[#f0f9ff] via-[#e0e7ff] to-[#f5d0fe]'
        }`}
      />

      {/* Partículas */}
      {engineReady && (
        <Particles
          id="tsparticles"
          className="absolute inset-0"
          particlesLoaded={particlesLoaded}
          options={{
            fullScreen: { enable: false },
            background: { color: { value: 'transparent' } },
            fpsLimit: 60,
            detectRetina: true,
            particles: {
              number: {
                value: 70,
                density: {
                  enable: true,
                  // ⬇️ reemplazo de "area"
                  width: 900,
                  height: 900,
                },
              },
              color: {
                value: isDark
                  ? ['#ffffff', '#a5b4fc', '#818cf8']
                  : ['#7b68ee', '#6366f1', '#a78bfa'],
              },
              opacity: {
                // ⬇️ rango en value en lugar de minimumValue en animation
                value: { min: 0.05, max: 0.12 },
                animation: {
                  enable: true,
                  speed: 0.5,
                  // startValue: 'random', // opcional
                },
              },
              size: {
                // ⬇️ rango en value; sin minimumValue
                value: { min: 1, max: 2 },
                animation: {
                  enable: true,
                  speed: 1,
                  // startValue: 'random', // opcional
                },
              },
              move: {
                enable: true,
                speed: 0.4,
                direction: 'none',
                outModes: { default: 'out' },
              },
              links: { enable: false },
            },
          }}
        />
      )}
    </div>
  );
}
