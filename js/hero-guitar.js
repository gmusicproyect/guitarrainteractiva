/**
 * GMUSIC · HERO INTERACTIVE GUITAR & ONBOARDING MICRO-LESSON
 * Controls the simplified 6-string hero guitar, vibration animations,
 * and the step-by-step interactive onboarding challenge.
 */

import { guitarAudio } from './audio.js';

export class HeroGuitarController {
  constructor() {
    this.heroGuitar = document.getElementById('heroGuitar');
    this.microLessonBox = document.getElementById('microLessonBox');
    this.lessonStatusIcon = document.getElementById('lessonStatusIcon');
    this.lessonPromptText = document.getElementById('lessonPromptText');
    this.lessonSubtext = document.getElementById('lessonSubtext');
    this.lessonNoteBadge = document.getElementById('lessonNoteBadge');
    this.feedbackStringLbl = document.getElementById('feedbackStringLbl');
    this.feedbackNoteLbl = document.getElementById('feedbackNoteLbl');
    this.btnStrumAll = document.getElementById('btnStrumAll');

    // Micro-lesson state machine:
    // 0: Initial prompt ("Toca la cuerda más gruesa: 6ª cuerda Mi")
    // 1: Second prompt ("Ahora encuentra la cuerda La: 5ª cuerda")
    // 2: Completed prompt ("¡Completaste tu primer ejercicio en GMusic!")
    // 3: Free exploration mode
    this.lessonStep = 0;
    
    this.init();
  }

  init() {
    if (!this.heroGuitar) return;

    // Attach click and touch listeners to each string row
    const stringRows = this.heroGuitar.querySelectorAll('.guitar-string-row');
    stringRows.forEach(row => {
      row.addEventListener('click', (e) => this.handleStringPluck(row));
      // Support tactile drag over strings
      row.addEventListener('mouseenter', (e) => {
        if (e.buttons === 1) { // If mouse button is held down while dragging
          this.handleStringPluck(row);
        }
      });
    });

    // Strum all open strings button
    if (this.btnStrumAll) {
      this.btnStrumAll.addEventListener('click', () => {
        this.strumAllOpenStrings();
      });
    }

    // Set initial micro-lesson target highlighting
    this.updateLessonUI();
  }

  handleStringPluck(rowElement) {
    const stringNum = parseInt(rowElement.dataset.string, 10);
    const note = rowElement.dataset.note;
    const noteNameEs = rowElement.dataset.name;
    const noteSymbol = rowElement.dataset.noteEs;

    // 1. Trigger Audio Pluck
    guitarAudio.playString(stringNum, 0, 2.2, 0.9);

    // 2. Trigger String Vibration Visual
    rowElement.classList.remove('plucked');
    void rowElement.offsetWidth; // Force CSS reflow to re-trigger animation
    rowElement.classList.add('plucked');

    // Remove plucked class after animation duration
    setTimeout(() => {
      rowElement.classList.remove('plucked');
    }, 850);

    // 3. Update feedback note badge
    if (this.feedbackStringLbl && this.feedbackNoteLbl) {
      this.feedbackStringLbl.textContent = `${stringNum}ª Cuerda`;
      this.feedbackNoteLbl.textContent = `${noteSymbol} · ${note.replace(/\d/, '')}`;
    }

    // 4. Progress Micro-lesson state machine
    this.processLessonStep(stringNum);
  }

  processLessonStep(stringNum) {
    if (this.lessonStep === 0) {
      // Step 0: User must pluck String 6 (Mi grave)
      if (stringNum === 6) {
        this.lessonStep = 1;
        this.showSuccessFeedback();
        this.updateLessonUI();
      }
    } else if (this.lessonStep === 1) {
      // Step 1: User must pluck String 5 (La / A)
      if (stringNum === 5) {
        this.lessonStep = 2;
        this.showSuccessFeedback();
        this.updateLessonUI();
      }
    }
  }

  showSuccessFeedback() {
    if (!this.microLessonBox) return;
    this.microLessonBox.classList.add('success');
    setTimeout(() => {
      this.microLessonBox.classList.remove('success');
    }, 1500);
  }

  updateLessonUI() {
    // Clear existing target classes
    const stringRows = this.heroGuitar.querySelectorAll('.guitar-string-row');
    stringRows.forEach(r => r.classList.remove('target-string'));

    if (this.lessonStep === 0) {
      // Step 0: Highlight String 6
      const str6 = this.heroGuitar.querySelector('.guitar-string-row[data-string="6"]');
      if (str6) str6.classList.add('target-string');

      this.lessonStatusIcon.textContent = '🎸';
      this.lessonPromptText.innerHTML = '¿Probamos? <strong>Toca la cuerda más gruesa</strong> (6ª cuerda: Mi grave).';
      this.lessonSubtext.textContent = 'Haz clic o toca la cuerda 6 abajo para escucharla vibrar.';
      this.feedbackStringLbl.textContent = '6ª Cuerda';
      this.feedbackNoteLbl.textContent = 'Mi · E';
    } else if (this.lessonStep === 1) {
      // Step 1: Highlight String 5
      const str5 = this.heroGuitar.querySelector('.guitar-string-row[data-string="5"]');
      if (str5) str5.classList.add('target-string');

      this.lessonStatusIcon.textContent = '🟢';
      this.lessonPromptText.innerHTML = '¡Exacto! Esa es la sexta cuerda: <strong>Mi</strong>. Ahora encuentra la cuerda <strong>La (5ª cuerda)</strong>.';
      this.lessonSubtext.textContent = 'Muy bien. Pulsa la quinta cuerda justo encima de la sexta.';
      this.feedbackStringLbl.textContent = '5ª Cuerda';
      this.feedbackNoteLbl.textContent = 'La · A';
    } else if (this.lessonStep === 2) {
      // Step 2: Milestone completed!
      this.lessonStatusIcon.textContent = '🎉';
      this.lessonPromptText.innerHTML = '¡Genial! <strong>Ya completaste tu primer ejercicio interactivo en GMusic</strong>.';
      this.lessonSubtext.textContent = 'Continúa abajo con el Módulo 3 o toca cualquier cuerda libremente.';
      this.feedbackStringLbl.textContent = '¡Listo!';
      this.feedbackNoteLbl.textContent = '✓ Logrado';

      // Highlight the next step CTA in the page
      const nextStepSection = document.getElementById('siguiente-paso');
      if (nextStepSection) {
        nextStepSection.classList.add('highlight-pulse');
      }
    }
  }

  strumAllOpenStrings() {
    const stringRows = Array.from(this.heroGuitar.querySelectorAll('.guitar-string-row'));
    // Strum from 6th to 1st (downstroke)
    const reversedRows = [...stringRows].reverse();
    
    reversedRows.forEach((row, idx) => {
      setTimeout(() => {
        this.handleStringPluck(row);
      }, idx * 60);
    });
  }
}
