/**
 * GMUSIC GUIDED PRACTICE MODAL: La menor · Am (v1.1)
 * 7-step progressive pedagogical flow using place_finger and build_chord.
 * Metric honesty: Certifies conceptual knowledge and fingering recognition.
 */

import { CHORDS } from '../music/chords.js';
import { audioEngine } from '../engine/audio-engine.js';
import { exerciseEngine } from '../engine/exercise-engine.js';
import { STRING_BY_S } from '../music/strings.js';

export class PracticeViewUI {
  constructor() {
    this.modal = document.getElementById('practiceModal');
    this.btnClose = document.getElementById('btnClosePracticeModal');
    this.stepCounter = document.getElementById('practiceStepCounter');
    this.instructionText = document.getElementById('practiceInstruction');
    this.feedbackBox = document.getElementById('practiceFeedbackBox');
    this.feedbackText = document.getElementById('practiceFeedbackText');
    this.btnStrum = document.getElementById('btnPracticeStrumChord');
    this.btnNext = document.getElementById('btnNextPracticeStep');
    this.fretboardContainer = document.getElementById('practiceFretboard');

    this.chordData = CHORDS['Am-open'];
    this.currentStep = 1; // 1 to 7

    // Tracking user placed fingers { 1: {s, f}, 2: {s, f}, 3: {s, f} }
    this.placedFingers = {};

    this.init();
  }

