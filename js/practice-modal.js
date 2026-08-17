/**
 * GMUSIC · GUIDED PRACTICE MODAL (La menor · Am)
 * Implements an active interactive step-by-step finger placement mini-lesson.
 */

import { guitarAudio } from './audio.js';

export class PracticeModalController {
  constructor() {
    this.modal = document.getElementById('practiceModal');
    this.btnClose = document.getElementById('btnClosePracticeModal');
    this.stepCounter = document.getElementById('practiceStepCounter');
    this.instructionText = document.getElementById('practiceInstruction');
    this.feedbackBox = document.getElementById('practiceFeedbackBox');
    this.feedbackText = document.getElementById('practiceFeedbackText');
    this.btnStrum = document.getElementById('btnPracticeStrumChord');
    this.btnNext = document.getElementById('btnNextPracticeStep');

    // Fretboard spots
    this.spotFinger1 = document.getElementById('spotFinger1');
    this.spotFinger2 = document.getElementById('spotFinger2');
    this.spotFinger3 = document.getElementById('spotFinger3');

    // Practice step state (1 to 4)
    this.currentStep = 1;
    this.fingersPlaced = {
      1: false, // Dedo 1 (2ª cuerda, traste 1 - C4)
      2: false, // Dedo 2 (4ª cuerda, traste 2 - E3)
      3: false  // Dedo 3 (3ª cuerda, traste 2 - A3)
    };

    this.init();
  }

  init() {
    if (!this.modal) return;

    // Close buttons & backdrop click
    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.close());
    }

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Handle interactive finger placements on the fretboard
    if (this.spotFinger1) {
      this.spotFinger1.addEventListener('click', () => this.placeFinger(1, 2, 1, 'C4'));
    }
    if (this.spotFinger2) {
      this.spotFinger2.addEventListener('click', () => this.placeFinger(2, 4, 2, 'E3'));
    }
    if (this.spotFinger3) {
      this.spotFinger3.addEventListener('click', () => this.placeFinger(3, 3, 2, 'A3'));
    }

    // Strum chord test button
    if (this.btnStrum) {
      this.btnStrum.addEventListener('click', () => {
        this.strumAmChord();
      });
    }

    // Next step button
    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => {
        if (this.currentStep < 4) {
          this.advanceToStep(this.currentStep + 1);
        } else {
          this.completeLesson();
        }
      });
    }

    // Connect test chord button on the main page (mini visualizer)
    const btnTestAmChord = document.getElementById('btnTestAmChord');
    if (btnTestAmChord) {
      btnTestAmChord.addEventListener('click', () => {
        guitarAudio.strumChord([-1, 0, 2, 2, 1, 0], true, 38);
      });
    }
  }

  open() {
    this.resetState();
    this.modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    this.updateStepView();
  }

  close() {
    this.modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  resetState() {
    this.currentStep = 1;
    this.fingersPlaced = { 1: false, 2: false, 3: false };

    [this.spotFinger1, this.spotFinger2, this.spotFinger3].forEach(spot => {
      if (spot) {
        spot.classList.remove('finger-placed', 'pulse-target');
      }
    });

    if (this.spotFinger1) this.spotFinger1.innerHTML = '<span class="finger-prompt">Pulsa aquí (Dedo 1)</span>';
    if (this.spotFinger2) this.spotFinger2.innerHTML = '<span class="finger-prompt">Dedo 2</span>';
    if (this.spotFinger3) this.spotFinger3.innerHTML = '<span class="finger-prompt">Dedo 3</span>';

    if (this.btnStrum) this.btnStrum.disabled = true;
    if (this.feedbackBox) this.feedbackBox.classList.remove('success-feedback');
  }

  placeFinger(fingerNum, stringNum, fretNum, noteName) {
    // Sound feedback for the pressed note
    guitarAudio.playString(stringNum, fretNum, 2.0, 0.95);

    this.fingersPlaced[fingerNum] = true;

    // Visual update of the placed spot
    const spot = fingerNum === 1 ? this.spotFinger1 : (fingerNum === 2 ? this.spotFinger2 : this.spotFinger3);
    if (spot) {
      spot.classList.add('finger-placed');
      spot.classList.remove('pulse-target');
      spot.innerHTML = `<span class="finger-prompt">${fingerNum}</span>`;
    }

    // Auto advance if pressing the current step target
    if (fingerNum === this.currentStep && this.currentStep < 4) {
      this.advanceToStep(this.currentStep + 1);
    } else if (this.fingersPlaced[1] && this.fingersPlaced[2] && this.fingersPlaced[3]) {
      this.advanceToStep(4);
    }
  }

  advanceToStep(step) {
    this.currentStep = step;
    this.updateStepView();
  }

  updateStepView() {
    this.stepCounter.textContent = `Paso ${this.currentStep} de 4`;

    // Clear pulse
    [this.spotFinger1, this.spotFinger2, this.spotFinger3].forEach(s => s?.classList.remove('pulse-target'));

    if (this.currentStep === 1) {
      this.instructionText.innerHTML = 'Coloca el <strong>Dedo 1 (Índice)</strong> en la <strong>2ª cuerda, traste 1</strong> (Nota Do / C).';
      this.feedbackText.textContent = 'Haz clic en el traste resaltado con pulso naranja para colocar el dedo.';
      if (!this.fingersPlaced[1] && this.spotFinger1) this.spotFinger1.classList.add('pulse-target');
    } else if (this.currentStep === 2) {
      this.instructionText.innerHTML = 'Coloca el <strong>Dedo 2 (Medio)</strong> en la <strong>4ª cuerda, traste 2</strong> (Nota Mi / E).';
      this.feedbackText.textContent = '¡Bien hecho! Ahora coloca el segundo dedo en la 4ª cuerda.';
      if (!this.fingersPlaced[2] && this.spotFinger2) this.spotFinger2.classList.add('pulse-target');
    } else if (this.currentStep === 3) {
      this.instructionText.innerHTML = 'Coloca el <strong>Dedo 3 (Anular)</strong> en la <strong>3ª cuerda, traste 2</strong> (Nota La / A).';
      this.feedbackText.textContent = 'Casi listo. Coloca el tercer dedo justo debajo del segundo.';
      if (!this.fingersPlaced[3] && this.spotFinger3) this.spotFinger3.classList.add('pulse-target');
    } else if (this.currentStep === 4) {
      this.instructionText.innerHTML = '🎉 <strong>¡Posición de La menor (Am) dominada!</strong>';
      this.feedbackBox.classList.add('success-feedback');
      this.feedbackText.textContent = 'Los 3 dedos están en su sitio. Pulsa el botón para rasguear las 5 cuerdas (La al aire hasta Mi aguda).';
      if (this.btnStrum) {
        this.btnStrum.disabled = false;
        this.btnStrum.classList.add('btn-glow');
      }
      this.btnNext.innerHTML = '<span>Completar lección</span> <span>✓</span>';

      // Auto strum once to delight the user
      setTimeout(() => {
        this.strumAmChord();
      }, 400);
    }
  }

  strumAmChord() {
    // Strings 6 to 1: [-1, 0, 2, 2, 1, 0]
    guitarAudio.strumChord([-1, 0, 2, 2, 1, 0], true, 35);
  }

  completeLesson() {
    this.close();
    // Update main page skill chip for Am
    const amPill = document.querySelector('.skill-chip.current');
    if (amPill) {
      amPill.classList.remove('current');
      amPill.classList.add('completed');
      amPill.textContent = 'Am ✓';
    }
  }
}
