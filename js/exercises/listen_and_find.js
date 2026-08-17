/**
 * GMUSIC EXERCISE RUNNER: listen_and_find (§4.11)
 * Entrenamiento auditivo: el motor reproduce una altura por síntesis;
 * el alumno la localiza en el diapasón.
 */

import { getPitchClass } from '../music/strings.js';
import { getSpelledNote } from '../music/spelling.js';
import { audioEngine } from '../engine/audio-engine.js';

export class ListenAndFindRunner {
  /**
   * Reproduce la altura de prueba para el alumno
   */
  static playReferencePitch(exerciseData) {
    const pc = exerciseData.suenaPc;
    // Buscar una cuerda y traste representativo para reproducir el tono
    // Si pc=4 (E), podemos tocar s:0 f:0 (E4) o s:5 f:0 (E2)
    // Usamos frecuencia estándar aproximada
    const baseMidi = 60 + ((pc - (60 % 12) + 12) % 12);
    // Reproducir nota
    audioEngine.playNote(1, (baseMidi - 59), 2.2, 0.9);
  }

  /**
   * @param {Object} exerciseData - e.g. {
   *   type: "listen_and_find",
   *   suenaPc: 4,
   *   ventana: { vista: "custom", desde: 0, hasta: 4 },
   *   respuesta: { pc: 4 }
   * }
   * @param {Object} userInput - { s: number, f: number }
   */
  static evaluate(exerciseData, userInput) {
    const targetPc = exerciseData.respuesta.pc;
    const userPc = getPitchClass(userInput.s, userInput.f);
    const tonality = exerciseData.tonalidad || { root: 0, tipo: 'mayor' };

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
        feedback: `¡Excelente oído! Has localizado la nota ${spelled.es} (${spelled.en}) en cuerda ${6 - userInput.s}, traste ${userInput.f}.`
      };
    } else {
      const userSpelled = getSpelledNote(userPc, tonality);
      return {
        success: false,
        pc: userPc,
        feedback: `Has tocado ${userSpelled.es} (${userSpelled.en}). Vuelve a escuchar y busca ${spelled.es}.`
      };
    }
  }
}
