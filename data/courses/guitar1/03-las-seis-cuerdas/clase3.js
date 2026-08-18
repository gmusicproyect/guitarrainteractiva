/**
 * GMUSIC · MÓDULO 1 (EL INSTRUMENTO) · CLASE 3: LAS SEIS CUERDAS
 * Habilidad: g1.m1.strings-open
 * "Reconoce las 6 cuerdas al aire de grave a aguda por su calibre, afinación y nombre tradicional / cifrado."
 */

export const CLASE_3_CUERDAS = {
  id: 'g1-m1-c3',
  slug: 'las-seis-cuerdas',
  numero: 3,
  titulo: 'Las seis cuerdas (Calibres y alturas)',
  skillId: 'g1.m1.strings-open',
  skillName: 'Reconocimiento de cuerdas y calibres',
  color: '#fbbf24', // Amber
  xpTotal: 35,
  explicacion: 'Las 6 cuerdas tienen grosores distintos. Las tres superiores (6ª, 5ª, 4ª) son gruesas y entorchadas (graves). Las tres inferiores (3ª, 2ª, 1ª) son finas y lisas (agudas).',

  gruposCuerdas: {
    graves: {
      nombre: 'Cuerdas Graves (Entorchadas)',
      cuerdas: ['6ª Mi (E2)', '5ª La (A2)', '4ª Re (D3)'],
      caracteristica: 'Sonido profundo y cuerpo metálico con entorchado.'
    },
    agudas: {
      nombre: 'Cuerdas Agudas (Lisas)',
      cuerdas: ['3ª Sol (G3)', '2ª Si (B3)', '1ª Mi (E4)'],
      caracteristica: 'Sonido brillante, fino y melódico.'
    }
  },

  ejercicios: [
    {
      id: 'g1-m1-c3-e1',
      type: 'find_string',
      pregunta: 'Toca la 6ª cuerda (la más gruesa de todas, Mi grave)',
      respuesta: { s: 5 },
      feedbackOk: '¡Perfecto! 6ª cuerda: Mi grave (E2 · 82.41 Hz).',
      xp: 5
    },
    {
      id: 'g1-m1-c3-e2',
      type: 'find_string',
      pregunta: 'Toca la 5ª cuerda (La · A2)',
      respuesta: { s: 4 },
      feedbackOk: '¡Correcto! 5ª cuerda: La (A2 · 110.00 Hz).',
      xp: 5
    },
    {
      id: 'g1-m1-c3-e3',
      type: 'find_string',
      pregunta: 'Toca la 4ª cuerda (Re · D3)',
      respuesta: { s: 3 },
      feedbackOk: '¡Muy bien! 4ª cuerda: Re (D3 · 146.83 Hz).',
      xp: 5
    },
    {
      id: 'g1-m1-c3-e4',
      type: 'find_string',
      pregunta: 'Toca la 3ª cuerda (Sol · G3)',
      respuesta: { s: 2 },
      feedbackOk: '¡Genial! 3ª cuerda: Sol (G3 · 196.00 Hz).',
      xp: 5
    },
    {
      id: 'g1-m1-c3-e5',
      type: 'find_string',
      pregunta: 'Toca la 2ª cuerda (Si · B3)',
      respuesta: { s: 1 },
      feedbackOk: '¡Excelente! 2ª cuerda: Si (B3 · 246.94 Hz).',
      xp: 5
    },
    {
      id: 'g1-m1-c3-e6',
      type: 'find_string',
      pregunta: 'Toca la 1ª cuerda (la más fina abajo, Mi aguda)',
      respuesta: { s: 0 },
      feedbackOk: '¡Fantástico! 1ª cuerda: Mi aguda (E4 · 329.63 Hz).',
      xp: 10
    }
  ],

  criterioExito: '6/6 cuerdas reconocidas de grave a aguda',
  mensajeExito: '🎉 ¡Habilidad desbloqueada! Reconoces las 6 cuerdas y sus calibres.'
};
