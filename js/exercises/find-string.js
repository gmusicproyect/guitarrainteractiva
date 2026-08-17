/**
 * GMUSIC EXERCISE RUNNER: find_string (§4.1)
 * Evaluates whether the plucked string s matches the target string s.
 * Contract: { type: "find_string", pregunta: "...", respuesta: { s: 4 } }
 */

import { STRING_BY_S } from '../music/strings.js';
import { SPELL } from '../music/spelling.js';

export class FindStringRunner {
  /**
   * @param {Object} exerciseData - e.g. { type: "find_string", pregunta: "Toca la cuerda La", respuesta: { s: 4 } }
   * @param {Object} userInput - { s: number }
   * @returns {Object} result - { success: boolean, feedback: string, stringData: Object }
   */
  static evaluate(exerciseData, userInput) {
    const targetS = exerciseData.respuesta ? exerciseData.respuesta.s : (exerciseData.target ? exerciseData.target.s : 0);
    const userS = userInput.s;
    const stringData = STRING_BY_S[userS];
    const isCorrect = userS === targetS;

    if (isCorrect) {
      return {
        success: true,
        feedback: exerciseData.feedbackOk || `¡Exacto! Esa es la cuerda ${stringData.stringNumber}: ${stringData.noteEs}.`,
        stringData,
        noteLabel: `${stringData.noteEs} · ${stringData.noteEn}`,
        stringLabel: `${stringData.stringNumber}ª Cuerda`
      };
    } else {
      return {
        success: false,
        feedback: `Tocaste la cuerda ${stringData.stringNumber} (${stringData.noteEs}). Intenta buscar la cuerda ${STRING_BY_S[targetS]?.stringNumber}.`,
        stringData,
        noteLabel: `${stringData.noteEs} · ${stringData.noteEn}`,
        stringLabel: `${stringData.stringNumber}ª Cuerda`
      };
    }
  }
}
