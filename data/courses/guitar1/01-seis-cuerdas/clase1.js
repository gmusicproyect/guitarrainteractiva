/**
 * GMUSIC · CLASE 1: LAS SEIS CUERDAS
 * Habilidad: g1.strings.open
 * "Reconoce y localiza las 6 cuerdas al aire por nombre tradicional (Mi, La, Re, Sol, Si, Mi) y cifrado."
 */

export const CLASE_1_DATA = {
  id: 'g1-c1',
  slug: 'seis-cuerdas',
  numero: 1,
  titulo: 'Las seis cuerdas',
  skillId: 'g1.strings.open',
  skillName: 'Reconocimiento de las 6 cuerdas al aire',
  color: '#38bdf8', // Cyan
  xpTotal: 25,
  explicacion: 'La guitarra tiene 6 cuerdas. La más gruesa es la 6ª cuerda (Mi grave) arriba, y la más fina es la 1ª cuerda (Mi aguda) abajo.',
  
  // Serie de ejercicios progresivos
  ejercicios: [
    {
      id: 'g1-c1-e1',
      type: 'find_string',
      pregunta: 'Toca la 6ª cuerda (Mi grave · E2)',
      respuesta: { s: 5 },
      feedbackOk: '¡Perfecto! La 6ª cuerda es Mi grave (la más gruesa arriba).',
      remediacion: {
        hint: 'Fíjate en la cuerda superior, es la que tiene mayor grosor y tono más grave.',
        highlightString: 5
      },
      xp: 5
    },
    {
      id: 'g1-c1-e2',
      type: 'find_string',
      pregunta: 'Toca la 5ª cuerda (La · A2)',
      respuesta: { s: 4 },
      feedbackOk: '¡Correcto! La 5ª cuerda es La.',
      remediacion: {
        hint: 'Es la segunda cuerda desde arriba.',
        highlightString: 4
      },
      xp: 5
    },
    {
      id: 'g1-c1-e3',
      type: 'find_string',
      pregunta: 'Toca la 4ª cuerda (Re · D3)',
      respuesta: { s: 3 },
      feedbackOk: '¡Muy bien! La 4ª cuerda es Re.',
      remediacion: {
        hint: 'Justo debajo de la cuerda La.',
        highlightString: 3
      },
      xp: 5
    },
    {
      id: 'g1-c1-e4',
      type: 'find_string',
      pregunta: 'Toca la 3ª cuerda (Sol · G3)',
      respuesta: { s: 2 },
      feedbackOk: '¡Excelente! La 3ª cuerda es Sol.',
      remediacion: {
        hint: 'Tercera cuerda contando desde abajo.',
        highlightString: 2
      },
      xp: 5
    },
    {
      id: 'g1-c1-e5',
      type: 'find_string',
      pregunta: 'Toca la 2ª cuerda (Si · B3)',
      respuesta: { s: 1 },
      feedbackOk: '¡Genial! La 2ª cuerda es Si.',
      remediacion: {
        hint: 'Penúltima cuerda hacia abajo.',
        highlightString: 1
      },
      xp: 5
    },
    {
      id: 'g1-c1-e6',
      type: 'find_string',
      pregunta: 'Toca la 1ª cuerda (Mi aguda · E4)',
      respuesta: { s: 0 },
      feedbackOk: '¡Fantástico! La 1ª cuerda es Mi aguda (la más fina abajo).',
      remediacion: {
        hint: 'La cuerda más fina ubicada en la parte inferior.',
        highlightString: 0
      },
      xp: 5
    }
  ],

  // Certificación honesta al completar
  criterioExito: '6/6 cuerdas reconocidas',
  mensajeExito: '🎉 ¡Habilidad desbloqueada! Reconoces las 6 cuerdas al aire de la guitarra.'
};
