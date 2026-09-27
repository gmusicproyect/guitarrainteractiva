/** Guided practice: a lesson advances only after the learner answers correctly. */
import { CHORDS } from '../music/chords.js';
import { STRINGS, STRING_BY_S } from '../music/strings.js';
import { audioEngine } from '../engine/audio-engine.js';
import { exerciseEngine } from '../engine/exercise-engine.js';
import { DialogController } from './dialog-controller.js';
import { CLASE_1_ANATOMIA } from '../../data/courses/guitar1/01-anatomia-guitarra/clase1.js';
import { CLASE_2_CLAVIJERO } from '../../data/courses/guitar1/02-clavijero-y-afinacion/clase2.js';
import { CLASE_3_CUERDAS } from '../../data/courses/guitar1/03-las-seis-cuerdas/clase3.js';
import { CLASE_4_CEJUELA_TRASTES } from '../../data/courses/guitar1/04-cejuela-y-trastes/clase4.js';
import { CLASE_5_PULSACIONES } from '../../data/courses/guitar1/05-primeras-pulsaciones/clase5.js';
import { MODULO_1_COMPLETION } from '../../data/courses/guitar1/06-desbloqueo-modulo-2/completion.js';

const FOLDERS = {
  'g1-m1-onboarding': { title: 'Bienvenida · Tu primer toque', explanation: 'La sexta cuerda es la más gruesa y produce el Mi más grave de la guitarra. En esta vista está arriba; la primera cuerda, la más fina, está abajo.', exercises: [{ type: 'find_string', pregunta: 'Toca la 6ª cuerda: la más gruesa, Mi grave.', respuesta: { s: 5 }, feedbackOk: '¡Perfecto! Has encontrado Mi grave, la 6ª cuerda.' }] },
  'g1-m1-anatomy': { title: 'Clase 1 · Anatomía de la guitarra', lesson: CLASE_1_ANATOMIA, exercises: CLASE_1_ANATOMIA.ejercicios },
  'g1-m1-tuning-pegs': { title: 'Clase 2 · El clavijero y la afinación', lesson: CLASE_2_CLAVIJERO, exercises: CLASE_2_CLAVIJERO.ejercicios },
  'g1-m1-strings-open': { title: 'Clase 3 · Las seis cuerdas', lesson: CLASE_3_CUERDAS, exercises: CLASE_3_CUERDAS.ejercicios },
  'g1-m1-nut-frets': { title: 'Clase 4 · La cejuela y los trastes', lesson: CLASE_4_CEJUELA_TRASTES, exercises: CLASE_4_CEJUELA_TRASTES.ejercicios },
  'g1-m1-first-plucks': { title: 'Clase 5 · Primeras pulsaciones', lesson: CLASE_5_PULSACIONES, isSequence: true, sequence: CLASE_5_PULSACIONES.ejercicioSecuenciaAire.secuencia },
  'g1-m1-completion': { title: 'Cierre del módulo 1', isCompletion: true, completion: MODULO_1_COMPLETION }
};
const ALIASES = { '00-onboarding': 'g1-m1-onboarding', '01-anatomia': 'g1-m1-anatomy', '02-clavijero': 'g1-m1-tuning-pegs', '03-cuerdas': 'g1-m1-strings-open', '04-cejuela': 'g1-m1-nut-frets', '05-pulsaciones': 'g1-m1-first-plucks', '06-desbloqueo': 'g1-m1-completion' };

export class PracticeViewUI {
  constructor() {
    const ids = { modal: 'practiceModal', modalTitle: 'practiceModalTitle', btnClose: 'btnClosePracticeModal', stepCounter: 'practiceStepCounter', instructionText: 'practiceInstruction', feedbackBox: 'practiceFeedbackBox', feedbackText: 'practiceFeedbackText', btnStrum: 'btnPracticeStrumChord', btnNext: 'btnNextPracticeStep', fretboardContainer: 'practiceFretboard' };
    Object.entries(ids).forEach(([key, id]) => { this[key] = document.getElementById(id); });
    this.currentStepIndex = 0;
    this.stepSolved = false;
    this.completedSteps = new Set();
    this.sessionCompleted = false;
    this.placedFingers = {};
    if (!this.modal) return;
    this.dialog = new DialogController(this.modal, { initialFocus: this.btnClose, onClose: () => audioEngine.stopAll() });
    this.btnClose?.addEventListener('click', () => this.close());
    this.btnNext?.addEventListener('click', () => this.handleNextStep());
    this.btnStrum?.addEventListener('click', () => audioEngine.strumChord(this.activeMode === 'chord' ? this.chordData.strumArray : [0, 0, 0, 0, 0, 0]));
    this.feedbackText?.setAttribute('role', 'status');
    this.feedbackText?.setAttribute('aria-live', 'polite');
    this.feedbackText?.setAttribute('aria-atomic', 'true');
    this.instructionText?.setAttribute('tabindex', '-1');
  }

