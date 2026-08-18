/**
 * GMUSIC · CLASE 4: EL PULSO (Metrónomo a 60 BPM)
 * Habilidad: g1.rhythm.pulse-60bpm
 * "Sincroniza la pulsación de notas con un metrónomo a 60 BPM contando 1 - 2 - 3 - 4 de forma constante."
 */

export const CLASE_4_DATA = {
  id: 'g1-c4',
  slug: 'el-pulso',
  numero: 4,
  titulo: 'El pulso y el metrónomo',
  skillId: 'g1.rhythm.pulse-60bpm',
  skillName: 'Control rítmico y sincronización temporal',
  color: '#34d399', // Emerald/Green
  xpTotal: 40,
  explicacion: 'La música vive en el tiempo. El pulso es el latido constante de la canción. Contaremos 1 - 2 - 3 - 4 tocando una nota en cada golpe del metrónomo a 60 BPM.',

  ejercicioRitmo: {
    id: 'g1-c4-rhythm-sync',
    type: 'play_sequence',
    titulo: 'Sincronización a 60 BPM (4 compases)',
    bpm: 60,
    bpmReducido: 45, // Remediación H4
    cuentaPreviaBeats: 4,
    toleranciaMs: 180,
    // Secuencia rítmica de 8 notas a tiempo (negras)
    secuencia: [
      { beat: 1, s: 0, f: 0, noteName: 'Mi', noteNameEs: 'Mi' },
      { beat: 2, s: 0, f: 0, noteName: 'Mi', noteNameEs: 'Mi' },
      { beat: 3, s: 0, f: 1, noteName: 'Fa', noteNameEs: 'Fa' },
      { beat: 4, s: 0, f: 1, noteName: 'Fa', noteNameEs: 'Fa' },
      { beat: 5, s: 0, f: 3, noteName: 'Sol', noteNameEs: 'Sol' },
      { beat: 6, s: 0, f: 3, noteName: 'Sol', noteNameEs: 'Sol' },
      { beat: 7, s: 0, f: 1, noteName: 'Fa', noteNameEs: 'Fa' },
      { beat: 8, s: 0, f: 0, noteName: 'Mi', noteNameEs: 'Mi' }
    ],
    remediacion: {
      tipo: 'reduccion-tempo',
      bpmFallback: 45,
      instruccion: 'Si te cuesta mantener el pulso, bajamos a 45 BPM. Escucha el clic, cuenta 1-2-3-4 y toca a tiempo.'
    },
    xp: 40
  },

  criterioExito: 'Sincronización >= 85% a 60 BPM',
  mensajeExito: '🎉 ¡Habilidad desbloqueada! Tienes control del pulso y sincronización rítmica con metrónomo.'
};
