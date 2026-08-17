/**
 * GMUSIC EXERCISE RUNNER: chord_transition (§4.8)
 * Metrónomo + cambio de acordes + cálculo de dedos ancla.
 * Anclas: misma cuerda s, mismo traste f > 0 y mismo dedo entre acorde actual y siguiente.
 */

import { CHORDS, getAnchorFingers } from '../music/chords.js';

export class ChordTransitionRunner {
  /**
   * @param {Object} exerciseData - e.g. {
   *   type: "chord_transition",
   *   secuencia: ["Am", "C"],
   *   bpm: 60,
   *   cambiaCada: 4,
   *   mostrarAnclas: true
   * }
   */
  static getTransitionPlan(exerciseData) {
    const sequence = exerciseData.secuencia || ['Am', 'C'];
    const plan = [];

    for (let i = 0; i < sequence.length; i++) {
      const currentChordId = `${sequence[i]}-open`;
      const nextChordId = `${sequence[(i + 1) % sequence.length]}-open`;

      const currentChord = CHORDS[currentChordId];
      const nextChord = CHORDS[nextChordId];

      const anchors = exerciseData.mostrarAnclas
        ? getAnchorFingers(currentChordId, nextChordId)
        : [];

      plan.push({
        stepIndex: i,
        chord: currentChord,
        nextChord: nextChord,
        anchors,
        bpm: exerciseData.bpm || 60,
        beatsPerChord: exerciseData.cambiaCada || 4
      });
    }

    return plan;
  }

  /**
   * Evalúa la retención de dedos ancla durante el cambio
   */
  static evaluateTransition(currentChordId, nextChordId, heldFingers) {
    const expectedAnchors = getAnchorFingers(currentChordId, nextChordId);
    let allAnchorsHeld = true;

    expectedAnchors.forEach(a => {
      const isHeld = heldFingers && heldFingers.some(h => h.s === a.s && h.f === a.f && h.finger === a.finger);
      if (!isHeld) allAnchorsHeld = false;
    });

    return {
      success: allAnchorsHeld,
      expectedAnchors,
      feedback: allAnchorsHeld
        ? '¡Excelente cambio fluido manteniendo los dedos ancla fijos!'
        : 'Recuerda no levantar los dedos ancla durante la transición.'
    };
  }
}
