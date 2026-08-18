/**
 * GMUSIC DYNAMIC PRACTICE MODAL CONTROLLER (v2.0)
 * Handles interactive practice for:
 * - Module 1 Folders (00-onboarding, 01-anatomia, 02-clavijero, 03-cuerdas, 04-cejuela, 05-pulsaciones, 06-desbloqueo)
 * - Chord Placement Lessons (Am-open, Em-open)
 * Evaluates with ExerciseEngine and provides honest pedagogical feedback and audio synthesis.
 */

import { CHORDS } from '../music/chords.js';
import { STRINGS, STRING_BY_S } from '../music/strings.js';
import { audioEngine } from '../engine/audio-engine.js';
import { exerciseEngine } from '../engine/exercise-engine.js';
import { CLASE_1_ANATOMIA } from '../../data/courses/guitar1/01-anatomia-guitarra/clase1.js';
import { CLASE_2_CLAVIJERO } from '../../data/courses/guitar1/02-clavijero-y-afinacion/clase2.js';
import { CLASE_3_CUERDAS } from '../../data/courses/guitar1/03-las-seis-cuerdas/clase3.js';
import { CLASE_4_CEJUELA_TRASTES } from '../../data/courses/guitar1/04-cejuela-y-trastes/clase4.js';
import { CLASE_5_PULSACIONES } from '../../data/courses/guitar1/05-primeras-pulsaciones/clase5.js';
import { MODULO_1_COMPLETION } from '../../data/courses/guitar1/06-desbloqueo-modulo-2/completion.js';

