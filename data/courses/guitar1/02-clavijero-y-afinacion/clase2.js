/**
 * GMUSIC · MÓDULO 1 (EL INSTRUMENTO) · CLASE 2: EL CLAVIJERO Y LA AFINACIÓN
 * Habilidad: g1.m1.tuning-pegs
 * "Comprende la función de las 6 clavijas, la relación tensión-tono y el mapa clavija ➔ cuerda."
 */

export const CLASE_2_CLAVIJERO = {
  id: 'g1-m1-c2',
  slug: 'clavijero-y-afinacion',
  numero: 2,
  titulo: 'El clavijero y la afinación',
  skillId: 'g1.m1.tuning-pegs',
  skillName: 'Control de clavijas y principios de afinación',
  color: '#818cf8', // Indigo
  xpTotal: 30,
  explicacion: 'Cada clavija controla la tensión de una cuerda individual. Al girar para tensar la cuerda, la nota se vuelve más aguda; al aflojar, se vuelve más grave.',

  mapaClavijas: [
    { clavija: 6, cuerdaS: 5, nombre: 'Clavija 6ª cuerda (Mi grave · E2)', lado: 'superior-izq' },
    { clavija: 5, cuerdaS: 4, nombre: 'Clavija 5ª cuerda (La · A2)', lado: 'superior-centro' },
    { clavija: 4, cuerdaS: 3, nombre: 'Clavija 4ª cuerda (Re · D3)', lado: 'superior-der' },
    { clavija: 3, cuerdaS: 2, nombre: 'Clavija 3ª cuerda (Sol · G3)', lado: 'inferior-der' },
    { clavija: 2, cuerdaS: 1, nombre: 'Clavija 2ª cuerda (Si · B3)', lado: 'inferior-centro' },
    { clavija: 1, cuerdaS: 0, nombre: 'Clavija 1ª cuerda (Mi aguda · E4)', lado: 'inferior-izq' }
  ],

  ejercicios: [
    {
      id: 'g1-m1-c2-e1',
      type: 'multiple_choice',
      pregunta: '¿Qué ocurre con el sonido de una cuerda cuando la tensas girando su clavija?',
      opciones: ['El sonido se vuelve más agudo', 'El sonido se vuelve más grave', 'El sonido no cambia de altura'],
      respuesta: 'El sonido se vuelve más agudo',
      feedbackOk: '¡Correcto! Mayor tensión produce una vibración más rápida y una nota más aguda.',
      xp: 15
    },
    {
      id: 'g1-m1-c2-e2',
      type: 'find_string',
      pregunta: 'Para afinar la cuerda más grave (6ª cuerda), ¿cuál debes pulsar en la guitarra?',
      respuesta: { s: 5 },
      feedbackOk: '¡Exacto! La 6ª cuerda (Mi grave) se conecta a la primera clavija superior.',
      xp: 15
    }
  ],

  criterioExito: 'Comprensión de tensión de cuerdas y correspondencia de clavijas',
  mensajeExito: '🎉 ¡Habilidad desbloqueada! Comprendes el clavijero y cómo se controla la afinación.'
};
