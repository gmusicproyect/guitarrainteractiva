/**
 * GMUSIC · CLASE 5: RIFF DESTINO (INTEGRACIÓN TOTAL DEL MÓDULO 1)
 * Habilidad: g1.capstone.first-riff
 * "Integra cuerdas, trastes, digitación melódica y pulso rítmico para interpretar el Riff completo a 60 BPM."
 */

export const CLASE_5_DATA = {
  id: 'g1-c5',
  slug: 'riff-destino',
  numero: 5,
  titulo: 'Riff destino (Integración total)',
  skillId: 'g1.capstone.first-riff',
  skillName: 'Interpretación de Riff completo a 60 BPM',
  color: '#ec4899', // Pink/Magenta
  xpTotal: 60,
  explicacion: 'Es hora de unir todo lo aprendido: cuerdas, trastes, notas y pulso en una sola pieza musical. Practicaremos la Frase 1, luego la Frase 2, y finalmente el Riff completo.',

  // Fase 1: Frase 1 (Pregunta musical)
  frase1: {
    id: 'g1-c5-f1',
    titulo: 'Frase 1: Subida melódica',
    secuencia: [
      { s: 0, f: 0, noteName: 'Mi', finger: 0 },
      { s: 0, f: 0, noteName: 'Mi', finger: 0 },
      { s: 0, f: 1, noteName: 'Fa', finger: 1 },
      { s: 0, f: 3, noteName: 'Sol', finger: 3 }
    ],
    feedbackOk: '¡Frase 1 dominada!',
    xp: 15
  },

  // Fase 2: Frase 2 (Respuesta musical)
  frase2: {
    id: 'g1-c5-f2',
    titulo: 'Frase 2: Bajada y resolución',
    secuencia: [
      { s: 0, f: 3, noteName: 'Sol', finger: 3 },
      { s: 0, f: 1, noteName: 'Fa', finger: 1 },
      { s: 0, f: 0, noteName: 'Mi', finger: 0 },
      { s: 1, f: 3, noteName: 'Re', finger: 3 } // 2ª cuerda traste 3
    ],
    feedbackOk: '¡Frase 2 dominada!',
    xp: 15
  },

  // Fase 3: Riff Completo a 60 BPM (RF)
  riffCompleto: {
    id: 'g1-c5-rf',
    titulo: 'Reto Final: Riff Completo a 60 BPM',
    bpm: 60,
    secuenciaCompleta: [
      // Frase 1
      { s: 0, f: 0, noteName: 'Mi', finger: 0 },
      { s: 0, f: 0, noteName: 'Mi', finger: 0 },
      { s: 0, f: 1, noteName: 'Fa', finger: 1 },
      { s: 0, f: 3, noteName: 'Sol', finger: 3 },
      // Frase 2
      { s: 0, f: 3, noteName: 'Sol', finger: 3 },
      { s: 0, f: 1, noteName: 'Fa', finger: 1 },
      { s: 0, f: 0, noteName: 'Mi', finger: 0 },
      { s: 1, f: 3, noteName: 'Re', finger: 3 }
    ],
    remediacion: {
      modo: 'aislar-frase-con-dificultad',
      instruccion: 'Si cometes un fallo, practicaremos únicamente la frase con dificultad antes de intentar el riff completo.'
    },
    xp: 30
  },

  criterioExito: 'Riff completo interpretado a 60 BPM con fluidez',
  mensajeExito: '🏆 ¡ENHORABUENA! Has completado el Módulo 1 y desbloqueado tu primera canción en la guitarra.'
};
