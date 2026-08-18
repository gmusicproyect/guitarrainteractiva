/**
 * GMUSIC · MÓDULO 1: CERTIFICACIÓN Y PUENTE AL MÓDULO 2
 */

export const MODULO_1_COMPLETION = {
  id: 'g1-m1-completion',
  title: '¡Módulo 1 Completado: Tu Guitarra como Instrumento!',
  totalXp: 180,
  skillsCertified: [
    {
      skillId: 'g1.m1.anatomy',
      name: 'Anatomía y partes de la guitarra',
      certified: true,
      badge: '🔍 Anatomía Dominada'
    },
    {
      skillId: 'g1.m1.tuning-pegs',
      name: 'Clavijero y tensión de afinación',
      certified: true,
      badge: '⚙️ Clavijero y Afinación'
    },
    {
      skillId: 'g1.m1.strings-open',
      name: 'Las 6 cuerdas y sus calibres',
      certified: true,
      badge: '🎯 6 Cuerdas al Aire'
    },
    {
      skillId: 'g1.m1.nut-and-frets',
      name: 'Cejuela y física de los trastes',
      certified: true,
      badge: '📐 Cejuela y Trastes'
    },
    {
      skillId: 'g1.m1.first-plucks',
      name: 'Pulsación limpia de cuerdas',
      certified: true,
      badge: '🎵 Primeras Pulsaciones'
    }
  ],
  nextModule: {
    id: 'g1-m2',
    slug: 'primeros-acordes-em-am',
    title: 'Módulo 2: Primeros acordes (Mi menor y La menor)',
    description: 'Ahora que conoces tu instrumento, colocaremos tus primeros dedos pisando trastes para formar acordes completos: Em y Am.',
    previewChords: ['Em-open', 'Am-open'],
    actionCta: 'Comenzar Módulo 2: Primeros Acordes →'
  }
};
