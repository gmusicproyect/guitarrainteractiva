/**
 * GMUSIC EXERCISE ENGINE (v1.0 Contrato de Ejercicios)
 * Despacha y evalúa los 11 tipos canónicos de ejercicios definidos en el contrato:
 * 
 * 4.1  find_string        — encuentra una cuerda
 * 4.2  find_fret          — encuentra un traste
 * 4.3  find_note          — encuentra una nota (con deletreo tonal)
 * 4.4  place_finger       — coloca un dedo concreto
 * 4.5  build_chord        — construye un acorde (abierto o CAGED)
 * 4.6  identify_chord     — identifica un acorde
 * 4.7  complete_chord     — completa la nota faltante
 * 4.8  chord_transition   — cambio de acordes con dedos ancla
 * 4.9  play_sequence      — toca una secuencia (escala continua / progresión)
 * 4.10 multiple_choice    — pregunta conceptual
 * 4.11 listen_and_find     — escucha y encuentra en el diapasón
 */

import { FindStringRunner } from '../exercises/find-string.js';
import { FindFretRunner } from '../exercises/find_fret.js';
import { FindNoteRunner } from '../exercises/find_note.js';
import { PlaceFingerRunner } from '../exercises/place-finger.js';
import { BuildChordRunner } from '../exercises/build-chord.js';
import { IdentifyChordRunner } from '../exercises/identify_chord.js';
import { CompleteChordRunner } from '../exercises/complete_chord.js';
import { ChordTransitionRunner } from '../exercises/chord_transition.js';
import { PlaySequenceRunner } from '../exercises/play_sequence.js';
import { MultipleChoiceRunner } from '../exercises/multiple_choice.js';
import { ListenAndFindRunner } from '../exercises/listen_and_find.js';

export class ExerciseEngine {
  constructor() {
    this.runners = {
      'find_string': FindStringRunner,
      'find_fret': FindFretRunner,
      'find_note': FindNoteRunner,
      'place_finger': PlaceFingerRunner,
      'build_chord': BuildChordRunner,
      'identify_chord': IdentifyChordRunner,
      'complete_chord': CompleteChordRunner,
      'chord_transition': ChordTransitionRunner,
      'play_sequence': PlaySequenceRunner,
      'multiple_choice': MultipleChoiceRunner,
      'listen_and_find': ListenAndFindRunner
    };
  }

  /**
   * Evalúa la respuesta del usuario para cualquier tipo de ejercicio
   * @param {Object} exerciseData - Tarjeta de ejercicio declarativa
   * @param {Object} userInput - Entrada del usuario
   */
  evaluate(exerciseData, userInput) {
    const runner = this.runners[exerciseData.type];
    if (!runner) {
      console.error(`Unknown exercise type: ${exerciseData.type}`);
      return { success: false, feedback: `Tipo de ejercicio no soportado: ${exerciseData.type}` };
    }
    return runner.evaluate(exerciseData, userInput);
  }

  /**
   * Obtiene el runner para operaciones auxiliares (p.ej. generar planes de secuencia o reproducir audio)
   */
  getRunner(type) {
    return this.runners[type] || null;
  }
}

export const exerciseEngine = new ExerciseEngine();
