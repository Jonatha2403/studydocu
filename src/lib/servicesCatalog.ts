export type SeoService = {
  slug: string
  title: string
  shortTitle: string
  description: string
  category: 'Escritura' | 'Plataformas' | 'Diseño'
  keywords: string[]
  benefits: string[]
  process: string[]
  faq: { question: string; answer: string }[]
}

export const seoServices: SeoService[] = [
  {
    slug: 'ensayos-academicos',
    title: 'Orientación para ensayos académicos en Ecuador',
    shortTitle: 'Ensayos académicos',
    description:
      'Orientación para estructurar ensayos universitarios, desarrollar argumentos y aplicar citas y referencias académicas correctamente.',
    category: 'Escritura',
    keywords: [
      'ensayos académicos Ecuador',
      'ayuda para ensayo universitario',
      'cómo hacer un ensayo académico',
      'estructura de ensayo universitario',
    ],
    benefits: [
      'Estructura académica clara',
      'Argumentación coherente',
      'Orientación en citas y fuentes',
    ],
    process: [
      'Revisamos el tema y las instrucciones',
      'Organizamos una estructura',
      'Orientamos el desarrollo y la revisión',
    ],
    faq: [
      {
        question: '¿Cómo se estructura un ensayo académico?',
        answer:
          'Normalmente incluye introducción, desarrollo argumentativo, conclusiones y referencias. La estructura exacta puede cambiar según la asignatura y las indicaciones del docente.',
      },
      {
        question: '¿Pueden orientarme con las citas?',
        answer:
          'Sí. Revisamos la integración de fuentes y la aplicación del estilo de citación solicitado.',
      },
    ],
  },
  {
    slug: 'resumenes-academicos',
    title: 'Resúmenes académicos claros y estructurados',
    shortTitle: 'Resúmenes académicos',
    description:
      'Orientación para resumir libros, artículos, clases y documentos universitarios conservando las ideas más importantes.',
    category: 'Escritura',
    keywords: [
      'resúmenes académicos',
      'resumir textos universitarios',
      'resumen de documentos',
      'ayuda para hacer un resumen',
    ],
    benefits: [
      'Ideas principales identificadas',
      'Contenido más fácil de estudiar',
      'Estructura breve y comprensible',
    ],
    process: [
      'Definimos el objetivo del resumen',
      'Identificamos conceptos centrales',
      'Organizamos una síntesis coherente',
    ],
    faq: [
      {
        question: '¿Qué documentos se pueden resumir?',
        answer:
          'Podemos orientar el resumen de artículos, capítulos, apuntes, guías y otros materiales académicos.',
      },
      {
        question: '¿Un resumen reemplaza la lectura original?',
        answer:
          'No. El resumen sirve como apoyo de estudio y debe utilizarse junto con el material original cuando sea necesario.',
      },
    ],
  },
  {
    slug: 'normas-apa',
    title: 'Revisión de normas APA para trabajos universitarios',
    shortTitle: 'Revisión de normas APA',
    description:
      'Revisión de citas, referencias y presentación general de trabajos académicos de acuerdo con normas APA.',
    category: 'Escritura',
    keywords: [
      'normas APA Ecuador',
      'revisión formato APA',
      'corregir citas APA',
      'referencias APA universidad',
    ],
    benefits: ['Citas revisadas', 'Referencias consistentes', 'Presentación académica ordenada'],
    process: [
      'Revisamos las instrucciones',
      'Comprobamos citas y referencias',
      'Indicamos correcciones de formato',
    ],
    faq: [
      {
        question: '¿Qué aspectos de APA se revisan?',
        answer:
          'Se pueden revisar citas dentro del texto, lista de referencias, encabezados, tablas y otros elementos solicitados por la institución.',
      },
      {
        question: '¿Trabajan con la séptima edición?',
        answer:
          'Sí, cuando las instrucciones académicas solicitan APA séptima edición. Siempre verificamos primero los requisitos recibidos.',
      },
    ],
  },
  {
    slug: 'orientacion-tareas-universitarias',
    title: 'Orientación para tareas universitarias',
    shortTitle: 'Orientación para tareas',
    description:
      'Acompañamiento para comprender instrucciones, organizar actividades y resolver dudas en tareas universitarias.',
    category: 'Escritura',
    keywords: [
      'ayuda tareas universitarias',
      'orientación académica Ecuador',
      'tareas universidad',
      'asesoría para deberes universitarios',
    ],
    benefits: [
      'Instrucciones más claras',
      'Resolución explicada',
      'Mejor organización del trabajo',
    ],
    process: [
      'Analizamos la consigna',
      'Identificamos los pasos',
      'Resolvemos dudas y revisamos el avance',
    ],
    faq: [
      {
        question: '¿La orientación es para cualquier carrera?',
        answer:
          'Revisamos cada caso según la materia, el nivel y la disponibilidad de un orientador adecuado.',
      },
      {
        question: '¿Me explican cómo resolver la actividad?',
        answer:
          'Sí. El enfoque es ayudarte a comprender la consigna y el procedimiento para que puedas desarrollar tu aprendizaje.',
      },
    ],
  },
  {
    slug: 'programacion-python-universidad',
    title: 'Orientación en programación Python para universitarios',
    shortTitle: 'Programación Python',
    description:
      'Apoyo académico para comprender lógica, algoritmos y ejercicios básicos de programación con Python.',
    category: 'Plataformas',
    keywords: [
      'ayuda Python universidad',
      'programación Python UTPL',
      'ejercicios Python universitarios',
      'clases Python Ecuador',
    ],
    benefits: ['Lógica explicada paso a paso', 'Revisión de ejercicios', 'Fundamentos aplicados'],
    process: [
      'Revisamos el ejercicio',
      'Explicamos la lógica',
      'Probamos y corregimos la solución',
    ],
    faq: [
      {
        question: '¿Ayudan con ejercicios de Python?',
        answer:
          'Sí, mediante orientación sobre la lógica, la sintaxis y la forma de comprobar el resultado.',
      },
      {
        question: '¿Necesito conocimientos previos?',
        answer:
          'No necesariamente. La orientación puede adaptarse a estudiantes que están comenzando.',
      },
    ],
  },
  {
    slug: 'plataformas-universitarias',
    title: 'Orientación para plataformas universitarias',
    shortTitle: 'Plataformas universitarias',
    description:
      'Acompañamiento para organizar actividades, comprender instrucciones y utilizar entornos académicos virtuales.',
    category: 'Plataformas',
    keywords: [
      'plataformas universitarias Ecuador',
      'ayuda plataforma UTPL',
      'actividades virtuales universidad',
      'aula virtual universidad',
    ],
    benefits: [
      'Actividades organizadas',
      'Fechas y requisitos claros',
      'Orientación en el entorno virtual',
    ],
    process: [
      'Identificamos la plataforma y necesidad',
      'Organizamos actividades pendientes',
      'Orientamos cada paso permitido',
    ],
    faq: [
      {
        question: '¿Trabajan con plataformas de distintas universidades?',
        answer:
          'Sí, podemos revisar necesidades de diferentes entornos universitarios, según su funcionamiento y reglas.',
      },
      {
        question: '¿Realizan evaluaciones por el estudiante?',
        answer:
          'No. Brindamos orientación académica; las evaluaciones personales deben ser rendidas por cada estudiante.',
      },
    ],
  },
  {
    slug: 'asesorias-academicas-online',
    title: 'Asesorías académicas online por videollamada',
    shortTitle: 'Asesorías por videollamada',
    description:
      'Sesiones académicas personalizadas para resolver dudas, revisar avances y organizar un plan de trabajo.',
    category: 'Plataformas',
    keywords: [
      'asesorías académicas online',
      'clases particulares universidad Ecuador',
      'asesoría por Zoom',
      'tutoría universitaria online',
    ],
    benefits: ['Atención personalizada', 'Dudas resueltas en directo', 'Plan de siguientes pasos'],
    process: [
      'Cuéntanos el tema',
      'Coordinamos disponibilidad',
      'Realizamos la sesión y definimos próximos pasos',
    ],
    faq: [
      {
        question: '¿Cómo se realiza la asesoría?',
        answer:
          'La modalidad y herramienta de videollamada se coordinan al confirmar la disponibilidad.',
      },
      {
        question: '¿Cuánto dura una sesión?',
        answer:
          'La duración depende del tema y del alcance. Te indicaremos las opciones antes de confirmar.',
      },
    ],
  },
  {
    slug: 'mapas-conceptuales',
    title: 'Mapas conceptuales para estudiar y exponer',
    shortTitle: 'Mapas conceptuales',
    description:
      'Orientación y diseño de mapas conceptuales para organizar información académica de manera visual.',
    category: 'Diseño',
    keywords: [
      'mapas conceptuales universitarios',
      'diseño mapa conceptual',
      'mapa conceptual para exposición',
      'organizador gráfico universidad',
    ],
    benefits: ['Jerarquía visual clara', 'Conceptos relacionados', 'Material útil para repasar'],
    process: [
      'Revisamos el contenido',
      'Definimos conceptos y relaciones',
      'Organizamos la estructura visual',
    ],
    faq: [
      {
        question: '¿Qué información necesitan?',
        answer: 'Necesitamos el tema, el material base y las instrucciones de formato o extensión.',
      },
      {
        question: '¿Sirve para una exposición?',
        answer:
          'Sí. Puede organizarse para apoyar una exposición o para facilitar el repaso de una materia.',
      },
    ],
  },
  {
    slug: 'presentaciones-universitarias',
    title: 'Presentaciones universitarias profesionales',
    shortTitle: 'Presentaciones profesionales',
    description:
      'Orientación y diseño de presentaciones académicas claras, visuales y organizadas para exposiciones universitarias.',
    category: 'Diseño',
    keywords: [
      'presentaciones universitarias',
      'diapositivas PowerPoint profesionales',
      'diseño presentación académica',
      'presentación para exposición',
    ],
    benefits: [
      'Diapositivas ordenadas',
      'Jerarquía visual profesional',
      'Contenido preparado para exponer',
    ],
    process: [
      'Definimos objetivo y audiencia',
      'Organizamos el contenido',
      'Diseñamos una secuencia visual coherente',
    ],
    faq: [
      {
        question: '¿Pueden organizar una exposición desde un documento?',
        answer:
          'Sí. Revisamos el material base para proponer una secuencia de diapositivas clara y coherente.',
      },
      {
        question: '¿Las presentaciones incluyen referencias?',
        answer: 'Pueden incluirse cuando el trabajo y las instrucciones académicas lo requieran.',
      },
    ],
  },
]

export const getSeoService = (slug: string) => seoServices.find((service) => service.slug === slug)
