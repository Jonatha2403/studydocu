// Definimos una interfaz para el objeto que devuelve la función
export interface NivelInfo {
  nivel: string;
  medalla: string;
  color: string; // Clase de Tailwind CSS para el color
  next: number | null; // Puntos necesarios para el siguiente nivel, o null si es el máximo
}

// Array con la definición de los niveles, ordenados de mayor a menor puntuación mínima
const NIVELES_DEFINIDOS: Array<{
  minPuntos: number;
  nivel: string;
  medalla: string;
  color: string;
  next: number | null;
}> = [
  { minPuntos: 500, nivel: 'Maestro Estelar', medalla: '🌟 Estrella Dorada', color: 'text-yellow-500 dark:text-yellow-400', next: null }, // Nivel más alto
  { minPuntos: 350, nivel: 'Experto Consagrado', medalla: '🏆 Trofeo Brillante', color: 'text-amber-600 dark:text-amber-500', next: 500 },
  { minPuntos: 200, nivel: 'Avanzado Pro', medalla: '🥈 Medalla de Plata', color: 'text-slate-500 dark:text-slate-400', next: 350 },
  { minPuntos: 100, nivel: 'Explorador Ágil', medalla: '🥉 Medalla de Bronce', color: 'text-orange-500 dark:text-orange-400', next: 200 },
  { minPuntos: 50,  nivel: 'Aprendiz Dedicado', medalla: '📜 Pergamino', color: 'text-lime-600 dark:text-lime-500', next: 100 },
  { minPuntos: 10,  nivel: 'Iniciado Curioso', medalla: '💡 Bombilla', color: 'text-sky-500 dark:text-sky-400', next: 50 },
  { minPuntos: 0,   nivel: 'Novato Entusiasta', medalla: '🎓 Birrete de Novato', color: 'text-indigo-500 dark:text-indigo-400', next: 10 }, // Nivel base
];

/**
 * Determina el nivel, medalla, color y puntos para el siguiente nivel
 * basado en los puntos actuales del usuario.
 * @param points Los puntos actuales del usuario (por defecto 0).
 * @returns Un objeto NivelInfo con los detalles del nivel.
 */
export function getNivelYMedalla(points: number = 0): NivelInfo {
  // Asegurarse de que los puntos no sean negativos para la lógica de búsqueda
  const currentPoints = Math.max(0, points);

  for (const nivelDef of NIVELES_DEFINIDOS) {
    if (currentPoints >= nivelDef.minPuntos) {
      return {
        nivel: nivelDef.nivel,
        medalla: nivelDef.medalla,
        color: nivelDef.color,
        next: nivelDef.next,
      };
    }
  }

  // Fallback: Aunque la lógica anterior debería cubrir todos los casos >= 0
  // si NIVELES_DEFINIDOS está bien configurado con un minPuntos: 0,
  // este es un seguro o para casos inesperados.
  const ultimoNivel = NIVELES_DEFINIDOS[NIVELES_DEFINIDOS.length - 1];
  return {
    nivel: ultimoNivel.nivel,
    medalla: ultimoNivel.medalla,
    color: ultimoNivel.color,
    next: ultimoNivel.next,
  };
}

// Ejemplo de uso (puedes probarlo en tu consola o en un componente):
// console.log(getNivelYMedalla(0));    // Novato Entusiasta
// console.log(getNivelYMedalla(15));   // Iniciado Curioso
// console.log(getNivelYMedalla(75));   // Aprendiz Dedicado
// console.log(getNivelYMedalla(150));  // Explorador Ágil
// console.log(getNivelYMedalla(250));  // Avanzado Pro
// console.log(getNivelYMedalla(400));  // Experto Consagrado
// console.log(getNivelYMedalla(500));  // Maestro Estelar
// console.log(getNivelYMedalla(1000)); // Maestro Estelar