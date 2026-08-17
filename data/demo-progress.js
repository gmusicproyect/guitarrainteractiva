/**
 * GMUSIC DEMO PROGRESS FIXTURES (DEMO / FIXTURE ONLY)
 * Strictly identified as demonstration data.
 * Real production progress will be derived from authenticated user telemetry.
 */

export const DEMO_PROGRESS_FIXTURE = {
  isFixture: true,
  user: {
    name: 'Carlos',
    avatarLetter: 'C',
    streakDays: 3
  },
  currentCourseId: 'guitar-1-fundamentals',
  currentModuleId: 'mod-3',
  currentLesson: {
    chordId: 'Am-open',
    stepNumber: 4,
    totalSteps: 7,
    progressPercent: 40
  },
  globalCoursePercent: 62,
  completedSkillsCount: 12,
  
  // Daily Practice Session (estimated 8 min)
  todaySession: {
    totalEstimatedMinutes: 8,
    dayIndex: 3,
    totalDays: 7,
    tasks: [
      { id: 't1', name: 'Reconocimiento de cuerdas', timeEst: '1 min', status: 'completed' },
      { id: 't2', name: 'Construir Mi menor (Em)', timeEst: '2 min', status: 'completed' },
      { id: 't3', name: 'Construir La menor (Am)', timeEst: '2 min', status: 'current' },
      { id: 't4', name: 'Cambio fluido: Em ➔ Am', timeEst: '3 min', status: 'available' }
    ]
  },

  // Competency breakdown
  skillsMatrix: [
    { id: 'cuerdas', name: '🎸 Cuerdas y Afinación', percent: 100, level: 'Dominado', status: 'done', detail: '6 cuerdas al aire, nombres, grosor y tonos identificados.' },
    { id: 'notas', name: '🎵 Notas en Diapasón', percent: 70, level: 'Avanzado', status: 'high', detail: 'Trastes 1 al 5, digitación limpia y localización rápida.' },
    { id: 'acordes', name: '🤘 Acordes Abiertos', percent: 50, level: 'En progreso', status: 'mid', detail: 'Em, E dominados. Aprendiendo Am. Faltan C, G, D, A.' },
    { id: 'cambios', name: '🔄 Cambios de Acorde', percent: 20, level: 'Inicial', status: 'low', detail: 'Primeras transiciones básicas con dedos pivote.' },
    { id: 'ritmo', name: '🥁 Ritmo y Pulso', percent: 0, level: 'Por iniciar', status: 'none', detail: 'Patrones de rasgueo y precisión temporal.' },
    { id: 'progresiones', name: '🎶 Progresiones Musicales', percent: 0, level: 'Bloqueado', status: 'locked', detail: 'Desbloquea completando cambios y ritmo.' }
  ]
};