  open(folderOrId = null) {
    if (!this.modal) return false;
    audioEngine.stopAll();
    this.sessionCompleted = false;
    this.completedSteps.clear();
    this.placedFingers = {};
    if (!folderOrId || folderOrId === 'chord' || CHORDS[folderOrId]) this.startChordPractice(CHORDS[folderOrId] ? folderOrId : 'Am-open');
    else if (!this.openFolder(folderOrId)) return false;
    this.dialog.open();
    return true;
  }

  close() { this.dialog?.close(); }

  openFolder(folderOrId) {
    const rawId = typeof folderOrId === 'string' ? folderOrId : folderOrId?.id || folderOrId?.slug;
    let folderId = ALIASES[rawId] || rawId;
    if (!FOLDERS[folderId] && typeof rawId === 'string') {
      const terms = [['onboarding', '00-onboarding'], ['anatomia', '01-anatomia'], ['clavijero', '02-clavijero'], ['cuerdas', '03-cuerdas'], ['cejuela', '04-cejuela'], ['trastes', '04-cejuela'], ['pulsaciones', '05-pulsaciones'], ['desbloqueo', '06-desbloqueo']];
      const alias = terms.find(([term]) => rawId.includes(term));
      folderId = alias ? ALIASES[alias[1]] : rawId;
    }
    if (!FOLDERS[folderId]) return false;
    this.activeFolderId = folderId;
    this.activeFolderData = FOLDERS[folderId];
    this.activeFolderManifest = typeof folderOrId === 'object' ? folderOrId : null;
    this.folderPhase = this.activeFolderData.isCompletion ? 'summary' : 'teaching';
    this.activeMode = 'folder';
    this.currentStepIndex = 0;
    this.renderCurrentFolderStep();
    return true;
  }

  setSolved(success, feedback) {
    this.stepSolved = success;
    this.btnNext.disabled = !success;
    this.feedbackBox.classList.toggle('success-feedback', success);
    this.feedbackText.textContent = feedback;
  }

  renderCurrentFolderStep() {
    const { title, exercises, isSequence, sequence, isCompletion, completion } = this.activeFolderData;
    this.modalTitle.textContent = title;
    document.getElementById('practiceModuleTag').textContent = 'MÓDULO 1 · EL INSTRUMENTO';
    document.getElementById('btnPracticeStrumLabel').textContent = 'Escuchar las cuerdas';
    this.btnStrum.disabled = false;
    this.setSolved(false, 'Responde al ejercicio para continuar.');
    if (this.folderPhase === 'teaching') {
      this.renderFolderTeaching();
      return;
    }
    if (isCompletion) {
      this.stepCounter.textContent = 'Resumen del módulo';
      this.instructionText.textContent = 'Estas son las habilidades que has practicado en el módulo 1.';
      this.fretboardContainer.replaceChildren();
      const list = document.createElement('ul');
      list.className = 'practice-skills-list';
      completion.skillsCertified.forEach(skill => { const item = document.createElement('li'); item.textContent = skill.name; list.appendChild(item); });
      this.fretboardContainer.appendChild(list);
      this.setSolved(true, 'Puedes volver a tu ruta y repetir cualquier clase para afianzar lo aprendido.');
      this.btnNext.textContent = 'Cerrar resumen';
      return;
    }
    const total = isSequence ? sequence.length : exercises.length;
    this.stepCounter.textContent = `Paso ${this.currentStepIndex + 1} de ${total}`;
    this.btnNext.textContent = this.currentStepIndex === total - 1 ? 'Completar clase' : 'Siguiente';
    if (isSequence) {
      const step = sequence[this.currentStepIndex];
      this.instructionText.textContent = `Toca ${step.noteNameEs} al aire.`;
      this.feedbackText.textContent = 'Pulsa la cuerda resaltada y escucha antes de continuar.';
      this.renderInteractiveStringView(step.s, s => this.setSolved(s === step.s, s === step.s ? '¡Exacto! Escucha cómo resuena la cuerda.' : 'Busca la cuerda resaltada e inténtalo de nuevo.'));
      return;
    }
    const exercise = exercises[this.currentStepIndex];
    this.instructionText.textContent = exercise.pregunta;
    const evaluate = input => {
      const result = exerciseEngine.evaluate(exercise, input);
      this.setSolved(result.success, result.success ? exercise.feedbackOk || result.feedback : result.feedback);
    };
    if (exercise.type === 'multiple_choice') this.renderMultipleChoiceStep(exercise, evaluate);
    else if (exercise.type === 'find_string') this.renderInteractiveStringView(null, s => evaluate({ s }));
    else if (exercise.type === 'find_fret') this.renderFretboardCellView(exercise.respuesta.s, exercise.respuesta.f, (s, f) => evaluate({ s, f }));
  }

