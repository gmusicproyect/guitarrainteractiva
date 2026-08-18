/**
 * GMUSIC COURSE DATA: GUITARRA 1 · FUNDAMENTOS (5 MÓDULOS)
 * Canonical definition of the 5 progressive modules for the beginner roadmap.
 */

export const GUITAR_1_COURSE = {
  id: 'guitar-1-fundamentals',
  title: 'Guitarra 1 · Fundamentos',
  description: 'Aprende guitarra tocando desde el primer minuto. Conoce tu instrumento, forma tus primeros acordes, siente el pulso y toca tu primera progresión.',
  totalSkills: 15,
  
  modules: [
    {
      id: 'guitar1-module1',
      number: '01',
      tag: 'EL INSTRUMENTO',
      title: 'Conoce tu guitarra',
      description: 'Anatomía física, mecanismo del clavijero, las seis cuerdas al aire, la cejuela y tus primeras pulsaciones limpias.',
      color: 'blue',
      colorHex: '#3b82f6',
      status: 'active',
      isHeroCurrent: true,
      currentLesson: {
        number: 3,
        totalLessons: 5,
        folderId: '03-las-seis-cuerdas',
        title: 'Las seis cuerdas al aire',
        lead: 'Reconocimiento de cuerdas graves entorchadas y agudas lisas.',
        ctaText: 'Continuar Clase 3 →'
      },
      estimatedMinutes: 80,
      skills: [
        { id: 'g1.m1.anatomy', name: 'Anatomía', status: 'completed' },
        { id: 'g1.m1.tuning-pegs', name: 'Clavijero', status: 'completed' },
        { id: 'g1.m1.strings-open', name: '6 Cuerdas', status: 'current' },
        { id: 'g1.m1.nut-and-frets', name: 'Cejuela y Trastes', status: 'available' },
        { id: 'g1.m1.first-plucks', name: 'Pulsaciones Limpias', status: 'locked' }
      ]
    },
    {
      id: 'guitar1-module2',
      number: '02',
      tag: 'PRIMEROS ACORDES',
      title: 'Mi menor y La menor',
      description: 'Tus primeras dos formas de acorde abierto (Em y Am) y el cambio con dedo ancla.',
      color: 'orange',
      colorHex: '#f97316',
      status: 'locked',
      estimatedMinutes: 60,
      skills: [
        { id: 'g1.m2.em', name: 'Acorde Em', status: 'locked' },
        { id: 'g1.m2.am', name: 'Acorde Am', status: 'locked' },
        { id: 'g1.m2.trans-em-am', name: 'Cambio Em ➔ Am', status: 'locked' }
      ]
    },
    {
      id: 'guitar1-module3',
      number: '03',
      tag: 'ACORDES MAYORES',
      title: 'Do, Sol y Re mayor',
      description: 'Expande tu vocabulario armónico con los tres acordes abiertos más usados en guitarra.',
      color: 'yellow',
      colorHex: '#eab308',
      status: 'locked',
      estimatedMinutes: 75,
      skills: [
        { id: 'g1.m3.c', name: 'Acorde C', status: 'locked' },
        { id: 'g1.m3.g', name: 'Acorde G', status: 'locked' },
        { id: 'g1.m3.d', name: 'Acorde D', status: 'locked' }
      ]
    },
    {
      id: 'guitar1-module4',
      number: '04',
      tag: 'RITMO Y PULSO',
      title: 'El pulso y rasgueos a 60 BPM',
      description: 'Conteo 1-2-3-4 con metrónomo, rasgueos hacia abajo y cambios a tiempo sin detener la mano rítmica.',
      color: 'green',
      colorHex: '#10b981',
      status: 'locked',
      estimatedMinutes: 60,
      skills: [
        { id: 'g1.m4.metronomo', name: 'Pulso a 60 BPM', status: 'locked' },
        { id: 'g1.m4.strum-down', name: 'Rasgueo continuo', status: 'locked' },
        { id: 'g1.m4.sync', name: 'Sincronía rítmica', status: 'locked' }
      ]
    },
    {
      id: 'guitar1-module5',
      number: '05',
      tag: 'PROGRESIONES Y CANCIÓN',
      title: 'Progresiones y Riff final',
      description: 'Integración de las habilidades en una progresión musical real y certificación del nivel Guitarra 1.',
      color: 'cyan',
      colorHex: '#06b6d4',
      status: 'locked',
      estimatedMinutes: 90,
      skills: [
        { id: 'g1.m5.prog-1', name: 'Progresión Em-Am', status: 'locked' },
        { id: 'g1.m5.prog-2', name: 'Progresión C-G-D', status: 'locked' },
        { id: 'g1.m5.capstone', name: 'Riff Destino Final', status: 'locked' }
      ]
    }
  ]
};
