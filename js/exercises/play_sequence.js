/**
 * GMUSIC EXERCISE RUNNER: play_sequence (§4.9)
 * Construye y guía la ejecución de secuencias de escalas (usando regla de continuidad §2.1)
 * o progresiones de acordes con patrones de rasgueo (uno, pulsos, alterno, adorno).
 */

import { getAbiertaSet } from '../music/scales.js';
import { CHORDS } from '../music/chords.js';

export const STRUM_PATTERNS = {
  'uno': [{ dir: 'down', beat: 1 }],
  'pulsos': [{ dir: 'down', beat: 1 }, { dir: 'down', beat: 2 }, { dir: 'down', beat: 3 }, { dir: 'down', beat: 4 }],
  'alterno': [{ dir: 'down', beat: 1 }, { dir: 'up', beat: 1.5 }, { dir: 'down', beat: 2 }, { dir: 'up', beat: 2.5 }, { dir: 'down', beat: 3 }, { dir: 'up', beat: 3.5 }, { dir: 'down', beat: 4 }, { dir: 'up', beat: 4.5 }],
  'adorno': [{ dir: 'down', beat: 1 }, { dir: 'down', beat: 2 }, { dir: 'down', beat: 3 }, { dir: 'up', beat: 3.5 }, { dir: 'down', beat: 4 }, { dir: 'up', beat: 4.5 }]
};

export class PlaySequenceRunner {
  /**
   * Genera el plan de secuencia a partir del descriptor del ejercicio
   */
  static buildPlan(exerciseData) {
    if (exerciseData.escala) {
      const { root, tipo } = exerciseData.escala;
      const abiertaMap = getAbiertaSet(root || 0, tipo || 'mayor');

      // Secuencia ascendente estricta de s:5 a s:0
      const sequence = [];
      const stringOrder = [5, 4, 3, 2, 1, 0];

      stringOrder.forEach(s => {
        const notesOnString = abiertaMap[s] || [];
        notesOnString.forEach(n => {
          sequence.push({
            s: n.s,
            f: n.f,
            midi: n.midi,
            pc: n.pc,
            noteName: n.note.en,
            noteNameEs: n.note.es,
            // Digitación en posición abierta: traste n -> dedo n (§2.2)
            finger: n.f === 0 ? 0 : n.f
          });
        });
      });

      if (exerciseData.idaYVuelta) {
        const vuelta = [...sequence.slice(0, -1)].reverse();
        sequence.push(...vuelta);
      }

      return {
        type: 'scale_sequence',
        bpm: exerciseData.bpm || 70,
        sequence
      };
    } else if (exerciseData.progresion) {
      return {
        type: 'progression_sequence',
        preset: exerciseData.progresion.preset || 'pop',
        pattern: STRUM_PATTERNS[exerciseData.progresion.patron || 'alterno'] || STRUM_PATTERNS['alterno'],
        bpm: exerciseData.bpm || 80
      };
    }
  }

  /**
   * Evalúa si la nota tocada corresponde al paso actual de la secuencia
   */
  static evaluateStep(sequencePlan, currentStepIndex, userInput) {
    const target = sequencePlan.sequence[currentStepIndex];
    if (!target) return { success: false, finished: true };

    const isCorrect = userInput.s === target.s && userInput.f === target.f;

    return {
      success: isCorrect,
      target,
      stepIndex: currentStepIndex,
      finished: isCorrect && (currentStepIndex === sequencePlan.sequence.length - 1),
      feedback: isCorrect
        ? `¡Correcto! ${target.noteNameEs} (${target.noteName}) en cuerda ${6 - target.s}, traste ${target.f}.`
        : `Esperado: cuerda ${6 - target.s}, traste ${target.f} (${target.noteNameEs}).`
    };
  }
}
