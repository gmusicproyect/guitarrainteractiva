/**
 * GMUSIC CANONICAL CHORDS DICTIONARY (CHORDS)
 * Contract v1.0 (§1.3 & §2.3)
 * 
 * Regla de convención:
 * El array `fingers` y `frets` está indexado ESTRICTAMENTE por índice s: 0..5.
 * fingers[0] es el dedo de s:0 (1ª cuerda).
 * Dedos: 0=al aire, 1=índice, 2=medio, 3=anular, 4=meñique.
 */

export const CHORDS = {
  'Am-open': {
    id: 'Am-open',
    symbol: 'Am',
    name: 'La menor',
    quality: 'minor',
    root: 'A',
    rootPitchClass: 9,
    description: 'Acorde abierto fundamental. Tónica en la 5ª cuerda al aire.',
    // Índices estrictamente por s: 0..5
    frets: [0, 1, 2, 2, 0, -1],
    fingers: [0, 1, 3, 2, 0, 0],
    mute: [5],
    positions: {
      0: { s: 0, f: 0, note: 'E', finger: 0, status: 'open' },
      1: { s: 1, f: 1, note: 'C', finger: 1, status: 'fretted' },
      2: { s: 2, f: 2, note: 'A', finger: 3, status: 'fretted' },
      3: { s: 3, f: 2, note: 'E', finger: 2, status: 'fretted' },
      4: { s: 4, f: 0, note: 'A', finger: 0, status: 'open', isRoot: true },
      5: { s: 5, f: -1, note: null, finger: 0, status: 'muted' }
    },
    strumArray: [-1, 0, 2, 2, 1, 0] // orden s:5 a s:0 para audio
  },

  'C-open': {
    id: 'C-open',
    symbol: 'C',
    name: 'Do mayor',
    quality: 'major',
    root: 'C',
    rootPitchClass: 0,
    description: 'Acorde abierto mayor con tónica en 5ª cuerda traste 3.',
    frets: [0, 1, 0, 2, 3, -1],
    fingers: [0, 1, 0, 2, 3, 0],
    mute: [5],
    positions: {
      0: { s: 0, f: 0, note: 'E', finger: 0, status: 'open' },
      1: { s: 1, f: 1, note: 'C', finger: 1, status: 'fretted' },
      2: { s: 2, f: 0, note: 'G', finger: 0, status: 'open' },
      3: { s: 3, f: 2, note: 'E', finger: 2, status: 'fretted' },
      4: { s: 4, f: 3, note: 'C', finger: 3, status: 'fretted', isRoot: true },
      5: { s: 5, f: -1, note: null, finger: 0, status: 'muted' }
    },
    strumArray: [-1, 3, 2, 0, 1, 0]
  },

  'Em-open': {
    id: 'Em-open',
    symbol: 'Em',
    name: 'Mi menor',
    quality: 'minor',
    root: 'E',
    rootPitchClass: 4,
    description: 'Acorde abierto fácil. Tónica en la 6ª cuerda al aire.',
    frets: [0, 0, 0, 2, 2, 0],
    fingers: [0, 0, 0, 3, 2, 0],
    mute: [],
    positions: {
      0: { s: 0, f: 0, note: 'E', finger: 0, status: 'open' },
      1: { s: 1, f: 0, note: 'B', finger: 0, status: 'open' },
      2: { s: 2, f: 0, note: 'G', finger: 0, status: 'open' },
      3: { s: 3, f: 2, note: 'E', finger: 3, status: 'fretted' },
      4: { s: 4, f: 2, note: 'B', finger: 2, status: 'fretted' },
      5: { s: 5, f: 0, note: 'E', finger: 0, status: 'open', isRoot: true }
    },
    strumArray: [0, 2, 2, 0, 0, 0]
  },

  'E-open': {
    id: 'E-open',
    symbol: 'E',
    name: 'Mi mayor',
    quality: 'major',
    root: 'E',
    rootPitchClass: 4,
    description: 'Acorde mayor con tónica en la 6ª cuerda.',
    frets: [0, 0, 1, 2, 2, 0],
    fingers: [0, 0, 1, 3, 2, 0],
    mute: [],
    positions: {
      0: { s: 0, f: 0, note: 'E', finger: 0, status: 'open' },
      1: { s: 1, f: 0, note: 'B', finger: 0, status: 'open' },
      2: { s: 2, f: 1, note: 'G#', finger: 1, status: 'fretted' },
      3: { s: 3, f: 2, note: 'E', finger: 3, status: 'fretted' },
      4: { s: 4, f: 2, note: 'B', finger: 2, status: 'fretted' },
      5: { s: 5, f: 0, note: 'E', finger: 0, status: 'open', isRoot: true }
    },
    strumArray: [0, 2, 2, 1, 0, 0]
  },

  'G-open': {
    id: 'G-open',
    symbol: 'G',
    name: 'Sol mayor',
    quality: 'major',
    root: 'G',
    rootPitchClass: 7,
    description: 'Acorde abierto clásico usando las seis cuerdas.',
    frets: [3, 0, 0, 0, 2, 3],
    fingers: [3, 0, 0, 0, 1, 2],
    mute: [],
    positions: {
      0: { s: 0, f: 3, note: 'G', finger: 3, status: 'fretted' },
      1: { s: 1, f: 0, note: 'B', finger: 0, status: 'open' },
      2: { s: 2, f: 0, note: 'G', finger: 0, status: 'open' },
      3: { s: 3, f: 0, note: 'D', finger: 0, status: 'open' },
      4: { s: 4, f: 2, note: 'B', finger: 1, status: 'fretted' },
      5: { s: 5, f: 3, note: 'G', finger: 2, status: 'fretted', isRoot: true }
    },
    strumArray: [3, 2, 0, 0, 0, 3]
  },

  'D-open': {
    id: 'D-open',
    symbol: 'D',
    name: 'Re mayor',
    quality: 'major',
    root: 'D',
    rootPitchClass: 2,
    description: 'Acorde abierto brillante con tónica en 4ª cuerda al aire.',
    frets: [2, 3, 2, 0, -1, -1],
    fingers: [2, 3, 1, 0, 0, 0],
    mute: [4, 5],
    positions: {
      0: { s: 0, f: 2, note: 'F#', finger: 2, status: 'fretted' },
      1: { s: 1, f: 3, note: 'D', finger: 3, status: 'fretted' },
      2: { s: 2, f: 2, note: 'A', finger: 1, status: 'fretted' },
      3: { s: 3, f: 0, note: 'D', finger: 0, status: 'open', isRoot: true },
      4: { s: 4, f: -1, note: null, finger: 0, status: 'muted' },
      5: { s: 5, f: -1, note: null, finger: 0, status: 'muted' }
    },
    strumArray: [-1, -1, 0, 2, 3, 2]
  },

  'A-open': {
    id: 'A-open',
    symbol: 'A',
    name: 'La mayor',
    quality: 'major',
    root: 'A',
    rootPitchClass: 9,
    description: 'Acorde mayor con tres dedos en traste 2.',
    frets: [0, 2, 2, 2, 0, -1],
    fingers: [0, 3, 2, 1, 0, 0],
    mute: [5],
    positions: {
      0: { s: 0, f: 0, note: 'E', finger: 0, status: 'open' },
      1: { s: 1, f: 2, note: 'C#', finger: 3, status: 'fretted' },
      2: { s: 2, f: 2, note: 'A', finger: 2, status: 'fretted' },
      3: { s: 3, f: 2, note: 'E', finger: 1, status: 'fretted' },
      4: { s: 4, f: 0, note: 'A', finger: 0, status: 'open', isRoot: true },
      5: { s: 5, f: -1, note: null, finger: 0, status: 'muted' }
    },
    strumArray: [-1, 0, 2, 2, 2, 0]
  }
};

/**
 * Calcula los dedos ancla comunes entre dos acordes (§4.8)
 * Devuelve un array de objetos { s, f, finger } para las posiciones pisadas (f > 0)
 * donde misma cuerda s, mismo traste f y mismo dedo finger coinciden.
 */
export function getAnchorFingers(chord1Id, chord2Id) {
  const c1 = CHORDS[chord1Id];
  const c2 = CHORDS[chord2Id];
  if (!c1 || !c2) return [];

  const anchors = [];
  for (let s = 0; s <= 5; s++) {
    const f1 = c1.frets[s];
    const f2 = c2.frets[s];
    const d1 = c1.fingers[s];
    const d2 = c2.fingers[s];

    // Solo posiciones pisadas (f > 0) con dedo activo (d > 0)
    if (f1 > 0 && f1 === f2 && d1 > 0 && d1 === d2) {
      anchors.push({ s, f: f1, finger: d1 });
    }
  }
  return anchors;
}
