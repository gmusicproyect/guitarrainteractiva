/**
 * GMUSIC EXERCISE RUNNER: find_note (§4.3)
 * Encuentra cualquier posición cuya altura coincida con pc (0..11) dentro de la ventana.
 * La etiqueta usa el deletreo de la tonalidad (§1.4).
 */

import { getPitchClass, getMidiNote } from '../music/strings.js';
import { getSpelledNote } from '../music/spelling.js';

export class FindNoteRunner {
  /**
   * @param {Object} exerciseData - e.g. {
   *   type: "find_note",
   *   pregunta: "Encuentra un Do",
   *   tonalidad: { root: 0, tipo: "mayor" },
   *   respuesta: { pc: 0 },
   *   ventana: { vista: "custom", desde: 0, hasta: 5 }
   * }
   * @param {Object} userInput - { s: number, f: number }
   */
  static evaluate(exerciseData, userInput) {
    const targetPc = exerciseData.respuesta.pc;
    const userPc = getPitchClass(userInput.s, userInput.f);
    const tonality = exerciseData.tonalidad || { root: 0, tipo: 'mayor' };

    // Verificar si está dentro de la ventana (si se declara)
    const ventana = exerciseData.ventana;
    if (ventana && ventana.vista === 'custom') {
      if (userInput.f < ventana.desde || userInput.f > ventana.hasta) {
        return {
          success: false,
          feedback: `La nota debe estar dentro de la ventana de trastes ${ventana.desde} al ${ventana.hasta}.`
        };
      }
    }

    const isCorrect = userPc === targetPc;
    const spelled = getSpelledNote(targetPc, tonality);

    if (isCorrect) {
      return {
        success: true,
        s: userInput.s,
        f: userInput.f,
        pc: userPc,
        noteName: spelled.en,
        noteNameEs: spelled.es,
        feedback: `¡Correcto! Encontraste un ${spelled.es} (${spelled.en}) en la cuerda ${6 - userInput.s}, traste ${userInput.f}.`
      };
    } else {
      const userSpelled = getSpelledNote(userPc, tonality);
      return {
        success: false,
        pc: userPc,
        feedback: `Esa nota es ${userSpelled.es} (${userSpelled.en}). Sigue buscando ${spelled.es}.`
      };
    }
  }
}
