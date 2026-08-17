/**
 * GMUSIC EXERCISE RUNNER: find_fret (§4.2)
 * Valida selección exacta de cuerda s (0..5) y traste f (0..16).
 */

import { STRING_BY_S, getMidiNote } from '../music/strings.js';

export class FindFretRunner {
  /**
   * @param {Object} exerciseData - e.g. { type: "find_fret", pregunta: "Toca el traste 3 de la 6ª cuerda", respuesta: { s: 5, f: 3 } }
   * @param {Object} userInput - { s: number, f: number }
   */
  static evaluate(exerciseData, userInput) {
    const target = exerciseData.respuesta;
    const isCorrect = userInput.s === target.s && userInput.f === target.f;

    const stringData = STRING_BY_S[userInput.s];
    const targetString = STRING_BY_S[target.s];

    if (isCorrect) {
      return {
        success: true,
        s: target.s,
        f: target.f,
        midi: getMidiNote(target.s, target.f),
        feedback: `¡Exacto! Cuerda ${targetString?.stringNumber}, traste ${target.f === 0 ? 'al aire' : target.f}.`
      };
    } else {
      return {
        success: false,
        feedback: `Pulsaste cuerda ${stringData?.stringNumber}, traste ${userInput.f}. Busca cuerda ${targetString?.stringNumber}, traste ${target.f}.`
      };
    }
  }
}
