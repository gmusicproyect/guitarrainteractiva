/**
 * GMUSIC CANONICAL SPELLING TABLE (SPELL)
 * Contract v1.0 (§1.4)
 * 
 * 12 Tonalidades canónicas del libro (pág. 22):
 * Sostenidos: C, G, D, A, E, B, F♯
 * Bemoles: D♭, A♭, E♭, B♭, F
 * 
 * Reglas:
 * 1. Tonalidades con ♯ deletrean con sostenidos; con ♭ con bemoles.
 * 2. El modo menor hereda el deletreo de su relativa mayor (tónica + 3 semitonos).
 * 3. En Fa♯ mayor, el 7º grado es Mi♯ (E♯) (pitchClass 5).
 * 4. SPELL[rootMayor][pitchClass] → nombre. El motor NUNCA inventa deletreos.
 */

// Pitch classes: 0=C, 1=C#/Db, 2=D, 3=D#/Eb, 4=E, 5=F, 6=F#/Gb, 7=G, 8=G#/Ab, 9=A, 10=A#/Bb, 11=B

export const CANONICAL_TONALITIES = [
  // Círculo de quintas (Sostenidos)
  { id: 'C',  root: 0,  nameEn: 'C',  nameEs: 'Do',  accidental: 'natural' },
  { id: 'G',  root: 7,  nameEn: 'G',  nameEs: 'Sol', accidental: 'sharp' },
  { id: 'D',  root: 2,  nameEn: 'D',  nameEs: 'Re',  accidental: 'sharp' },
  { id: 'A',  root: 9,  nameEn: 'A',  nameEs: 'La',  accidental: 'sharp' },
  { id: 'E',  root: 4,  nameEn: 'E',  nameEs: 'Mi',  accidental: 'sharp' },
  { id: 'B',  root: 11, nameEn: 'B',  nameEs: 'Si',  accidental: 'sharp' },
  { id: 'F#', root: 6,  nameEn: 'F#', nameEs: 'Fa#', accidental: 'sharp' },
  // Círculo de quintas (Bemoles)
  { id: 'Db', root: 1,  nameEn: 'Db', nameEs: 'Re♭', accidental: 'flat' },
  { id: 'Ab', root: 8,  nameEn: 'Ab', nameEs: 'La♭', accidental: 'flat' },
  { id: 'Eb', root: 3,  nameEn: 'Eb', nameEs: 'Mi♭', accidental: 'flat' },
  { id: 'Bb', root: 10, nameEn: 'Bb', nameEs: 'Si♭', accidental: 'flat' },
  { id: 'F',  root: 5,  nameEn: 'F',  nameEs: 'Fa',  accidental: 'flat' }
];

