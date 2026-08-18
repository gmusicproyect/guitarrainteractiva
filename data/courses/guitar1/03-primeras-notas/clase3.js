/**
 * GMUSIC · CLASE 3: PRIMERAS NOTAS (Mi - Fa - Sol)
 * Habilidad: g1.melody.first-notes
 * "Ejecuta la primera secuencia melódica en la 1ª cuerda: Mi (aire), Fa (traste 1, dedo 1) y Sol (traste 3, dedo 3)."
 */

export const CLASE_3_DATA = {
  id: 'g1-c3',
  slug: 'primeras-notas',
  numero: 3,
  titulo: 'Primeras notas (Mi - Fa - Sol)',
  skillId: 'g1.melody.first-notes',
  skillName: 'Digitación melódica en 1ª cuerda',
  color: '#fbbf24', // Amber/Yellow
  xpTotal: 35,
  explicacion: 'En la 1ª cuerda (más fina) tenemos: Mi al aire (0), Fa en el traste 1 (con el dedo 1 / índice) y Sol en el traste 3 (con el dedo 3 / anular).',

  pasosDigitacion: [
    {
      id: 'g1-c3-p1',
      type: 'find_note',
      pregunta: 'Paso 1: Toca la nota Mi al aire (1ª cuerda, traste 0)',
      respuesta: { s: 0, f: 0, pc: 4 },
      feedbackOk: '¡Bien! Esa es la nota Mi al aire.',
      xp: 5
    },
    {
      id: 'g1-c3-p2',
      type: 'place_finger',
      instruccion: 'Paso 2: Coloca el Dedo 1 (índice) en la 1ª cuerda, traste 1 para tocar Fa',
      respuesta: { s: 0, f: 1, dedo: 1 },
      feedbackOk: '¡Correcto! Nota Fa (1ª cuerda, traste 1, dedo 1).',
      xp: 5
    },
    {
      id: 'g1-c3-p3',
      type: 'place_finger',
      instruccion: 'Paso 3: Coloca el Dedo 3 (anular) en la 1ª cuerda, traste 3 para tocar Sol',
      respuesta: { s: 0, f: 3, dedo: 3 },
      feedbackOk: '¡Excelente! Nota Sol (1ª cuerda, traste 3, dedo 3).',
      xp: 5
    }
  ],

  melodiaSecuencia: {
    id: 'g1-c3-melody',
    type: 'play_sequence',
    titulo: 'Reto: Toca la melodía continua Mi ➔ Fa ➔ Sol',
    secuencia: [
      { s: 0, f: 0, midi: 64, pc: 4, noteName: 'E', noteNameEs: 'Mi', finger: 0 },
      { s: 0, f: 1, midi: 65, pc: 5, noteName: 'F', noteNameEs: 'Fa', finger: 1 },
      { s: 0, f: 3, midi: 67, pc: 7, noteName: 'G', noteNameEs: 'Sol', finger: 3 }
    ],
    remediacion: {
      modo: 'aislar-nota-erronea',
      hint: 'Si fallas en una nota, practicaremos únicamente esa posición antes de repetir la melodía completa.'
    },
    xp: 20
  },

  criterioExito: 'Melodía Mi-Fa-Sol ejecutada limpiamente en orden',
  mensajeExito: '🎉 ¡Habilidad desbloqueada! Dominas tus primeras tres notas melódicas (Mi, Fa, Sol).'
};
