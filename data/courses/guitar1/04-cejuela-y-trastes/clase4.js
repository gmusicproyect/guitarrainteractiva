/**
 * GMUSIC · MÓDULO 1 (EL INSTRUMENTO) · CLASE 4: LA CEJUELA Y LOS TRASTES
 * Habilidad: g1.m1.nut-and-frets
 * "Comprende qué es la cejuela (nut), qué significa cuerda al aire (traste 0)
 * y cómo los trastes acortan la cuerda para producir diferentes notas."
 */

export const CLASE_4_CEJUELA_TRASTES = {
  id: 'g1-m1-c4',
  slug: 'cejuela-y-trastes',
  numero: 4,
  titulo: 'La cejuela y los trastes (Cómo nace el sonido)',
  skillId: 'g1.m1.nut-and-frets',
  skillName: 'Física del diapasón: cejuela y trastes',
  color: '#34d399', // Emerald
  xpTotal: 40,
  explicacion: 'Al tocar al aire (traste 0), la cuerda vibra completa entre la cejuela y el puente. Al presionar un traste con un dedo, acortas la distancia de vibración, haciendo que la nota suene más aguda.',

  conceptos: [
    {
      concepto: 'Traste 0 (Cuerda al aire)',
      definicion: 'No se presiona ningún dedo. La cuerda vibra libremente en toda su longitud.'
    },
    {
      concepto: 'Trastes 1, 2, 3...',
      definicion: 'Se presiona justo detrás de la barrita metálica. La cuerda se acorta y el tono sube.'
    }
  ],

  ejercicios: [
    {
      id: 'g1-m1-c4-e1',
      type: 'find_fret',
      pregunta: 'Toca la 1ª cuerda al aire (Traste 0, apoyada en la cejuela)',
      respuesta: { s: 0, f: 0 },
      feedbackOk: '¡Correcto! Nota Mi al aire (traste 0).',
      xp: 10
    },
    {
      id: 'g1-m1-c4-e2',
      type: 'find_fret',
      pregunta: 'Ahora acorta la 1ª cuerda pisando en el Traste 1 para subir la nota (Fa)',
      respuesta: { s: 0, f: 1 },
      feedbackOk: '¡Exacto! Al acortar la cuerda en el traste 1, la nota subió de Mi a Fa.',
      xp: 15
    },
    {
      id: 'g1-m1-c4-e3',
      type: 'find_fret',
      pregunta: 'Acorta aún más la 1ª cuerda pisando en el Traste 3 (Sol)',
      respuesta: { s: 0, f: 3 },
      feedbackOk: '¡Brillante! El traste 3 acorta aún más la cuerda y produce la nota Sol.',
      xp: 15
    }
  ],

  criterioExito: 'Comprensión de la relación entre longitud de cuerda y altura tonal',
  mensajeExito: '🎉 ¡Habilidad desbloqueada! Comprendes cómo la cejuela y los trastes producen todas las notas.'
};