export const SPELL = {
  // C Mayor (Natural)
  0: {
    0: { en: 'C', es: 'Do' },
    1: { en: 'C#', es: 'Do#' },
    2: { en: 'D', es: 'Re' },
    3: { en: 'D#', es: 'Re#' },
    4: { en: 'E', es: 'Mi' },
    5: { en: 'F', es: 'Fa' },
    6: { en: 'F#', es: 'Fa#' },
    7: { en: 'G', es: 'Sol' },
    8: { en: 'G#', es: 'Sol#' },
    9: { en: 'A', es: 'La' },
    10: { en: 'A#', es: 'La#' },
    11: { en: 'B', es: 'Si' }
  },

  // G Mayor (1 sostenido: F#)
  7: {
    0: { en: 'C', es: 'Do' },
    1: { en: 'C#', es: 'Do#' },
    2: { en: 'D', es: 'Re' },
    3: { en: 'D#', es: 'Re#' },
    4: { en: 'E', es: 'Mi' },
    5: { en: 'F', es: 'Fa' },
    6: { en: 'F#', es: 'Fa#' },
    7: { en: 'G', es: 'Sol' },
    8: { en: 'G#', es: 'Sol#' },
    9: { en: 'A', es: 'La' },
    10: { en: 'A#', es: 'La#' },
    11: { en: 'B', es: 'Si' }
  },

  // D Mayor (2 sostenidos: F#, C#)
  2: {
    0: { en: 'C', es: 'Do' },
    1: { en: 'C#', es: 'Do#' },
    2: { en: 'D', es: 'Re' },
    3: { en: 'D#', es: 'Re#' },
    4: { en: 'E', es: 'Mi' },
    5: { en: 'F', es: 'Fa' },
    6: { en: 'F#', es: 'Fa#' },
    7: { en: 'G', es: 'Sol' },
    8: { en: 'G#', es: 'Sol#' },
    9: { en: 'A', es: 'La' },
    10: { en: 'A#', es: 'La#' },
    11: { en: 'B', es: 'Si' }
  },

  // A Mayor (3 sostenidos: F#, C#, G#)
  9: {
    0: { en: 'B#', es: 'Si#' },
    1: { en: 'C#', es: 'Do#' },
    2: { en: 'D', es: 'Re' },
    3: { en: 'D#', es: 'Re#' },
    4: { en: 'E', es: 'Mi' },
    5: { en: 'F', es: 'Fa' },
    6: { en: 'F#', es: 'Fa#' },
    7: { en: 'G', es: 'Sol' },
    8: { en: 'G#', es: 'Sol#' },
    9: { en: 'A', es: 'La' },
    10: { en: 'A#', es: 'La#' },
    11: { en: 'B', es: 'Si' }
  },

  // E Mayor (4 sostenidos: F#, C#, G#, D#)
  4: {
    0: { en: 'C', es: 'Do' },
    1: { en: 'C#', es: 'Do#' },
    2: { en: 'D', es: 'Re' },
    3: { en: 'D#', es: 'Re#' },
    4: { en: 'E', es: 'Mi' },
    5: { en: 'F', es: 'Fa' },
    6: { en: 'F#', es: 'Fa#' },
    7: { en: 'G', es: 'Sol' },
    8: { en: 'G#', es: 'Sol#' },
    9: { en: 'A', es: 'La' },
    10: { en: 'A#', es: 'La#' },
    11: { en: 'B', es: 'Si' }
  },

  // B Mayor (5 sostenidos: F#, C#, G#, D#, A#)
  11: {
    0: { en: 'C', es: 'Do' },
    1: { en: 'C#', es: 'Do#' },
    2: { en: 'D', es: 'Re' },
    3: { en: 'D#', es: 'Re#' },
    4: { en: 'E', es: 'Mi' },
    5: { en: 'F', es: 'Fa' },
    6: { en: 'F#', es: 'Fa#' },
    7: { en: 'G', es: 'Sol' },
    8: { en: 'G#', es: 'Sol#' },
    9: { en: 'A', es: 'La' },
    10: { en: 'A#', es: 'La#' },
    11: { en: 'B', es: 'Si' }
  },

  // F# Mayor (6 sostenidos: F#, C#, G#, D#, A#, E#)
  // §1.4 Regla: el 7º grado es Mi# (E#) en pc:5
  6: {
    0: { en: 'B#', es: 'Si#' },
    1: { en: 'C#', es: 'Do#' },
    2: { en: 'D', es: 'Re' },
    3: { en: 'D#', es: 'Re#' },
    4: { en: 'E', es: 'Mi' },
    5: { en: 'E#', es: 'Mi#' }, // 7º grado canónico
    6: { en: 'F#', es: 'Fa#' },
    7: { en: 'Fx', es: 'Fa𝄪' },
    8: { en: 'G#', es: 'Sol#' },
    9: { en: 'A', es: 'La' },
    10: { en: 'A#', es: 'La#' },
    11: { en: 'B', es: 'Si' }
  },

  // F Mayor (1 bemol: Bb)
  5: {
    0: { en: 'C', es: 'Do' },
    1: { en: 'Db', es: 'Re♭' },
    2: { en: 'D', es: 'Re' },
    3: { en: 'Eb', es: 'Mi♭' },
    4: { en: 'E', es: 'Mi' },
    5: { en: 'F', es: 'Fa' },
    6: { en: 'Gb', es: 'Sol♭' },
    7: { en: 'G', es: 'Sol' },
    8: { en: 'Ab', es: 'La♭' },
    9: { en: 'A', es: 'La' },
    10: { en: 'Bb', es: 'Si♭' },
    11: { en: 'B', es: 'Si' }
  },

  // Bb Mayor (2 bemoles: Bb, Eb)
  10: {
    0: { en: 'C', es: 'Do' },
    1: { en: 'Db', es: 'Re♭' },
    2: { en: 'D', es: 'Re' },
    3: { en: 'Eb', es: 'Mi♭' },
    4: { en: 'E', es: 'Mi' },
    5: { en: 'F', es: 'Fa' },
    6: { en: 'Gb', es: 'Sol♭' },
    7: { en: 'G', es: 'Sol' },
    8: { en: 'Ab', es: 'La♭' },
    9: { en: 'A', es: 'La' },
    10: { en: 'Bb', es: 'Si♭' },
    11: { en: 'B', es: 'Si' }
  },

  // Eb Mayor (3 bemoles: Bb, Eb, Ab)
  3: {
    0: { en: 'C', es: 'Do' },
    1: { en: 'Db', es: 'Re♭' },
    2: { en: 'D', es: 'Re' },
    3: { en: 'Eb', es: 'Mi♭' },
    4: { en: 'Fb', es: 'Fa♭' },
    5: { en: 'F', es: 'Fa' },
    6: { en: 'Gb', es: 'Sol♭' },
    7: { en: 'G', es: 'Sol' },
    8: { en: 'Ab', es: 'La♭' },
    9: { en: 'A', es: 'La' },
    10: { en: 'Bb', es: 'Si♭' },
    11: { en: 'B', es: 'Si' }
  },

  // Ab Mayor (4 bemoles: Bb, Eb, Ab, Db)
  8: {
    0: { en: 'C', es: 'Do' },
    1: { en: 'Db', es: 'Re♭' },
    2: { en: 'D', es: 'Re' },
    3: { en: 'Eb', es: 'Mi♭' },
    4: { en: 'Fb', es: 'Fa♭' },
    5: { en: 'F', es: 'Fa' },
    6: { en: 'Gb', es: 'Sol♭' },
    7: { en: 'G', es: 'Sol' },
    8: { en: 'Ab', es: 'La♭' },
    9: { en: 'A', es: 'La' },
    10: { en: 'Bb', es: 'Si♭' },
    11: { en: 'C♭', es: 'Do♭' }
  },

  // Db Mayor (5 bemoles: Bb, Eb, Ab, Db, Gb)
  1: {
    0: { en: 'C', es: 'Do' },
    1: { en: 'Db', es: 'Re♭' },
    2: { en: 'E♭♭', es: 'Mi♭♭' },
    3: { en: 'Eb', es: 'Mi♭' },
    4: { en: 'Fb', es: 'Fa♭' },
    5: { en: 'F', es: 'Fa' },
    6: { en: 'Gb', es: 'Sol♭' },
    7: { en: 'G', es: 'Sol' },
    8: { en: 'Ab', es: 'La♭' },
    9: { en: 'A', es: 'La' },
    10: { en: 'Bb', es: 'Si♭' },
    11: { en: 'Cb', es: 'Do♭' }
  }
};

/**
 * Obtiene el nombre canónico de un pitchClass según la tonalidad activa
 * @param {number} pitchClass - 0..11
 * @param {Object} tonalidad - { root: number, tipo: 'mayor' | 'menor' }
 */
export function getSpelledNote(pitchClass, tonalidad = { root: 0, tipo: 'mayor' }) {
  const pc = ((pitchClass % 12) + 12) % 12;
  
  // Si es modo menor, hereda el deletreo de su relativa mayor (tónica + 3 semitonos)
  let majorRoot = tonalidad.root;
  if (tonalidad.tipo === 'menor') {
    majorRoot = (tonalidad.root + 3) % 12;
  }

  const tonalityMap = SPELL[majorRoot] || SPELL[0];
  return tonalityMap[pc] || { en: 'C', es: 'Do' };
}
