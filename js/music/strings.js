/**
 * GMUSIC CANONICAL STRINGS DEFINITION
 * Contract v1.0 (2026-08-17)
 * 
 * Convenciones Técnicas:
 * s = 0 → 1ª cuerda (Mi aguda, e)     midi: 64, freq: 329.63 Hz
 * s = 1 → 2ª cuerda (Si, B)           midi: 59, freq: 246.94 Hz
 * s = 2 → 3ª cuerda (Sol, G)          midi: 55, freq: 196.00 Hz
 * s = 3 → 4ª cuerda (Re, D)           midi: 50, freq: 146.83 Hz
 * s = 4 → 5ª cuerda (La, A)           midi: 45, freq: 110.00 Hz
 * s = 5 → 6ª cuerda (Mi grave, E)     midi: 40, freq: 82.41 Hz
 * 
 * Altura MIDI: midi = STRINGS[s].midi + f (donde f es 0..16)
 * Índice s base 0, perspectiva del ejecutante (6ª cuerda arriba en pantalla).
 */

export const STRINGS = [
  {
    s: 0,
    stringNumber: 1,
    noteEn: 'E',
    noteEs: 'Mi',
    octave: 4,
    fullName: '1ª cuerda (Mi aguda, e)',
    midi: 64,
    baseFreq: 329.63,
    gauge: 'thin-steel',
    pitchClass: 4, // E
    description: '1ª cuerda · Mi aguda (e) · midi 64'
  },
  {
    s: 1,
    stringNumber: 2,
    noteEn: 'B',
    noteEs: 'Si',
    octave: 3,
    fullName: '2ª cuerda (Si, B)',
    midi: 59,
    baseFreq: 246.94,
    gauge: 'plain-steel',
    pitchClass: 11, // B
    description: '2ª cuerda · Si (B) · midi 59'
  },
  {
    s: 2,
    stringNumber: 3,
    noteEn: 'G',
    noteEs: 'Sol',
    octave: 3,
    fullName: '3ª cuerda (Sol, G)',
    midi: 55,
    baseFreq: 196.00,
    gauge: 'plain-steel',
    pitchClass: 7, // G
    description: '3ª cuerda · Sol (G) · midi 55'
  },
  {
    s: 3,
    stringNumber: 4,
    noteEn: 'D',
    noteEs: 'Re',
    octave: 3,
    fullName: '4ª cuerda (Re, D)',
    midi: 50,
    baseFreq: 146.83,
    gauge: 'wound',
    pitchClass: 2, // D
    description: '4ª cuerda · Re (D) · midi 50'
  },
  {
    s: 4,
    stringNumber: 5,
    noteEn: 'A',
    noteEs: 'La',
    octave: 2,
    fullName: '5ª cuerda (La, A)',
    midi: 45,
    baseFreq: 110.00,
    gauge: 'wound',
    pitchClass: 9, // A
    description: '5ª cuerda · La (A) · midi 45'
  },
  {
    s: 5,
    stringNumber: 6,
    noteEn: 'E',
    noteEs: 'Mi',
    octave: 2,
    fullName: '6ª cuerda (Mi grave, E)',
    midi: 40,
    baseFreq: 82.41,
    gauge: 'thick-wound',
    pitchClass: 4, // E
    description: '6ª cuerda · Mi grave (E) · midi 40'
  }
];

export const STRING_BY_S = Object.freeze(
  STRINGS.reduce((acc, str) => {
    acc[str.s] = str;
    return acc;
  }, {})
);

export const STRING_BY_NUMBER = Object.freeze(
  STRINGS.reduce((acc, str) => {
    acc[str.stringNumber] = str;
    return acc;
  }, {})
);

/**
 * Convierte coordenada (s, f) en nota MIDI y pitchClass (0..11)
 */
export function getMidiNote(s, f = 0) {
  if (f < 0) return null; // Cuerda mudada (-1)
  const str = STRING_BY_S[s];
  if (!str) return null;
  return str.midi + f;
}

export function getPitchClass(s, f = 0) {
  const midi = getMidiNote(s, f);
  if (midi === null) return null;
  return midi % 12;
}