  init() {
    if (!this.modal) return;

    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.close());
    }

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    if (this.btnStrum) {
      this.btnStrum.addEventListener('click', () => {
        audioEngine.strumChord(this.chordData.strumArray, true, 35);
      });
    }

    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => {
        if (this.currentStep < 7) {
          this.setStep(this.currentStep + 1);
        } else {
          this.finish();
        }
      });
    }

    // Mini visualizer on next step card
    const btnTestAmChord = document.getElementById('btnTestAmChord');
    if (btnTestAmChord) {
      btnTestAmChord.addEventListener('click', () => {
        audioEngine.strumChord(this.chordData.strumArray, true, 35);
      });
    }
  }

  open() {
    this.modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    this.setStep(1);
  }

  close() {
    this.modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  setStep(step) {
    this.currentStep = step;
    this.stepCounter.textContent = `Paso ${this.currentStep} de 7`;
    this.renderFretboardForCurrentStep();
    this.updateStepCopy();
  }

  updateStepCopy() {
    if (this.feedbackBox) this.feedbackBox.classList.remove('success-feedback');
    if (this.btnStrum) this.btnStrum.disabled = (this.currentStep < 5);

    if (this.currentStep === 1) {
      // Step 1: Present chord & listen
      this.instructionText.innerHTML = '<strong>La menor (Am)</strong>: Acorde fundamental con tónica en 5ª cuerda al aire. Escucha su sonido.';
      this.feedbackText.textContent = 'Pulsa el botón de rasgueo para familiarizarte con su color armónico.';
      if (this.btnStrum) this.btnStrum.disabled = false;
      this.btnNext.innerHTML = '<span>Comenzar colocación</span> <span>→</span>';
    } else if (this.currentStep === 2) {
      // Step 2: Finger 1 on string 2 (s:1), fret 1
      this.instructionText.innerHTML = 'Coloca el <strong>Dedo 1 (Índice)</strong> en la <strong>2ª cuerda, traste 1</strong> (Nota Do).';
      this.feedbackText.textContent = 'Pulsa el traste resaltado con pulso naranja.';
      this.btnNext.innerHTML = '<span>Siguiente dedo</span> <span>→</span>';
    } else if (this.currentStep === 3) {
      // Step 3: Finger 2 on string 4 (s:3), fret 2
      this.instructionText.innerHTML = 'Coloca el <strong>Dedo 2 (Medio)</strong> en la <strong>4ª cuerda, traste 2</strong> (Nota Mi).';
      this.feedbackText.textContent = 'Coloca el segundo dedo cerca del metal del traste 2.';
    } else if (this.currentStep === 4) {
      // Step 4: Finger 3 on string 3 (s:2), fret 2
      this.instructionText.innerHTML = 'Coloca el <strong>Dedo 3 (Anular)</strong> en la <strong>3ª cuerda, traste 2</strong> (Nota La).';
      this.feedbackText.textContent = 'Coloca el tercer dedo justo debajo del segundo dedo.';
    } else if (this.currentStep === 5) {
      // Step 5: Full chord overview
      this.instructionText.innerHTML = '🎸 <strong>Forma completa de La menor (Am)</strong>: 5 cuerdas activas, 6ª cuerda silenciada.';
      this.feedbackBox.classList.add('success-feedback');
      this.feedbackText.textContent = '¡Excelente! Ahora rasguea desde la 5ª cuerda hacia abajo.';
      if (this.btnStrum) this.btnStrum.disabled = false;
      this.btnNext.innerHTML = '<span>Prueba sin ayuda</span> <span>→</span>';
      audioEngine.strumChord(this.chordData.strumArray, true, 35);
    } else if (this.currentStep === 6) {
      // Step 6: Build without visual aids (build_chord)
      this.instructionText.innerHTML = '🎯 <strong>Construye Am sin ayudas</strong>: Coloca los tres dedos en sus posiciones correctas.';
      this.feedbackText.textContent = 'Haz clic en los trastes para posicionar los dedos 1, 2 y 3.';
      this.btnNext.innerHTML = '<span>Validar acorde</span> <span>✓</span>';
    } else if (this.currentStep === 7) {
      // Step 7: Completed (Honest metric)
      this.instructionText.innerHTML = '🎉 <strong>Ejercicio completado</strong>';
      this.feedbackBox.classList.add('success-feedback');
      this.feedbackText.textContent = 'Reconoces la digitación de La menor (Am) y la construcción de sus 3 dedos.';
      if (this.btnStrum) this.btnStrum.disabled = false;
      this.btnNext.innerHTML = '<span>Finalizar lección</span> <span>✓</span>';
      audioEngine.strumChord(this.chordData.strumArray, true, 35);
    }
  }

  renderFretboardForCurrentStep() {
    if (!this.fretboardContainer) return;
    this.fretboardContainer.innerHTML = '';

    // Render 4 fret columns: Fret 0 (Nut/Open), Fret 1, Fret 2, Fret 3
    for (let f = 0; f <= 3; f++) {
      const col = document.createElement('div');
      col.className = `fret-col fret-${f}`;

      const header = document.createElement('div');
      header.className = 'fret-header-lbl';
      header.textContent = f === 0 ? 'Al aire' : `Traste ${f}`;
      col.appendChild(header);

      // 6 Strings: s:0 (top) down to s:5 (bottom)
      // Display order: 1st string (s:0), 2nd string (s:1), 3rd string (s:2), 4th string (s:3), 5th string (s:4), 6th string (s:5)
      for (let s = 0; s <= 5; s++) {
        const cell = document.createElement('div');
        cell.className = 'fret-cell';
        cell.dataset.s = s;
        cell.dataset.f = f;

        const stringInfo = STRING_BY_S[s];

        if (f === 0) {
          // Open string status in Am
          if (s === 5) {
            cell.classList.add('muted-cell');
            cell.innerHTML = '<span title="6ª Cuerda silenciada">✕</span>';
          } else if (s === 4) {
            cell.classList.add('open-active');
            cell.innerHTML = '<span title="5ª Cuerda La (Tónica)">A2 ★</span>';
          } else if (s === 0) {
            cell.classList.add('open-active');
            cell.innerHTML = '<span title="1ª Cuerda Mi al aire">E4</span>';
          } else {
            cell.innerHTML = `<span>${stringInfo.noteEn}</span>`;
          }
        } else {
          // Frets 1, 2, 3
          this.decorateInteractiveFretCell(cell, s, f);
        }

        col.appendChild(cell);
      }

      this.fretboardContainer.appendChild(col);
    }
  }

  decorateInteractiveFretCell(cell, s, f) {
    // Check if cell is an Am target
    // Finger 1: s:1 (2nd string), f:1
    // Finger 2: s:3 (4th string), f:2
    // Finger 3: s:2 (3rd string), f:2
    let targetFinger = null;
    if (s === 1 && f === 1) targetFinger = 1;
    if (s === 3 && f === 2) targetFinger = 2;
    if (s === 2 && f === 2) targetFinger = 3;

    const isPlaced = this.placedFingers[targetFinger];

    if (this.currentStep === 1 || this.currentStep === 5 || this.currentStep === 7) {
      // Full view
      if (targetFinger) {
        cell.classList.add('finger-placed');
        cell.innerHTML = `<span class="finger-prompt">${targetFinger}</span>`;
      }
    } else if (this.currentStep === 2) {
      if (targetFinger === 1) {
        cell.classList.add('target-spot', 'pulse-target');
        cell.innerHTML = '<span class="finger-prompt">Dedo 1</span>';
      }
    } else if (this.currentStep === 3) {
      if (targetFinger === 1) {
        cell.classList.add('finger-placed');
        cell.innerHTML = '<span class="finger-prompt">1</span>';
      } else if (targetFinger === 2) {
        cell.classList.add('target-spot', 'pulse-target');
        cell.innerHTML = '<span class="finger-prompt">Dedo 2</span>';
      }
    } else if (this.currentStep === 4) {
      if (targetFinger === 1 || targetFinger === 2) {
        cell.classList.add('finger-placed');
        cell.innerHTML = `<span class="finger-prompt">${targetFinger}</span>`;
      } else if (targetFinger === 3) {
        cell.classList.add('target-spot', 'pulse-target');
        cell.innerHTML = '<span class="finger-prompt">Dedo 3</span>';
      }
    } else if (this.currentStep === 6) {
      // Unassisted builder
      if (isPlaced) {
        cell.classList.add('finger-placed');
        cell.innerHTML = `<span class="finger-prompt">${targetFinger}</span>`;
      } else {
        cell.classList.add('target-spot');
      }
    }

    cell.addEventListener('click', () => {
      this.handleCellClick(s, f, targetFinger);
    });
  }

  handleCellClick(s, f, targetFinger) {
    audioEngine.playNote(s, f);

    if (this.currentStep === 2 && targetFinger === 1) {
      this.placedFingers[1] = true;
      this.setStep(3);
    } else if (this.currentStep === 3 && targetFinger === 2) {
      this.placedFingers[2] = true;
      this.setStep(4);
    } else if (this.currentStep === 4 && targetFinger === 3) {
      this.placedFingers[3] = true;
      this.setStep(5);
    } else if (this.currentStep === 6 && targetFinger) {
      this.placedFingers[targetFinger] = true;
      this.renderFretboardForCurrentStep();
      if (this.placedFingers[1] && this.placedFingers[2] && this.placedFingers[3]) {
        setTimeout(() => this.setStep(7), 400);
      }
    }
  }

  finish() {
    this.close();
    // Update skill chip on main page
    const amChip = document.querySelector('.skill-chip.current');
    if (amChip) {
      amChip.classList.remove('current');
      amChip.classList.add('completed');
      amChip.textContent = 'Am ✓';
    }
  }
}