export class PracticeViewUI {
  constructor() {
    this.modal = document.getElementById('practiceModal');
    this.modalTitle = document.getElementById('practiceModalTitle');
    this.btnClose = document.getElementById('btnClosePracticeModal');
    this.stepCounter = document.getElementById('practiceStepCounter');
    this.instructionText = document.getElementById('practiceInstruction');
    this.feedbackBox = document.getElementById('practiceFeedbackBox');
    this.feedbackText = document.getElementById('practiceFeedbackText');
    this.btnStrum = document.getElementById('btnPracticeStrumChord');
    this.btnNext = document.getElementById('btnNextPracticeStep');
    this.fretboardContainer = document.getElementById('practiceFretboard');

    this.activeMode = 'chord'; // 'chord' | 'folder'
    this.activeFolderData = null;
    this.currentStepIndex = 0;
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
        if (this.activeMode === 'chord') {
          const chordData = CHORDS['Am-open'];
          audioEngine.strumChord(chordData.strumArray, true, 35);
        } else {
          audioEngine.strumChord([0, 0, 0, 0, 0, 0], true, 35);
        }
      });
    }

    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => this.handleNextStep());
    }
  }

  open(folderOrId = null) {
    if (!this.modal) return;
    this.modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    if (!folderOrId || folderOrId === 'Am-open' || folderOrId === 'chord') {
      this.startChordPractice('Am-open');
    } else {
      this.openFolder(folderOrId);
    }
  }

  close() {
    if (!this.modal) return;
    this.modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  openFolder(folderOrId) {
    let folderId = typeof folderOrId === 'string' ? folderOrId : (folderOrId.id || folderOrId.slug);
    
    // Normalizar ID
    if (folderId.includes('onboarding')) folderId = '00-onboarding';
    if (folderId.includes('anatomia')) folderId = '01-anatomia';
    if (folderId.includes('clavijero')) folderId = '02-clavijero';
    if (folderId.includes('seis-cuerdas') || folderId.includes('cuerdas')) folderId = '03-cuerdas';
    if (folderId.includes('cejuela') || folderId.includes('trastes')) folderId = '04-cejuela';
    if (folderId.includes('pulsaciones')) folderId = '05-pulsaciones';
    if (folderId.includes('desbloqueo')) folderId = '06-desbloqueo';

    this.activeMode = 'folder';
    this.currentStepIndex = 0;

    switch (folderId) {
      case '00-onboarding':
        this.activeFolderData = {
          title: 'Bienvenida · Tu Primer Toque',
          exercises: [
            {
              type: 'find_string',
              pregunta: 'Toca la 6ª cuerda (la más gruesa arriba, Mi grave)',
              respuesta: { s: 5 },
              feedbackOk: '¡Perfecto! Has producido tu primer sonido en la guitarra: Mi grave (E2).',
              hint: 'Haz clic en la cuerda 6 (superior).'
            }
          ]
        };
        break;

      case '01-anatomia':
        this.activeFolderData = {
          title: 'Clase 1 · Anatomía de la Guitarra',
          exercises: CLASE_1_ANATOMIA.ejercicios
        };
        break;

      case '02-clavijero':
        this.activeFolderData = {
          title: 'Clase 2 · El Clavijero y la Afinación',
          exercises: CLASE_2_CLAVIJERO.ejercicios
        };
        break;

      case '03-cuerdas':
        this.activeFolderData = {
          title: 'Clase 3 · Las Seis Cuerdas',
          exercises: CLASE_3_CUERDAS.ejercicios
        };
        break;

      case '04-cejuela':
        this.activeFolderData = {
          title: 'Clase 4 · La Cejuela y los Trastes',
          exercises: CLASE_4_CEJUELA_TRASTES.ejercicios
        };
        break;

      case '05-pulsaciones':
        this.activeFolderData = {
          title: 'Clase 5 · Primeras Pulsaciones',
          isSequence: true,
          sequence: CLASE_5_PULSACIONES.ejercicioSecuenciaAire.secuencia,
          titulo: CLASE_5_PULSACIONES.ejercicioSecuenciaAire.titulo
        };
        break;

      case '06-desbloqueo':
        this.activeFolderData = {
          title: '¡Módulo 1 Completado!',
          isCompletion: true,
          completion: MODULO_1_COMPLETION
        };
        break;

      default:
        this.activeFolderData = {
          title: 'Práctica Guiada',
          exercises: CLASE_3_CUERDAS.ejercicios
        };
        break;
    }

    this.renderCurrentFolderStep();
  }

  renderCurrentFolderStep() {
    if (!this.activeFolderData) return;
    const { title, exercises, isSequence, sequence, isCompletion, completion } = this.activeFolderData;

    if (this.modalTitle) this.modalTitle.textContent = title;
    if (this.feedbackBox) this.feedbackBox.classList.remove('success-feedback');
    if (this.btnStrum) this.btnStrum.disabled = false;

    if (isCompletion) {
      this.stepCounter.textContent = 'Módulo 1 Certificado';
      this.instructionText.innerHTML = `🏆 <strong>¡Has completado el Módulo 1 de Fundamentos!</strong>`;
      this.feedbackBox.classList.add('success-feedback');
      this.feedbackText.innerHTML = `Has certificado las 5 habilidades del instrumento. ¡Estás listo para el Módulo 2!`;
      this.fretboardContainer.innerHTML = `
        <div style="padding: 1.5rem; color: #fff; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; text-align: center;">
          <h4 style="margin-bottom: 0.5rem; color: #34d399;">Habilidades Acreditadas:</h4>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9rem;">
            ${completion.skillsCertified.map(s => `<li>✓ ${s.name} (${s.badge})</li>`).join('')}
          </ul>
        </div>
      `;
      this.btnNext.innerHTML = `<span>Comenzar Módulo 2</span> <span>→</span>`;
      return;
    }

    if (isSequence) {
      const step = sequence[this.currentStepIndex];
      const total = sequence.length;
      this.stepCounter.textContent = `Paso ${this.currentStepIndex + 1} de ${total}`;
      this.instructionText.innerHTML = `Pulsación limpia: Toca la <strong>${step.noteNameEs}</strong> (${6 - step.s}ª cuerda al aire).`;
      this.feedbackText.textContent = 'Haz clic en la cuerda resaltada y escucha su resonancia natural.';
      this.renderInteractiveStringView(step.s);
      this.btnNext.innerHTML = this.currentStepIndex === total - 1 ? `<span>Finalizar</span> <span>✓</span>` : `<span>Siguiente</span> <span>→</span>`;
      return;
    }

    const ex = exercises[this.currentStepIndex];
    const total = exercises.length;
    this.stepCounter.textContent = `Paso ${this.currentStepIndex + 1} de ${total}`;

    if (ex.type === 'multiple_choice') {
      this.renderMultipleChoiceStep(ex);
    } else if (ex.type === 'find_string') {
      this.renderFindStringStep(ex);
    } else if (ex.type === 'find_fret') {
      this.renderFindFretStep(ex);
    }
  }

  renderMultipleChoiceStep(ex) {
    this.instructionText.innerHTML = `<strong>${ex.pregunta}</strong>`;
    this.feedbackText.textContent = 'Selecciona la opción correcta.';
    this.fretboardContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.75rem; padding: 1.5rem; background: #0c1017; border-radius: 8px;">
        ${ex.opciones.map((opt, idx) => `
          <button type="button" class="btn-mc-option" data-opt="${opt}" style="text-align: left; padding: 0.75rem 1rem; background: #161f2e; border: 1px solid rgba(255,255,255,0.15); color: #fff; border-radius: 6px; cursor: pointer; font-size: 0.95rem; transition: all 0.2s;">
            <strong style="color: #38bdf8; margin-right: 0.5rem;">${String.fromCharCode(65 + idx)})</strong> ${opt}
          </button>
        `).join('')}
      </div>
    `;

    const buttons = this.fretboardContainer.querySelectorAll('.btn-mc-option');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const seleccion = btn.dataset.opt;
        const res = exerciseEngine.evaluate(ex, { seleccion });
        if (res.success) {
          btn.style.background = 'rgba(16, 185, 129, 0.25)';
          btn.style.borderColor = '#10b981';
          this.feedbackBox.classList.add('success-feedback');
          this.feedbackText.textContent = ex.feedbackOk || '¡Correcto!';
          audioEngine.playNote(0, 0, 1.2, 0.5);
        } else {
          btn.style.background = 'rgba(239, 68, 68, 0.2)';
          btn.style.borderColor = '#ef4444';
          this.feedbackBox.classList.remove('success-feedback');
          this.feedbackText.textContent = 'Opción incorrecta. Inténtalo de nuevo.';
        }
      });
    });

    this.btnNext.innerHTML = `<span>Siguiente</span> <span>→</span>`;
  }

  renderFindStringStep(ex) {
    this.instructionText.innerHTML = `<strong>${ex.pregunta}</strong>`;
    this.feedbackText.textContent = 'Haz clic en la cuerda correspondiente.';
    this.renderInteractiveStringView(ex.respuesta.s, (s) => {
      const res = exerciseEngine.evaluate(ex, { s });
      if (res.success) {
        this.feedbackBox.classList.add('success-feedback');
        this.feedbackText.textContent = ex.feedbackOk || res.feedback;
      } else {
        this.feedbackBox.classList.remove('success-feedback');
        this.feedbackText.textContent = res.feedback;
      }
    });
    this.btnNext.innerHTML = `<span>Siguiente</span> <span>→</span>`;
  }

  renderFindFretStep(ex) {
    this.instructionText.innerHTML = `<strong>${ex.pregunta}</strong>`;
    this.feedbackText.textContent = 'Toca la posición indicada en el diapasón.';
    this.renderFretboardCellView(ex.respuesta.s, ex.respuesta.f, (s, f) => {
      const res = exerciseEngine.evaluate(ex, { s, f });
      if (res.success) {
        this.feedbackBox.classList.add('success-feedback');
        this.feedbackText.textContent = ex.feedbackOk || res.feedback;
      } else {
        this.feedbackBox.classList.remove('success-feedback');
        this.feedbackText.textContent = res.feedback;
      }
    });
    this.btnNext.innerHTML = `<span>Siguiente</span> <span>→</span>`;
  }

  renderInteractiveStringView(targetS, onPluck = null) {
    this.fretboardContainer.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: flex; flex-direction: column; gap: 8px; padding: 1.25rem; background: #0c1017; border-radius: 8px;';

    STRINGS.forEach(str => {
      const s = str.s;
      const isTarget = s === targetS;
      const row = document.createElement('button');
      row.type = 'button';
      row.style.cssText = `display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; background: ${isTarget ? 'rgba(249, 115, 22, 0.15)' : '#151d2a'}; border: 1px solid ${isTarget ? '#f97316' : 'rgba(255,255,255,0.1)'}; border-radius: 6px; color: #fff; cursor: pointer; transition: all 0.2s;`;
      row.innerHTML = `
        <span style="font-weight: 700; color: ${isTarget ? '#f97316' : '#94a3b8'};">${str.stringNumber}ª Cuerda · ${str.noteEs} (${str.noteEn})</span>
        <span style="font-family: monospace; font-size: 0.8rem; background: rgba(0,0,0,0.4); padding: 0.2rem 0.5rem; border-radius: 4px;">${str.description}</span>
      `;
      row.addEventListener('click', () => {
        audioEngine.playNote(s, 0);
        if (onPluck) onPluck(s);
        else if (isTarget) {
          this.feedbackBox.classList.add('success-feedback');
          this.feedbackText.textContent = `¡Exacto! Cuerda ${str.stringNumber} (${str.noteEs}).`;
        }
      });
      wrap.appendChild(row);
    });

    this.fretboardContainer.appendChild(wrap);
  }

  renderFretboardCellView(targetS, targetF, onCellClick = null) {
    this.fretboardContainer.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'practice-fretboard';
    grid.style.gridTemplateColumns = '80px repeat(3, 1fr)';

    for (let f = 0; f <= 3; f++) {
      const col = document.createElement('div');
      col.className = `fret-col fret-${f}`;
      const header = document.createElement('div');
      header.className = 'fret-header-lbl';
      header.textContent = f === 0 ? 'Al aire' : `Traste ${f}`;
      col.appendChild(header);

      for (let s = 0; s <= 5; s++) {
        const cell = document.createElement('div');
        cell.className = 'fret-cell';
        cell.dataset.s = s;
        cell.dataset.f = f;

        const isTarget = (s === targetS && f === targetF);
        if (isTarget) {
          cell.classList.add('target-spot', 'pulse-target');
          cell.innerHTML = `<span class="finger-prompt">🎯 Aquí</span>`;
        } else {
          cell.innerHTML = `<span>${STRING_BY_S[s]?.noteEn}</span>`;
        }

        cell.addEventListener('click', () => {
          audioEngine.playNote(s, f);
          if (onCellClick) onCellClick(s, f);
        });

        col.appendChild(cell);
      }
      grid.appendChild(col);
    }
    this.fretboardContainer.appendChild(grid);
  }

  handleNextStep() {
    if (this.activeMode === 'chord') {
      if (this.currentStepIndex < 6) {
        this.setChordStep(this.currentStepIndex + 2);
      } else {
        this.close();
      }
      return;
    }

    if (!this.activeFolderData) return;
    const { exercises, sequence, isSequence, isCompletion } = this.activeFolderData;

    if (isCompletion) {
      this.close();
      return;
    }

    const total = isSequence ? sequence.length : exercises.length;
    if (this.currentStepIndex < total - 1) {
      this.currentStepIndex++;
      this.renderCurrentFolderStep();
    } else {
      this.feedbackBox.classList.add('success-feedback');
      this.feedbackText.textContent = '🎉 ¡Etapa completada con éxito!';
      setTimeout(() => this.close(), 1200);
    }
  }

  startChordPractice(chordId = 'Am-open') {
    this.activeMode = 'chord';
    this.chordData = CHORDS[chordId] || CHORDS['Am-open'];
    if (this.modalTitle) this.modalTitle.textContent = `${this.chordData.name} · ${this.chordData.symbol}`;
    this.setChordStep(1);
  }

  setChordStep(step) {
    this.currentStepIndex = step - 1;
    this.stepCounter.textContent = `Paso ${step} de 7`;
    this.renderChordFretboard(step);
    this.updateChordStepCopy(step);
  }

  updateChordStepCopy(step) {
    if (this.feedbackBox) this.feedbackBox.classList.remove('success-feedback');
    if (this.btnStrum) this.btnStrum.disabled = (step < 5);

    if (step === 1) {
      this.instructionText.innerHTML = `<strong>${this.chordData.name} (${this.chordData.symbol})</strong>: Acorde con tónica en 5ª cuerda al aire. Escucha su sonido.`;
      this.feedbackText.textContent = 'Pulsa el botón de rasgueo para familiarizarte con su color armónico.';
      if (this.btnStrum) this.btnStrum.disabled = false;
      this.btnNext.innerHTML = '<span>Comenzar colocación</span> <span>→</span>';
    } else if (step === 2) {
      this.instructionText.innerHTML = 'Coloca el <strong>Dedo 1 (Índice)</strong> en la <strong>2ª cuerda, traste 1</strong> (Nota Do).';
      this.feedbackText.textContent = 'Pulsa el traste resaltado con pulso naranja.';
      this.btnNext.innerHTML = '<span>Siguiente dedo</span> <span>→</span>';
    } else if (step === 3) {
      this.instructionText.innerHTML = 'Coloca el <strong>Dedo 2 (Medio)</strong> en la <strong>4ª cuerda, traste 2</strong> (Nota Mi).';
      this.feedbackText.textContent = 'Coloca el segundo dedo cerca del metal del traste 2.';
    } else if (step === 4) {
      this.instructionText.innerHTML = 'Coloca el <strong>Dedo 3 (Anular)</strong> en la <strong>3ª cuerda, traste 2</strong> (Nota La).';
      this.feedbackText.textContent = 'Coloca el tercer dedo justo debajo del segundo dedo.';
    } else if (step === 5) {
      this.instructionText.innerHTML = `🎸 <strong>Forma completa de ${this.chordData.symbol}</strong>: 5 cuerdas activas, 6ª cuerda silenciada.`;
      this.feedbackBox.classList.add('success-feedback');
      this.feedbackText.textContent = '¡Excelente! Ahora rasguea desde la 5ª cuerda hacia abajo.';
      if (this.btnStrum) this.btnStrum.disabled = false;
      this.btnNext.innerHTML = '<span>Prueba sin ayuda</span> <span>→</span>';
      audioEngine.strumChord(this.chordData.strumArray, true, 35);
    } else if (step === 6) {
      this.instructionText.innerHTML = `🎯 <strong>Construye ${this.chordData.symbol} sin ayudas</strong>: Coloca los tres dedos en sus posiciones correctas.`;
      this.feedbackText.textContent = 'Haz clic en los trastes para posicionar los dedos 1, 2 y 3.';
      this.btnNext.innerHTML = '<span>Validar acorde</span> <span>✓</span>';
    } else if (step === 7) {
      this.instructionText.innerHTML = '🎉 <strong>Ejercicio completado</strong>';
      this.feedbackBox.classList.add('success-feedback');
      this.feedbackText.textContent = `Reconoces la digitación de ${this.chordData.name} (${this.chordData.symbol}).`;
      if (this.btnStrum) this.btnStrum.disabled = false;
      this.btnNext.innerHTML = '<span>Finalizar lección</span> <span>✓</span>';
      audioEngine.strumChord(this.chordData.strumArray, true, 35);
    }
  }

  renderChordFretboard(step) {
    if (!this.fretboardContainer) return;
    this.fretboardContainer.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'practice-fretboard';
    grid.style.gridTemplateColumns = '80px repeat(3, 1fr)';

    for (let f = 0; f <= 3; f++) {
      const col = document.createElement('div');
      col.className = `fret-col fret-${f}`;
      const header = document.createElement('div');
      header.className = 'fret-header-lbl';
      header.textContent = f === 0 ? 'Al aire' : `Traste ${f}`;
      col.appendChild(header);

      for (let s = 0; s <= 5; s++) {
        const cell = document.createElement('div');
        cell.className = 'fret-cell';
        cell.dataset.s = s;
        cell.dataset.f = f;

        if (f === 0) {
          if (s === 5) {
            cell.classList.add('muted-cell');
            cell.innerHTML = '<span title="6ª Cuerda silenciada">✕</span>';
          } else {
            cell.classList.add('open-active');
            cell.innerHTML = `<span>○</span>`;
          }
        } else {
          // Posiciones objetivo del acorde Am
          const isD1 = (s === 1 && f === 1);
          const isD2 = (s === 3 && f === 2);
          const isD3 = (s === 2 && f === 2);

          if (step === 2 && isD1) {
            cell.classList.add('target-spot', 'pulse-target');
            cell.innerHTML = '<span class="finger-prompt">1</span>';
          } else if (step === 3 && isD2) {
            cell.classList.add('target-spot', 'pulse-target');
            cell.innerHTML = '<span class="finger-prompt">2</span>';
          } else if (step === 4 && isD3) {
            cell.classList.add('target-spot', 'pulse-target');
            cell.innerHTML = '<span class="finger-prompt">3</span>';
          } else if (step >= 5 && (isD1 || isD2 || isD3)) {
            cell.classList.add('finger-placed');
            const d = isD1 ? '1' : (isD2 ? '2' : '3');
            cell.innerHTML = `<span class="finger-prompt">${d}</span>`;
          } else {
            cell.innerHTML = `<span>${STRING_BY_S[s]?.noteEn}</span>`;
          }
        }

        cell.addEventListener('click', () => {
          audioEngine.playNote(s, f);
        });

        col.appendChild(cell);
      }
      grid.appendChild(col);
    }
    this.fretboardContainer.appendChild(grid);
  }
}
