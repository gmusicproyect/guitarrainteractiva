/**
 * GMUSIC COURSE DATA: GUITARRA 1 · FUNDAMENTOS
 * Canonical definition of the 7 progressive modules for the beginner roadmap.
 */

export const GUITAR_1_COURSE = {
  id: 'guitar-1-fundamentals',
  title: 'Guitarra 1 · Fundamentos',
  description: 'Aprende guitarra tocando desde el primer minuto. Reconoce, coloca, recuerda, cambia, sincroniza y toca.',
  totalSkills: 18,
  
  modules: [
    {
      id: 'mod-1',
      number: '01',
      tag: 'FUNDAMENTOS',
      title: 'Conoce tu guitarra',
      description: 'Las seis cuerdas, afinación estándar, nombres de notas al aire y postura cómoda de mano.',
      color: 'blue',
      colorHex: '#3b82f6',
      status: 'completed',
      estimatedMinutes: 20,
      skills: [
        { id: 'g1-m1-s1', name: 'Las seis cuerdas', status: 'completed' },
        { id: 'g1-m1-s2', name: 'Cuerdas al aire', status: 'completed' },
        { id: 'g1-m1-s3', name: 'Encuentra la cuerda', status: 'completed' }
      ]
    },
    {
      id: 'mod-2',
      number: '02',
      tag: 'DIAPASÓN',
      title: 'Descubre el diapasón',
      description: 'Los trastes, colocación de dedos cerca del metal, digitación limpia y tus primeras notas musicales.',
      color: 'violet',
      colorHex: '#8b5cf6',
      status: 'completed',
      estimatedMinutes: 25,
      skills: [
        { id: 'g1-m2-s1', name: 'Los trastes', status: 'completed' },
        { id: 'g1-m2-s2', name: 'Primeras posiciones', status: 'completed' },
        { id: 'g1-m2-s3', name: 'Primeras notas', status: 'completed' }
      ]
    },
    {
      id: 'mod-3',
      number: '03',
      tag: 'ACORDES BÁSICOS',
      title: 'Tus primeros acordes',
      description: 'Empieza a hacer música. Aprende las formas fundamentales que usarás en miles de canciones.',
      color: 'orange',
      colorHex: '#f97316',
      status: 'active',
      isHeroCurrent: true,
      currentLesson: {
        number: 4,
        totalLessons: 7,
        chordId: 'Am-open',
        title: 'La menor · Am',
        lead: 'Ya conoces Em y E. Ahora aprenderás La menor.',
        ctaText: 'Continuar con Am →'
      },
      estimatedMinutes: 35,
      skills: [
        { id: 'chord-Em', name: 'Em', symbol: 'Em', status: 'completed' },
        { id: 'chord-E', name: 'E', symbol: 'E', status: 'completed' },
        { id: 'chord-Am', name: 'Am', symbol: 'Am', status: 'current' },
        { id: 'chord-A', name: 'A', symbol: 'A', status: 'available' },
        { id: 'chord-C', name: 'C', symbol: 'C', status: 'available' },
        { id: 'chord-D', name: 'D', symbol: 'D', status: 'available' },
        { id: 'chord-G', name: 'G', symbol: 'G', status: 'available' }
      ]
    },
    {
      id: 'mod-4',
      number: '04',
      tag: 'TRANSICIONES',
      title: 'Cambia de acorde',
      description: 'Dedos ancla, transiciones de mínima distancia y ejercicios con temporizador.',
      color: 'yellow',
      colorHex: '#eab308',
      status: 'locked',
      estimatedMinutes: 30,
      skills: [
        { id: 'g1-m4-s1', name: 'Dedos ancla', status: 'locked' },
        { id: 'g1-m4-s2', name: 'Cambios de dos acordes', status: 'locked' },
        { id: 'g1-m4-s3', name: 'Cambios temporizados', status: 'locked' }
      ]
    },
    {
      id: 'mod-5',
      number: '05',
      tag: 'RITMO',
      title: 'Siente el pulso',
      description: 'Conteo 1-2-3-4, metrónomo interactivo, rasgueos hacia abajo y arriba, y subdivisiones.',
      color: 'green',
      colorHex: '#10b981',
      status: 'locked',
      estimatedMinutes: 30,
      skills: [
        { id: 'g1-m5-s1', name: 'Pulso y metrónomo', status: 'locked' },
        { id: 'g1-m5-s2', name: 'Rasgueos básicos', status: 'locked' },
        { id: 'g1-m5-s3', name: 'Subdivisiones', status: 'locked' }
      ]
    },
    {
      id: 'mod-6',
      number: '06',
      tag: 'ARMONÍA',
      title: 'Tus primeras progresiones',
      description: 'Combinaciones de 2, 3 y 4 acordes clásicos y grados básicos.',
      color: 'magenta',
      colorHex: '#ec4899',
      status: 'locked',
      estimatedMinutes: 40,
      skills: [
        { id: 'g1-m6-s1', name: 'Progresiones de dos acordes', status: 'locked' },
        { id: 'g1-m6-s2', name: 'Progresiones de tres acordes', status: 'locked' },
        { id: 'g1-m6-s3', name: 'Progresiones de cuatro acordes', status: 'locked' }
      ]
    },
    {
      id: 'mod-7',
      number: '07',
      tag: 'CANCIONES',
      title: 'Toca música',
      description: 'Ejercicios completos que combinan acordes, cambios y ritmo tocando acompañamientos.',
      color: 'cyan',
      colorHex: '#06b6d4',
      status: 'locked',
      estimatedMinutes: 45,
      skills: [
        { id: 'g1-m7-s1', name: 'Acompañamientos', status: 'locked' },
        { id: 'g1-m7-s2', name: 'Repertorio básico', status: 'locked' }
      ]
    }
  ]
};
