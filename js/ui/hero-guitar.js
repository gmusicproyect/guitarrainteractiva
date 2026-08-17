/**
 * GMUSIC HERO GUITAR CONTROLLER (v1.1)
 * Integrates GuitarEngine with declarative ExerciseEngine find_string runner.
 * "La tarjeta declara; el motor ejecuta".
 */

import { GuitarEngine } from '../engine/guitar-engine.js';
import { exerciseEngine } from '../engine/exercise-engine.js';
import { STRING_BY_S } from '../music/strings.js';

export const HERO_MICRO_LESSON_DATA = [
  {
    stepIndex: 0,
    id: 'hero-first-string',
    type: 'find_string',
    prompt: '¿Probamos? <strong>Toca la cuerda más gruesa</strong> (6ª cuerda: Mi grave).',
    subtext: 'Haz clic, toca o pulsa la tecla Espacio en la 6ª cuerda.',
    target: { s: 5 },
    feedbackOk: '¡Exacto! Esa es la 6ª cuerda: <strong>Mi</strong>. Ahora encuentra la cuerda <strong>La (5ª cuerda)</strong>.'
  },
  {
    stepIndex: 1,
    id: 'hero-second-string',
    type: 'find_string',
    prompt: 'Ahora encuentra la cuerda <strong>La (5ª cuerda)</strong>.',
    subtext: 'Pulsa la quinta cuerda.',
    target: { s: 4 },
    feedbackOk: '🎉 <strong>Completaste tu primer ejercicio interactivo en GMusic</strong>.'
  }
];

export class HeroGuitarUI {
  constructor() {
    this.container = document.getElementById('heroGuitar');
    this.microLessonBox = document.getElementById('microLessonBox');
    this.lessonStatusIcon = document.getElementById('lessonStatusIcon');
    this.lessonPromptText = document.getElementById('lessonPromptText');
    this.lessonSubtext = document.getElementById('lessonSubtext');
    this.feedbackStringLbl = document.getElementById('feedbackStringLbl');
    this.feedbackNoteLbl = document.getElementById('feedbackNoteLbl');

    this.currentStepIndex = 0;
    this.isCompleted = false;

    this.init();
  }

  init() {
    if (!this.container) return;

    // Instantiate unified GuitarEngine in hero-open view
    this.guitar = new GuitarEngine({
      container: this.container,
      view: 'hero-open',
      fromFret: 0,
      toFret: 0,
      interactive: true,
      onStringPluck: ({ s, note, stringData }) => this.handlePluck(s, stringData)
    });

    this.renderCurrentStep();
  }

  handlePluck(s, stringData) {
    // Update badge feedback
    if (this.feedbackStringLbl && this.feedbackNoteLbl) {
      this.feedbackStringLbl.textContent = `${stringData.stringNumber}ª Cuerda`;
      this.feedbackNoteLbl.textContent = `${stringData.noteEs} · ${stringData.noteEn}`;
    }

    if (this.isCompleted) return;

    const currentExercise = HERO_MICRO_LESSON_DATA[this.currentStepIndex];
    if (!currentExercise) return;

    // Evaluate via Exercise Engine
    const result = exerciseEngine.evaluate(currentExercise, { s });

    if (result.success) {
      this.showSuccessFlash();
      if (this.currentStepIndex === 0) {
        this.currentStepIndex = 1;
        this.renderCurrentStep();
      } else if (this.currentStepIndex === 1) {
        this.isCompleted = true;
        this.renderCompletion();
      }
    } else {
      if (this.lessonSubtext) {
        this.lessonSubtext.textContent = result.feedback;
      }
    }
  }

  renderCurrentStep() {
    const exercise = HERO_MICRO_LESSON_DATA[this.currentStepIndex];
    if (!exercise) return;

    this.guitar.highlightString(exercise.target.s, 'target-string');

    if (this.lessonStatusIcon) this.lessonStatusIcon.textContent = this.currentStepIndex === 0 ? '🎸' : '🟢';
    if (this.lessonPromptText) this.lessonPromptText.innerHTML = exercise.prompt;
    if (this.lessonSubtext) this.lessonSubtext.textContent = exercise.subtext;

    const targetStr = STRING_BY_S[exercise.target.s];
    if (this.feedbackStringLbl && this.feedbackNoteLbl && targetStr) {
      this.feedbackStringLbl.textContent = `${targetStr.stringNumber}ª Cuerda`;
      this.feedbackNoteLbl.textContent = `${targetStr.noteEs} · ${targetStr.noteEn}`;
    }
  }

  renderCompletion() {
    this.guitar.clearStringHighlights();

    if (this.lessonStatusIcon) this.lessonStatusIcon.textContent = '🎉';
    if (this.lessonPromptText) {
      this.lessonPromptText.innerHTML = '🎉 <strong>Completaste tu primer ejercicio interactivo en GMusic</strong>.';
    }
    if (this.lessonSubtext) {
      this.lessonSubtext.innerHTML = '<span class="text-done">✓ Presentación completada.</span> Abre Ruta y continúa con la Clase 1: Las seis cuerdas.';
    }
    if (this.feedbackStringLbl) this.feedbackStringLbl.textContent = '¡Listo!';
    if (this.feedbackNoteLbl) this.feedbackNoteLbl.textContent = '✓ Logrado';

    // Highlight next step
    const nextStepSection = document.getElementById('siguiente-paso');
    if (nextStepSection) {
      nextStepSection.classList.add('highlight-pulse');
    }
  }

  showSuccessFlash() {
    if (!this.microLessonBox) return;
    this.microLessonBox.classList.add('success');
    setTimeout(() => {
      this.microLessonBox.classList.remove('success');
    }, 1200);
  }
}
