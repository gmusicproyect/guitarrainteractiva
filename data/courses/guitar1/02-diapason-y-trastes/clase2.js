/**
 * GMUSIC · CLASE 2: EL DIAPASÓN Y LOS TRASTES
 * Habilidad: g1.fretboard.coords
 * "Comprende el concepto de traste al aire (0) y trastes pisados (1, 2, 3), ubicando cualquier coordenada {s, f}."
 */

export const CLASE_2_DATA = {
  id: 'g1-c2',
  slug: 'diapason-y-trastes',
  numero: 2,
  titulo: 'El diapasón y los trastes',
  skillId: 'g1.fretboard.coords',
  skillName: 'Orientación espacial en el diapasón {s, f}',
  color: '#818cf8', // Indigo
  xpTotal: 30,
  explicacion: 'Los trastes son las divisiones metálicas a lo largo del mástil. El traste 0 significa cuerda al aire (sin pisar). Los trastes 1, 2 y 3 se pisan justo antes de la barrita metálica.',

  ejercicios: [
    {
      id: 'g1-c2-e1',
      type: 'find_fret',
      pregunta: 'Toca el traste 1 de la 1ª cuerda',
      respuesta: { s: 0, f: 1 },
      feedbackOk: '¡Bien! Has pisado el traste 1 de la 1ª cuerda.',
      remediacion: {
        hint: 'Localiza la cuerda más fina (1ª) y el primer espacio junto a la cejuela (traste 1).',
        highlightFret: { s: 0, f: 1 }
      },
      xp: 5
    },
    {
      id: 'g1-c2-e2',
      type: 'find_fret',
      pregunta: 'Toca el traste 3 de la 6ª cuerda',
      respuesta: { s: 5, f: 3 },
      feedbackOk: '¡Exacto! 6ª cuerda, traste 3 (nota Sol).',
      remediacion: {
        hint: 'Cuerda superior (6ª), cuenta tres espacios hacia la derecha: 1, 2, 3.',
        highlightFret: { s: 5, f: 3 }
      },
      xp: 5
    },
    {
      id: 'g1-c2-e3',
      type: 'find_fret',
      pregunta: 'Toca el traste 2 de la 5ª cuerda',
      respuesta: { s: 4, f: 2 },
      feedbackOk: '¡Correcto! 5ª cuerda, traste 2 (nota Si).',
      remediacion: {
        hint: 'Segunda cuerda desde arriba, segundo traste.',
        highlightFret: { s: 4, f: 2 }
      },
      xp: 5
    },
    {
      id: 'g1-c2-e4',
      type: 'find_fret',
      pregunta: 'Toca el traste 2 de la 4ª cuerda',
      respuesta: { s: 3, f: 2 },
      feedbackOk: '¡Perfecto! 4ª cuerda, traste 2 (nota Mi).',
      remediacion: {
        hint: 'Tercera cuerda desde arriba, segundo traste.',
        highlightFret: { s: 3, f: 2 }
      },
      xp: 5
    }
  ],

  criterioExito: '4/4 coordenadas ubicadas con precisión',
  mensajeExito: '🎉 ¡Habilidad desbloqueada! Comprendes el sistema de coordenadas de cuerdas y trastes.'
};
