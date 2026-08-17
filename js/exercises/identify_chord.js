/**
 * GMUSIC EXERCISE RUNNER: identify_chord (§4.6)
 * El motor dibuja un acorde y el alumno elige entre opciones múltiples.
 */

import { CHORDS } from '../music/chords.js';

export class IdentifyChordRunner {
  /**
   * @param {Object} exerciseData - e.g. {
   *   type: "identify_chord",
   *   muestra: { acorde: "G" },
   *   opciones: ["G", "C", "Em"],
   *   respuesta: "G"
   * }
   * @param {Object} userInput - { seleccion: string }
   */
  static evaluate(exerciseData, userInput) {
    const target = exerciseData.respuesta;
    const isCorrect = userInput.seleccion === target;

    if (isCorrect) {
      return {
        success: true,
        seleccion: userInput.seleccion,
        feedback: `¡Correcto! Es el acorde de ${target}.`
      };
    } else {
      return {
        success: false,
        seleccion: userInput.seleccion,
        feedback: `Has elegido ${userInput.seleccion}. Observa bien la posición de los dedos.`
      };
    }
  }
}
