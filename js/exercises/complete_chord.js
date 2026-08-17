/**
 * GMUSIC EXERCISE RUNNER: complete_chord (§4.7)
 * Dibuja un acorde con un hueco; el alumno coloca la pieza que falta.
 */

import { CHORDS } from '../music/chords.js';
import { STRING_BY_S } from '../music/strings.js';

export class CompleteChordRunner {
  /**
   * @param {Object} exerciseData - e.g. {
   *   type: "complete_chord",
   *   acorde: "C",
   *   dadas: [ {"s":4,"f":3}, {"s":2,"f":0}, {"s":1,"f":1}, {"s":0,"f":0} ],
   *   respuesta: { "s":3, "f":2 }
   * }
   * @param {Object} userInput - { s: number, f: number }
   */
  static evaluate(exerciseData, userInput) {
    const target = exerciseData.respuesta;
    const isCorrect = userInput.s === target.s && userInput.f === target.f;

    const targetStr = STRING_BY_S[target.s];

    if (isCorrect) {
      return {
        success: true,
        s: target.s,
        f: target.f,
        feedback: `¡Perfecto! Completaste el acorde de ${exerciseData.acorde} colocando la nota en cuerda ${targetStr?.stringNumber}, traste ${target.f}.`
      };
    } else {
      return {
        success: false,
        feedback: `Esa posición no completa el acorde de ${exerciseData.acorde}. Intenta en la cuerda ${targetStr?.stringNumber}.`
      };
    }
  }
}
