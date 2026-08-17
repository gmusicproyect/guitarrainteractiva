/**
 * GMUSIC EXERCISE RUNNER: place_finger (§4.4)
 * Evaluates placing finger (1..4) on specific string s (0..5) and fret f (0..16).
 * Contract: { type: "place_finger", instruccion: "Dedo 1 → 3ª cuerda, traste 1", respuesta: { s: 2, f: 1, dedo: 1 } }
 */

import { STRING_BY_S } from '../music/strings.js';

export class PlaceFingerRunner {
  /**
   * @param {Object} exerciseData - e.g. { type: "place_finger", instruccion: "...", respuesta: { s: 2, f: 1, dedo: 1 } }
   * @param {Object} userInput - { s: number, f: number, dedo?: number, finger?: number }
   */
  static evaluate(exerciseData, userInput) {
    const target = exerciseData.respuesta || exerciseData.target || {};
    const targetFinger = target.dedo !== undefined ? target.dedo : target.finger;
    const userFinger = userInput.dedo !== undefined ? userInput.dedo : userInput.finger;

    const isCorrect = userInput.s === target.s && userInput.f === target.f &&
      (userFinger === undefined || userFinger === targetFinger);

    const stringData = STRING_BY_S[userInput.s];

    if (isCorrect) {
      return {
        success: true,
        finger: targetFinger,
        dedo: targetFinger,
        s: target.s,
        f: target.f,
        note: target.note,
        feedback: exerciseData.feedbackOk || `¡Correcto! Dedo ${targetFinger} colocado en cuerda ${stringData?.stringNumber}, traste ${target.f}.`
      };
    } else {
      return {
        success: false,
        finger: targetFinger,
        dedo: targetFinger,
        feedback: `Colocaste el dedo en la cuerda ${stringData?.stringNumber}, traste ${userInput.f}. El objetivo es cuerda ${STRING_BY_S[target.s]?.stringNumber}, traste ${target.f}.`
      };
    }
  }
}
