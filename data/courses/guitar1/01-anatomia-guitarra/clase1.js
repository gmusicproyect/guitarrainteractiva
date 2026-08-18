/**
 * GMUSIC · MÓDULO 1 (EL INSTRUMENTO) · CLASE 1: ANATOMÍA DE LA GUITARRA
 * Habilidad: g1.m1.anatomy
 * "Identifica visual y conceptualmente las partes fundamentales de la guitarra:
 * Pala, Clavijero, Cejuela, Mástil, Trastes, Cuerpo, Boca y Puente."
 */

export const CLASE_1_ANATOMIA = {
  id: 'g1-m1-c1',
  slug: 'anatomia-guitarra',
  numero: 1,
  titulo: 'Anatomía de la guitarra',
  skillId: 'g1.m1.anatomy',
  skillName: 'Identificación de las partes de la guitarra',
  color: '#38bdf8', // Cyan
  xpTotal: 25,
  explicacion: 'La guitarra se compone de tres grandes secciones: la Cabeza o Pala (arriba), el Mástil (en medio) y el Cuerpo o Caja de Resonancia (abajo).',

  partes: [
    {
      id: 'pala',
      nombre: 'Pala o Cabeza',
      descripcion: 'Extremo superior del mástil donde se alojan las 6 clavijas de afinación.',
      ubicacion: 'superior'
    },
    {
      id: 'clavijero',
      nombre: 'Clavijero',
      descripcion: 'Conjunto de 6 clavijas mecánicas que tensan o aflojan cada cuerda.',
      ubicacion: 'pala'
    },
    {
      id: 'cejuela',
      nombre: 'Cejuela (Nut)',
      descripcion: 'Pieza de hueso o material sintético donde descansan las cuerdas al salir de la pala. Marca el inicio del traste 0.',
      ubicacion: 'inicio-mastil'
    },
    {
      id: 'mastil',
      nombre: 'Mástil y Diapasón',
      descripcion: 'La superficie de madera frontal dividida por trastes donde colocas los dedos de la mano izquierda.',
      ubicacion: 'central'
    },
    {
      id: 'trastes',
      nombre: 'Trastes',
      descripcion: 'Barritas metálicas insertadas en el diapasón que definen la altura de cada nota musical.',
      ubicacion: 'diapason'
    },
    {
      id: 'cuerpo',
      nombre: 'Cuerpo o Caja de Resonancia',
      descripcion: 'Caja acústica de madera que amplifica naturalmente el sonido generado por la vibración de las cuerdas.',
      ubicacion: 'inferior'
    },
    {
      id: 'boca',
      nombre: 'Boca',
      descripcion: 'Abertura circular en la tapa armónica por donde se proyecta la resonancia del sonido.',
      ubicacion: 'cuerpo-centro'
    },
    {
      id: 'puente',
      nombre: 'Puente',
      descripcion: 'Pieza fijada a la tapa del cuerpo donde se anclan y sujetan los extremos inferiores de las cuerdas.',
      ubicacion: 'cuerpo-inferior'
    }
  ],

  ejercicios: [
    {
      id: 'g1-m1-c1-e1',
      type: 'multiple_choice',
      pregunta: '¿En qué parte de la guitarra se encuentran las clavijas para afinar las cuerdas?',
      opciones: ['En el puente', 'En la pala o cabeza', 'Dentro de la boca'],
      respuesta: 'En la pala o cabeza',
      feedbackOk: '¡Correcto! Las clavijas se ubican en la pala (cabeza) de la guitarra.',
      xp: 10
    },
    {
      id: 'g1-m1-c1-e2',
      type: 'multiple_choice',
      pregunta: '¿Qué elemento delimita el inicio del diapasón y apoya las cuerdas antes de los trastes?',
      opciones: ['La cejuela (nut)', 'El puente', 'La boca'],
      respuesta: 'La cejuela (nut)',
      feedbackOk: '¡Exacto! La cejuela marca el punto de apoyo inicial (traste 0).',
      xp: 15
    }
  ],

  criterioExito: 'Partes fundamentales reconocidas',
  mensajeExito: '🎉 ¡Habilidad desbloqueada! Conoces la anatomía física de tu guitarra.'
};