  renderFolderTeaching() {
    const { lesson, explanation } = this.activeFolderData;
    const manifest = this.activeFolderManifest;
    this.stepCounter.textContent = 'Descubre · antes de practicar';
    this.instructionText.textContent = 'Conoce la idea y después ponla en práctica.';
    this.fretboardContainer.replaceChildren();
    const panel = document.createElement('section');
    panel.className = 'practice-teaching';
    panel.setAttribute('aria-labelledby', 'practiceTeachingTitle');
    const heading = document.createElement('h3');
    heading.id = 'practiceTeachingTitle';
    heading.textContent = manifest?.practice?.title || 'Antes de empezar';
    const text = document.createElement('p');
    text.textContent = manifest?.teaching?.card || lesson?.explicacion || explanation;
    panel.append(heading, text);

    // Keep authored teaching content separate from the answer controls.
    const parts = manifest?.content?.parts || lesson?.partes?.map(part => ({ name: part.nombre, purpose: part.descripcion }));
    const concepts = manifest?.content?.concepts || lesson?.conceptos?.map(concept => ({ name: concept.concepto, definition: concept.definicion }));
    const definitions = parts || concepts;
    if (definitions?.length) {
      const list = document.createElement('dl');
      list.className = 'practice-teaching-list';
      definitions.forEach(definition => {
        const entry = document.createElement('div');
        const name = document.createElement('dt');
        name.textContent = definition.name;
        const description = document.createElement('dd');
        description.textContent = definition.purpose || definition.definition;
        entry.append(name, description);
        list.appendChild(entry);
      });
      panel.appendChild(list);
    }
    if (this.activeFolderId === 'g1-m1-onboarding') {
      const note = document.createElement('p');
      note.className = 'practice-teaching-note';
      note.textContent = 'Pulsa una cuerda con el ratón o con el dedo. Con teclado, usa Tab para elegirla y Enter o Espacio para tocar.';
      panel.appendChild(note);
    }
    this.fretboardContainer.appendChild(panel);
    this.feedbackText.textContent = 'Lee a tu ritmo. El siguiente paso abre los ejercicios.';
    this.btnNext.disabled = false;
    this.btnNext.textContent = 'Empezar práctica';
  }

