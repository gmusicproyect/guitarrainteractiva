/**
 * GMUSIC SCALES & DOCTRINAL CONTINUITY RULE (abiertaSet)
 * Contract v1.0 (§2.1)
 * 
 * Regla de continuidad del maestro:
 * "La escala es una carrera ascendente: cada nota se toca una vez, donde la
 * continuidad la alcanza. Si una nota falta, se agrega en el traste que corresponde;
 * pero nunca se repite una nota que la cuerda anterior ya proporciona."
 */

import { STRINGS, STRING_BY_S, getMidiNote } from './strings.js';
import { getSpelledNote } from './spelling.js';

export const SCALE_INTERVALS = {
  'mayor': [0, 2, 4, 5, 7, 9, 11],
  'menor': [0, 2, 3, 5, 7, 8, 10],
  'pentatonica-menor': [0, 3, 5, 7, 10],
  'pentatonica-mayor': [0, 2, 4, 7, 9]
};

export const SCALES = {
  'am-pentatonic': {
    root: 'A',
    notes: ['A', 'C', 'D', 'E', 'G']
  },
  'c-major': {
    root: 'C',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  }
};

/**
 * Obtiene los pitch classes (0..11) de una escala dada una tónica y tipo
 */
export function getScalePitchClasses(root = 0, tipo = 'mayor') {
  const intervals = SCALE_INTERVALS[tipo] || SCALE_INTERVALS['mayor'];
  return intervals.map(inter => ((root + inter) % 12 + 12) % 12);
}

/**
 * Genera el conjunto de notas en posición abierta cumpliendo la regla de continuidad (§2.1).
 * Devuelve un array de objetos por cuerda s: 5..0 con sus trastes y notas MIDI.
 * @param {number} root - Tónica de la escala (0=C, 2=D, 7=G...)
 * @param {string} tipo - 'mayor' | 'menor' | 'pentatonica-menor'
 * @returns {Array} posiciones por cuerda s:5..0
 */
export function getAbiertaSet(root = 0, tipo = 'mayor') {
  const scalePcs = getScalePitchClasses(root, tipo);
  
  // 1. Obtener candidatos por cuerda (trastes 0..4)
  // Strings en orden de grave a agudo: s:5, s:4, s:3, s:2, s:1, s:0
  const stringOrder = [5, 4, 3, 2, 1, 0];
  const candidatesByString = {};

  stringOrder.forEach(s => {
    const stringData = STRING_BY_S[s];
    const candidates = [];
    for (let f = 0; f <= 4; f++) {
      const midi = stringData.midi + f;
      const pc = midi % 12;
      if (scalePcs.includes(pc)) {
        candidates.push({ s, f, midi, pc, note: getSpelledNote(pc, { root, tipo }) });
      }
    }
    candidatesByString[s] = candidates;
  });

  // 2. Aplicar la regla de continuidad: para cada cuerda se toman las notas
  // estrictamente por debajo de la primera candidata de la cuerda siguiente.
  const resultByString = {};

  for (let i = 0; i < stringOrder.length; i++) {
    const s = stringOrder[i];
    const currentCandidates = candidatesByString[s];

    if (i === stringOrder.length - 1) {
      // 1ª cuerda (s:0): no hay cuerda siguiente, se toman todas sus candidatas
      resultByString[s] = currentCandidates;
    } else {
      const nextS = stringOrder[i + 1];
      const nextCandidates = candidatesByString[nextS];
      const firstNextMidi = nextCandidates.length > 0 ? nextCandidates[0].midi : 999;

      // Filtrar notas con midi < firstNextMidi
      resultByString[s] = currentCandidates.filter(c => c.midi < firstNextMidi);
    }
  }

  return resultByString;
}

/**
 * Devuelve el formato de prueba canónico 6ª→1ª (p.ej. "023-024-024-02-023-023")
 */
export function getAbiertaFretsString(root = 0, tipo = 'mayor') {
  const abierta = getAbiertaSet(root, tipo);
  const sOrder = [5, 4, 3, 2, 1, 0]; // 6ª a 1ª
  return sOrder.map(s => {
    return (abierta[s] || []).map(item => item.f).join('');
  }).join('-');
}
