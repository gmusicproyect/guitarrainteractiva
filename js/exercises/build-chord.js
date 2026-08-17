/**
 * GMUSIC EXERCISE RUNNER: build_chord (§4.5)
 * Evaluates full unassisted chord construction against canonical CHORDS definitions
 * or explicit positions and mute lists.
 * Contract: { type: "build_chord", acorde: "Am", posiciones: [...], mute: [5], dedos: {...} }
 */

import { CHORDS } from '../music/chords.js';
import { buildCagedChord } from '../music/caged.js';

export class BuildChordRunner {
  /**
   * @param {Object} exerciseData - e.g. { type: "build_chord", acorde: "Am", ... } or { chordId: "Am-open" }
   * @param {Object} userInput - map of string s -> { f: number, finger?: number }
   */
  static evaluate(exerciseData, userInput) {
    let chord = null;

    if (exerciseData.chordId) {
      chord = CHORDS[exerciseData.chordId];
    } else if (exerciseData.acorde) {
      chord = CHORDS[`${exerciseData.acorde}-open`] || CHORDS[exerciseData.acorde];
    } else if (exerciseData.forma && exerciseData.ancla !== undefined) {
      chord = buildCagedChord(exerciseData.forma, exerciseData.ancla);
    }

    // Si exerciseData trae posiciones explícitas
    if (exerciseData.posiciones) {
      const required = exerciseData.posiciones.filter(p => p.f > 0);
      let allCorrect = true;
      const errors = [];

      required.forEach(req => {
        const userP = userInput[req.s];
        if (!userP || userP.f !== req.f) {
          allCorrect = false;
          errors.push(`Falta nota en cuerda ${6 - req.s}, traste ${req.f}`);
        }
      });

      return {
        success: allCorrect,
        errors,
        feedback: allCorrect
          ? `¡Excelente! Reconoces y construyes el acorde ${exerciseData.acorde || ''} correctamente.`
          : `Revisa la digitación: ${errors[0] || 'Posición incompleta'}.`
      };
    }

    if (!chord) {
      return { success: false, feedback: 'Acorde no reconocido.' };
    }

    const requiredFretted = Object.values(chord.positions).filter(p => p.status === 'fretted');
    let allPlacedCorrectly = true;
    const errors = [];

    requiredFretted.forEach(req => {
      const userPlaced = userInput[req.s];
      if (!userPlaced || userPlaced.f !== req.f) {
        allPlacedCorrectly = false;
        errors.push(`Falta dedo en cuerda ${6 - req.s}, traste ${req.f}`);
      }
    });

    return {
      success: allPlacedCorrectly,
      chord,
      errors,
      feedback: allPlacedCorrectly
        ? `¡Excelente! Reconoces y construyes la forma de ${chord.name || chord.symbol || ''} correctamente.`
        : `Revisa la posición: ${errors[0] || 'Posición incompleta'}.`
    };
  }
}
