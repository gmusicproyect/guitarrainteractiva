/**
 * GMUSIC CAGED SYSTEM DEFINITION (§2.3)
 * 5 Formas mayores (C, A, G, E, D) y 3 menores prácticas (Em, Am, Dm).
 * Cada forma declara:
 * - anclaS (cuerda de la tónica en convención s: 0..5)
 * - frets relativos al ancla
 * - fingers relativos (estrictamente por índice s: 0..5)
 * - mute (lista de cuerdas silenciadas)
 */

export const CAGED_FORMS = {
  // Forma C (Ancla en s:4 / 5ª cuerda)
  'C': {
    forma: 'C',
    name: 'Forma C (Mayor)',
    anclaS: 4, // 5ª cuerda
    tipo: 'mayor',
    // Posiciones relativas donde ancla está en traste 0 (Do abierto con ancla en traste 3)
    // s:0 -> f:0, s:1 -> f:1, s:2 -> f:0, s:3 -> f:2, s:4 -> f:3, s:5 -> f:-1
    offsets: {
      0: 0,  // s:0 (1ª cuerda): ancla - 3 (al aire si ancla=3)
      1: 1,  // s:1 (2ª cuerda): ancla - 2
      2: 0,  // s:2 (3ª cuerda): ancla - 3
      3: 2,  // s:3 (4ª cuerda): ancla - 1
      4: 3,  // s:4 (5ª cuerda): ancla (TÓNICA)
      5: -1  // s:5 (6ª cuerda): MUTE
    },
    fingers: { 0: 0, 1: 1, 2: 0, 3: 2, 4: 3, 5: 0 },
    cagedFingers: { 0: 0, 1: 2, 2: 0, 3: 3, 4: 4, 5: 0 } // Digitación 2-3-4 para cejilla
  },

  // Forma A (Ancla en s:4 / 5ª cuerda)
  'A': {
    forma: 'A',
    name: 'Forma A (Mayor)',
    anclaS: 4,
    tipo: 'mayor',
    offsets: { 0: 0, 1: 2, 2: 2, 3: 2, 4: 0, 5: -1 },
    fingers: { 0: 0, 1: 3, 2: 2, 3: 1, 4: 0, 5: 0 }
  },

  // Forma G (Ancla en s:5 / 6ª cuerda)
  'G': {
    forma: 'G',
    name: 'Forma G (Mayor)',
    anclaS: 5,
    tipo: 'mayor',
    offsets: { 0: 3, 1: 0, 2: 0, 3: 0, 4: 2, 5: 3 },
    fingers: { 0: 3, 1: 0, 2: 0, 3: 0, 4: 1, 5: 2 }
  },

  // Forma E (Ancla en s:5 / 6ª cuerda)
  'E': {
    forma: 'E',
    name: 'Forma E (Mayor)',
    anclaS: 5,
    tipo: 'mayor',
    offsets: { 0: 0, 1: 0, 2: 1, 3: 2, 4: 2, 5: 0 },
    fingers: { 0: 0, 1: 0, 2: 1, 3: 3, 4: 2, 5: 0 }
  },

  // Forma D (Ancla en s:3 / 4ª cuerda)
  'D': {
    forma: 'D',
    name: 'Forma D (Mayor)',
    anclaS: 3,
    tipo: 'mayor',
    offsets: { 0: 2, 1: 3, 2: 2, 3: 0, 4: -1, 5: -1 },
    fingers: { 0: 2, 1: 3, 2: 1, 3: 0, 4: 0, 5: 0 }
  },

  // Menores prácticas (§2.3): Em, Am, Dm
  'Em': {
    forma: 'Em',
    name: 'Forma Em (Menor)',
    anclaS: 5,
    tipo: 'menor',
    offsets: { 0: 0, 1: 0, 2: 0, 3: 2, 4: 2, 5: 0 },
    fingers: { 0: 0, 1: 0, 2: 0, 3: 3, 4: 2, 5: 0 }
  },

  'Am': {
    forma: 'Am',
    name: 'Forma Am (Menor)',
    anclaS: 4,
    tipo: 'menor',
    offsets: { 0: 0, 1: 1, 2: 2, 3: 2, 4: 0, 5: -1 },
    fingers: { 0: 0, 1: 1, 2: 3, 3: 2, 4: 0, 5: 0 }
  },

  'Dm': {
    forma: 'Dm',
    name: 'Forma Dm (Menor)',
    anclaS: 3,
    tipo: 'menor',
    offsets: { 0: 1, 1: 3, 2: 2, 3: 0, 4: -1, 5: -1 },
    fingers: { 0: 1, 1: 3, 2: 2, 3: 0, 4: 0, 5: 0 }
  }
};

/**
 * Calcula la posición absoluta de un acorde CAGED a partir de la forma y el traste del ancla
 * @param {string} forma - 'C' | 'A' | 'G' | 'E' | 'D' | 'Em' | 'Am' | 'Dm'
 * @param {number} anclaFret - Traste del ancla (0..16)
 */
export function buildCagedChord(forma, anclaFret = 0) {
  const caged = CAGED_FORMS[forma];
  if (!caged) return null;

  const positions = {};
  const baseOffset = caged.offsets[caged.anclaS];

  for (let s = 0; s <= 5; s++) {
    const rel = caged.offsets[s];
    if (rel === -1) {
      positions[s] = { s, f: -1, finger: null, status: 'muted' };
    } else {
      const f = (anclaFret - baseOffset) + rel;
      const finger = caged.fingers[s] || 0;
      positions[s] = {
        s,
        f: Math.max(0, f),
        finger: finger || null,
        status: f === 0 ? 'open' : 'fretted',
        isRoot: s === caged.anclaS
      };
    }
  }

  return {
    forma,
    anclaS: caged.anclaS,
    anclaFret,
    positions
  };
}