  renderMultipleChoiceStep(exercise, evaluate) {
    this.fretboardContainer.replaceChildren();
    const options = document.createElement('div');
    options.className = 'practice-options';
    exercise.opciones.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-mc-option';
      button.dataset.opt = option;
      button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        options.querySelectorAll('button').forEach(item => { item.setAttribute('aria-pressed', 'false'); item.classList.remove('correct-answer', 'incorrect-answer'); });
        button.setAttribute('aria-pressed', 'true');
        evaluate({ seleccion: option });
        button.classList.add(this.stepSolved ? 'correct-answer' : 'incorrect-answer');
        if (this.stepSolved) audioEngine.playNote(0, 0, 1.2, 0.5);
      });
      options.appendChild(button);
    });
    this.fretboardContainer.appendChild(options);
  }

  renderInteractiveStringView(targetS, onPluck) {
    this.fretboardContainer.replaceChildren();
    const wrap = document.createElement('div');
    wrap.className = 'practice-strings';
    [...STRINGS].reverse().forEach(string => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'practice-string-button';
      button.dataset.s = string.s;
      if (string.s === targetS) button.classList.add('target-spot');
      button.textContent = `${string.stringNumber}ª cuerda · ${string.noteEs} (${string.noteEn}${string.octave})`;
      button.addEventListener('click', () => { audioEngine.playNote(string.s, 0); onPluck?.(string.s); });
      wrap.appendChild(button);
    });
    this.fretboardContainer.appendChild(wrap);
  }

  createFretboard(renderCell) {
    this.fretboardContainer.replaceChildren();
    const grid = document.createElement('div');
    grid.className = 'practice-fretboard';
    grid.style.gridTemplateColumns = 'minmax(64px, .8fr) repeat(3, minmax(64px, 1fr))';
    for (let f = 0; f <= 3; f++) {
      const column = document.createElement('div');
      column.className = `fret-col fret-${f}`;
      const heading = document.createElement('div');
      heading.className = 'fret-header-lbl';
      heading.textContent = f === 0 ? 'Al aire' : `Traste ${f}`;
      column.appendChild(heading);
      for (const string of [...STRINGS].reverse()) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'fret-cell';
        cell.dataset.s = string.s;
        cell.dataset.f = f;
        cell.setAttribute('aria-label', `${string.stringNumber}ª cuerda, ${f === 0 ? 'al aire' : `traste ${f}`}`);
        const label = document.createElement('span');
        label.textContent = string.noteEn;
        cell.appendChild(label);
        renderCell(cell, string.s, f, label);
        column.appendChild(cell);
      }
      grid.appendChild(column);
    }
    this.fretboardContainer.appendChild(grid);
  }

  renderFretboardCellView(targetS, targetF, onCellClick) {
    this.createFretboard((cell, s, f, label) => {
      if (s === targetS && f === targetF) { cell.classList.add('target-spot', 'pulse-target'); label.textContent = 'Aquí'; }
      cell.addEventListener('click', () => { audioEngine.playNote(s, f); onCellClick(s, f); });
    });
  }

  handleNextStep() {
    if (this.sessionCompleted) { this.close(); return; }
    if (this.activeMode === 'chord') {
      const stage = this.chordStages[this.currentStepIndex];
      if (stage.type === 'build') {
        const result = exerciseEngine.evaluate({ type: 'build_chord', chordId: this.chordData.id }, this.placedFingers);
        const exact = Object.entries(this.placedFingers).every(([s, placement]) => this.chordData.frets[s] === placement.f);
        if (!result.success || !exact) { this.setSolved(false, 'Revisa el acorde: coloca cada dedo y retira las posiciones que no pertenecen a esta forma.'); return; }
        this.stepSolved = true;
      }
      if (!this.stepSolved) return;
      if (stage.type === 'complete') { this.close(); return; }
      this.setChordStep(this.currentStepIndex + 2);
    } else {
      if (this.folderPhase === 'teaching') {
        this.folderPhase = 'practice';
        this.renderCurrentFolderStep();
        this.instructionText.focus();
        return;
      }
      if (!this.stepSolved || !this.activeFolderData) return;
      if (this.activeFolderData.isCompletion) { this.finishFolder(); this.close(); return; }
      this.completedSteps.add(this.currentStepIndex);
      const total = this.activeFolderData.isSequence ? this.activeFolderData.sequence.length : this.activeFolderData.exercises.length;
      if (this.currentStepIndex < total - 1) { this.currentStepIndex++; this.renderCurrentFolderStep(); }
      else if (this.completedSteps.size === total) { this.finishFolder(); return; }
    }
    this.instructionText.focus();
  }

  finishFolder() {
    if (this.sessionCompleted) return;
    this.sessionCompleted = true;
    this.setSolved(true, '¡Práctica completada! Ya puedes continuar con tu siguiente paso.');
    this.btnNext.textContent = 'Cerrar práctica';
    document.dispatchEvent(new CustomEvent('gmusic:foldercompleted', { detail: { folderId: this.activeFolderId } }));
  }

  startChordPractice(chordId = 'Am-open') {
    this.activeMode = 'chord';
    this.chordData = CHORDS[chordId] || CHORDS['Am-open'];
    const fingers = Object.values(this.chordData.positions).filter(position => position.status === 'fretted').sort((a, b) => a.finger - b.finger);
    this.chordStages = [{ type: 'intro' }, ...fingers.map(position => ({ type: 'finger', position })), { type: 'review' }, { type: 'build' }, { type: 'complete' }];
    this.modalTitle.textContent = `${this.chordData.name} · ${this.chordData.symbol}`;
    document.getElementById('practiceModuleTag').textContent = 'PRÁCTICA · ACORDES ABIERTOS';
    document.getElementById('btnPracticeStrumLabel').textContent = `Escuchar ${this.chordData.symbol}`;
    this.setChordStep(1);
  }

  setChordStep(step) {
    this.currentStepIndex = step - 1;
    const stage = this.chordStages[this.currentStepIndex];
    if (stage.type === 'build') this.placedFingers = {};
    this.stepCounter.textContent = `Paso ${step} de ${this.chordStages.length}`;
    this.btnStrum.disabled = stage.type === 'finger';
    this.setSolved(!['finger', 'build'].includes(stage.type), 'Escucha el acorde y descubre su digitación.');
    this.btnNext.textContent = 'Siguiente';
    if (stage.type === 'intro') {
      this.instructionText.textContent = `${this.chordData.name} (${this.chordData.symbol}). ${this.chordData.description}`;
      this.btnNext.textContent = 'Comenzar colocación';
    } else if (stage.type === 'finger') {
      const position = stage.position;
      this.instructionText.textContent = `Coloca el dedo ${position.finger} en la ${STRING_BY_S[position.s].stringNumber}ª cuerda, traste ${position.f}.`;
      this.feedbackText.textContent = 'Pulsa la posición resaltada para colocar el dedo.';
    } else if (stage.type === 'review') {
      this.instructionText.textContent = `Esta es la forma completa de ${this.chordData.symbol}. Escúchala antes de intentarlo sin ayuda.`;
      this.feedbackText.textContent = 'Los círculos son cuerdas al aire. Una cruz indica una cuerda que no debe sonar.';
      this.btnNext.textContent = 'Practicar sin ayuda';
    } else if (stage.type === 'build') {
      this.instructionText.textContent = `Construye ${this.chordData.symbol} sin ayudas.`;
      this.feedbackText.textContent = 'Selecciona las posiciones del acorde. Pulsa de nuevo una posición para retirarla.';
      this.btnNext.textContent = 'Validar acorde';
    } else {
      this.instructionText.textContent = `¡Has construido ${this.chordData.name}!`;
      this.feedbackText.textContent = 'Reconoces sus posiciones en el diapasón. Practícalas también con tu guitarra.';
      this.btnNext.textContent = 'Finalizar práctica';
    }
    this.renderChordFretboard(stage);
  }

  renderChordFretboard(stage) {
    this.createFretboard((cell, s, f, label) => {
      const position = this.chordData.positions[s];
      const showShape = ['intro', 'review', 'complete'].includes(stage.type);
      if (f === 0 && position.status === 'muted') { cell.classList.add('muted-cell'); label.textContent = '×'; cell.setAttribute('aria-label', `${STRING_BY_S[s].stringNumber}ª cuerda, silenciada`); }
      else if (f === 0 && position.status === 'open') { cell.classList.add('open-active'); label.textContent = '○'; }
      const isTarget = stage.type === 'finger' && s === stage.position.s && f === stage.position.f;
      if (isTarget) { cell.classList.add('target-spot', 'pulse-target'); label.textContent = stage.position.finger; }
      else if (showShape && position.status === 'fretted' && position.f === f) { cell.classList.add('finger-placed'); label.textContent = position.finger; }
      if (stage.type === 'build') cell.setAttribute('aria-pressed', 'false');
      cell.addEventListener('click', () => {
        if (!(f === 0 && position.status === 'muted')) audioEngine.playNote(s, f);
        if (stage.type === 'finger') this.setSolved(isTarget, isTarget ? '¡Correcto! El dedo está en su posición.' : 'Revisa la cuerda y el traste resaltados.');
        if (stage.type === 'build' && f > 0) {
          if (this.placedFingers[s]?.f === f) delete this.placedFingers[s];
          else this.placedFingers[s] = { f };
          this.fretboardContainer.querySelectorAll('.fret-cell').forEach(item => {
            const selected = this.placedFingers[item.dataset.s]?.f === Number(item.dataset.f);
            item.classList.toggle('finger-placed', selected);
            item.setAttribute('aria-pressed', String(selected));
          });
          this.btnNext.disabled = Object.keys(this.placedFingers).length === 0;
          this.feedbackBox.classList.remove('success-feedback');
          this.feedbackText.textContent = 'Cuando tengas la forma completa, pulsa Validar acorde.';
        }
      });
    });
  }
}
