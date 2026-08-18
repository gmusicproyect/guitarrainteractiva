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
  currentCourseId: 'guitarra-1',
  currentModuleId: 'guitar1-module1',
  currentLesson: {
    folderId: '03-las-seis-cuerdas',
    title: 'Las seis cuerdas (Calibres y alturas)',
    subtitle: 'Reconocimiento de cuerdas graves entorchadas y agudas lisas',
    stepNumber: 3,
    totalSteps: 5,
    progressPercent: 60
  },
  globalCoursePercent: 20,
  completedSkillsCount: 2,
  
  // Daily Practice Session (estimated 6 min)
  todaySession: {
    totalEstimatedMinutes: 6,
    dayIndex: 3,
    totalDays: 5,
    tasks: [
      { id: 't1', name: 'Anatomía de la guitarra', timeEst: '1 min', status: 'completed' },
      { id: 't2', name: 'El clavijero y la afinación', timeEst: '2 min', status: 'completed' },
      { id: 't3', name: 'Las seis cuerdas al aire', timeEst: '2 min', status: 'current' },
      { id: 't4', name: 'La cejuela y los trastes', timeEst: '2 min', status: 'available' },
      { id: 't5', name: 'Primeras pulsaciones limpias', timeEst: '2 min', status: 'locked' }
    ]
  },

  // Competency breakdown for Module 1 (El Instrumento)
  skillsMatrix: [
    { id: 'anatomia', name: '🔍 Anatomía de la guitarra', percent: 100, level: 'Dominado', status: 'done', detail: 'Pala, clavijero, cejuela, mástil, trastes, cuerpo, boca y puente.' },
    { id: 'clavijero', name: '⚙️ Clavijero y afinación', percent: 100, level: 'Dominado', status: 'done', detail: 'Tensión de cuerdas, afinación estándar y correspondencia de clavijas.' },
    { id: 'cuerdas', name: '🎸 Las seis cuerdas', percent: 60, level: 'En curso', status: 'mid', detail: 'Calibres entorchados (graves) vs lisos (agudos), notas Mi a Mi.' },
    { id: 'trastes', name: '📐 Cejuela y trastes', percent: 0, level: 'Por iniciar', status: 'none', detail: 'Traste 0 al aire vs longitud de cuerda acortada.' },
    { id: 'pulsaciones', name: '🎵 Primeras pulsaciones', percent: 0, level: 'Bloqueado', status: 'locked', detail: 'Pulsación limpia de 6 cuerdas al aire a 60 BPM.' }
  ]
};
