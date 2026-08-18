/**
 * GMUSIC · MÓDULO 1 (EL INSTRUMENTO) · CLASE 5: PRIMERAS PULSACIONES Y CONTROL DE SONIDO
 * Habilidad: g1.m1.first-plucks
 * "Ejecuta una secuencia rítmica de pulsación de cuerdas al aire y practica el control de resonancia."
 */

export const CLASE_5_PULSACIONES = {
  id: 'g1-m1-c5',
  slug: 'primeras-pulsaciones',
  numero: 5,
  titulo: 'Primeras pulsaciones y control de sonido',
  skillId: 'g1.m1.first-plucks',
  skillName: 'Pulsación limpia de cuerdas y control de resonancia',
  color: '#ec4899', // Pink
  xpTotal: 50,
  explicacion: 'Tocar la guitarra implica pulsar con precisión y también saber cuándo detener el sonido. Practicaremos tocar cuerdas al aire en una secuencia rítmica fluida.',

  ejercicioSecuenciaAire: {
    id: 'g1-m1-c5-sequence',
    type: 'play_sequence',
    titulo: 'Secuencia de Exploración de Cuerdas Graves a Agudas',
    bpm: 60,
    secuencia: [
      { s: 5, f: 0, noteName: 'E', noteNameEs: 'Mi grave (6ª)', finger: 0 },
      { s: 4, f: 0, noteName: 'A', noteNameEs: 'La (5ª)', finger: 0 },
      { s: 3, f: 0, noteName: 'D', noteNameEs: 'Re (4ª)', finger: 0 },
      { s: 2, f: 0, noteName: 'G', noteNameEs: 'Sol (3ª)', finger: 0 },
      { s: 1, f: 0, noteName: 'B', noteNameEs: 'Si (2ª)', finger: 0 },
      { s: 0, f: 0, noteName: 'E', noteNameEs: 'Mi aguda (1ª)', finger: 0 }
    ],
    remediacion: {
      hint: 'Toca cada cuerda de arriba hacia abajo esperando a que resuene antes de pasar a la siguiente.'
    },
    xp: 50
  },

  criterioExito: 'Secuencia de 6 cuerdas al aire ejecutada con sonido limpio',
  mensajeExito: '🏆 ¡ENHORABUENA! Has completado el Módulo 1. Conoces tu guitarra como instrumento y tienes control de sus cuerdas.'
};
