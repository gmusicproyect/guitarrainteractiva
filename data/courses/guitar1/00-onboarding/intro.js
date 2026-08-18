/**
 * GMUSIC · MÓDULO 1: TU GUITARRA Y TUS PRIMERAS NOTAS
 * 00 - ONBOARDING: BIENVENIDA Y PRIMERA INTERACCIÓN
 */

export const ONBOARDING_DATA = {
  id: 'g1-m0-onboarding',
  title: 'Bienvenida a GMusic',
  instrument: 'guitar',
  tagline: 'Aprende guitarra tocando desde el primer minuto',
  description: 'Domina cuerdas, trastes, notas y ritmo con interacción directa.',
  heroExercise: {
    id: 'g1-m0-first-pluck',
    type: 'find_string',
    pregunta: '¿Probamos? Toca la cuerda más gruesa (6ª cuerda · Mi).',
    respuesta: { s: 5 },
    feedbackOk: '¡Exacto! Esa es la 6ª cuerda: Mi (E2). ¡Ya estás tocando!',
    xp: 5
  },
  nextStep: {
    claseId: 'g1-c1',
    title: 'Comenzar Clase 1: Las seis cuerdas →'
  }
};
