/**
 * GMUSIC GUITAR ENGINE (v1.0 Contrato de Ejercicios)
 * Componente único de guitarra configurable con soporte para:
 * - 16 Trastes nativos (f: 0..16)
 * - Convención de cuerdas s: 0..5 (perspectiva del ejecutante)
 * - Vistas: 'hero-open', 'fretboard', 'custom' (con ventana desde..hasta)
 * - Zoom de posición (§1.5): agranda el diapasón en ventanas pequeñas
 * - Dibujo de cejeador (nut) únicamente si la ventana incluye el traste 0
 * - Inlays en trastes 3, 5, 7, 9, 12, 15
 * - Anillos de dedos ancla punteados (§4.8)
 */

import { STRINGS, STRING_BY_S } from '../music/strings.js';
import { getSpelledNote } from '../music/spelling.js';
import { audioEngine } from './audio-engine.js';

export class GuitarEngine {
  constructor(options = {}) {
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;

    this.view = options.view || 'hero-open';
    this.fromFret = options.fromFret !== undefined ? options.fromFret : 0;
    this.toFret = options.toFret !== undefined ? options.toFret : (this.view === 'hero-open' ? 0 : 12);
    this.maxFrets = 16;

    // Zoom de posición (§1.5) si la ventana abarca <= 5 trastes
    this.enableZoom = options.enableZoom ?? (this.toFret - this.fromFret <= 5 && this.view !== 'hero-open');
    this.interactive = options.interactive !== false;
    this.showInlays = options.showInlays !== false;
    this.autoPlayAudio = options.autoPlayAudio !== false;
    this.tonality = options.tonality || { root: 0, tipo: 'mayor' };

    this.onNoteClick = options.onNoteClick || null;
    this.onStringPluck = options.onStringPluck || null;

    this.stringElements = {};
    this.fretCells = {};
    this.activeHighlights = [];
    this.animationTimers = new Set();
    this.vibrationTimers = new Map();

    if (this.container) {
      this.render();
    }
  }

  getNoteName(s, f) {
    const stringData = STRING_BY_S[s];
    if (!stringData) return 'E';
    const pc = (stringData.pitchClass + f) % 12;
    const spelled = getSpelledNote(pc, this.tonality);
    return spelled.en;
  }

  render() {
    if (!this.container) return;
    this.clearAnimations();
    this.container.innerHTML = '';
    this.stringElements = {};
    this.fretCells = {};

    if (this.view === 'hero-open') {
      this.renderHeroOpenView();
    } else {
      this.renderFretboardView();
    }
  }

  renderHeroOpenView() {
    this.container.className = 'interactive-guitar hero-guitar-view';
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'Guitarra interactiva de 6 cuerdas al aire');

    // Cejuela solo si incluye traste 0
    if (this.fromFret === 0) {
      const nut = document.createElement('div');
      nut.className = 'guitar-nut';
      nut.setAttribute('aria-hidden', 'true');
      this.container.appendChild(nut);
    }

    [...STRINGS].reverse().forEach(stringData => {
      const s = stringData.s;
      const row = document.createElement('button');
      row.type = 'button';
      row.disabled = !this.interactive;
      row.className = `guitar-string-row gauge-${stringData.gauge}`;
      row.dataset.s = s;
      row.dataset.stringNumber = stringData.stringNumber;
      row.dataset.noteEn = stringData.noteEn;
      row.dataset.noteEs = stringData.noteEs;
      row.setAttribute('aria-label', `Cuerda ${stringData.stringNumber}, ${stringData.noteEs} (${stringData.noteEn})`);

      const badge = document.createElement('span');
      badge.className = 'string-badge';
      badge.textContent = `${stringData.stringNumber} · ${stringData.noteEn}`;
      row.appendChild(badge);

      const track = document.createElement('span');
      track.className = 'string-track';
      const line = document.createElement('span');
      line.className = `string-line string-${stringData.stringNumber}`;
      track.appendChild(line);
      row.appendChild(track);

      const pill = document.createElement('span');
      pill.className = 'string-note-pill';
      pill.textContent = `${stringData.noteEn}${stringData.octave}`;
      row.appendChild(pill);

      if (this.interactive) {
        row.addEventListener('click', () => this.handleStringAction(s, 0));
      }

      this.stringElements[s] = row;
      this.container.appendChild(row);
    });

    const indicator = document.createElement('div');
    indicator.className = 'fret-indicator';
    indicator.innerHTML = `
      <span>Cuerdas al aire (Traste 0)</span>
      <button type="button" class="strum-all-btn" title="Rasguear las 6 cuerdas">🎵 Rasguear cuerdas</button>
    `;
    const btnStrum = indicator.querySelector('.strum-all-btn');
    btnStrum.disabled = !this.interactive;
    btnStrum.addEventListener('click', () => this.strumOpenStrings());
    this.container.appendChild(indicator);
  }

  renderFretboardView() {
    this.container.className = `full-fretboard-matrix ${this.enableZoom ? 'fretboard-zoomed' : ''}`;
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', `Diapasón interactivo de trastes ${this.fromFret} a ${this.toFret}`);

    const grid = document.createElement('div');
    grid.className = 'fretboard-grid-wrapper';
    const colCount = this.toFret - this.fromFret + 1;
    const colWidth = this.enableZoom ? '110px' : '68px';
    const nutWidth = this.fromFret === 0 ? (this.enableZoom ? '75px ' : '60px ') : '';
    
    grid.style.gridTemplateColumns = `${this.fromFret === 0 ? nutWidth : ''}repeat(${this.fromFret === 0 ? colCount - 1 : colCount}, ${colWidth})`;

    for (let f = this.fromFret; f <= this.toFret; f++) {
      const col = document.createElement('div');
      col.className = `fretboard-fret-col fret-${f}`;
      if (f === 0) col.classList.add('fret-nut-col');

      // Inlays canónicos en 3, 5, 7, 9, 15 (single) y 12 (double)
      if (this.showInlays) {
        if ([3, 5, 7, 9, 15].includes(f)) col.classList.add('inlay-single');
        if (f === 12) col.classList.add('inlay-double');
      }

      const header = document.createElement('div');
      header.className = 'fretboard-fret-header';
      header.textContent = f === 0 ? 'Aire' : `${f}`;
      col.appendChild(header);

      // Player perspective: bass string above the treble string.
      [...STRINGS].reverse().forEach(stringData => {
        const s = stringData.s;
        const noteName = this.getNoteName(s, f);

        const cell = document.createElement('button');
        cell.type = 'button';
        cell.disabled = !this.interactive;
        cell.className = 'fret-matrix-cell';
        cell.dataset.s = s;
        cell.dataset.f = f;
        cell.dataset.note = noteName;
        cell.tabIndex = s === 5 && f === this.fromFret ? 0 : -1;
        cell.setAttribute('aria-label', `Cuerda ${stringData.stringNumber}, Traste ${f}, Nota ${noteName}`);

        const bubble = document.createElement('span');
        bubble.className = 'fret-note-bubble';
        bubble.textContent = noteName;
        cell.appendChild(bubble);

        if (this.interactive) {
          cell.addEventListener('click', (e) => {
            this.focusCell(s, f);
            this.handleFretAction(s, f, noteName, e);
          });
          cell.addEventListener('keydown', (e) => {
            const positions = { ArrowLeft: [s, Math.max(this.fromFret, f - 1)], ArrowRight: [s, Math.min(this.toFret, f + 1)], ArrowUp: [Math.min(5, s + 1), f], ArrowDown: [Math.max(0, s - 1), f], Home: [s, this.fromFret], End: [s, this.toFret] };
            if (!positions[e.key]) return;
            e.preventDefault();
            this.focusCell(...positions[e.key]);
          });
        }

        this.fretCells[`${s}-${f}`] = cell;
        col.appendChild(cell);
      });

      grid.appendChild(col);
    }

    this.container.appendChild(grid);
  }

  handleStringAction(s, f = 0) {
    if (this.autoPlayAudio) {
      audioEngine.playNote(s, f);
    }
    this.vibrateString(s);

    const stringData = STRING_BY_S[s];
    const noteName = this.getNoteName(s, f);

    if (this.onStringPluck) this.onStringPluck({ s, f, note: noteName, stringData });
    if (this.onNoteClick) this.onNoteClick({ s, f, note: noteName, stringData });
  }

  handleFretAction(s, f, noteName, event) {
    if (this.autoPlayAudio) {
      audioEngine.playNote(s, f);
    }
    this.vibrateString(s);

    const stringData = STRING_BY_S[s];
    if (this.onNoteClick) {
      this.onNoteClick({ s, f, note: noteName, stringData, event });
    }
  }

  vibrateString(s) {
    const el = this.stringElements[s];
    if (el) {
      el.classList.remove('plucked');
      void el.offsetWidth;
      el.classList.add('plucked');
      clearTimeout(this.vibrationTimers.get(s));
      this.vibrationTimers.set(s, setTimeout(() => { el.classList.remove('plucked'); this.vibrationTimers.delete(s); }, 800));
    }
  }

  highlightString(s, className = 'target-string') {
    this.clearStringHighlights();
    const el = this.stringElements[s];
    if (el) {
      el.classList.add(className);
      this.activeHighlights.push(el);
    }
  }

  clearStringHighlights() {
    Object.values(this.stringElements).forEach(el => {
      el.classList.remove('target-string');
    });
  }

  highlightCell(s, f, className = 'highlighted-root', text = '', isAnchor = false) {
    const cell = this.fretCells[`${s}-${f}`];
    if (cell) {
      cell.classList.add(className);
      if (isAnchor) {
        cell.classList.add('anchor-finger-ring');
      }
      if (text) {
        const bubble = cell.querySelector('.fret-note-bubble');
        if (bubble) bubble.textContent = text;
      }
      this.activeHighlights.push(cell);
    }
  }

  clearFretHighlights() {
    Object.values(this.fretCells).forEach(cell => {
      cell.classList.remove('highlighted-root', 'highlighted-note', 'target-spot', 'pulse-target', 'finger-placed', 'anchor-finger-ring');
      const bubble = cell.querySelector('.fret-note-bubble');
      if (bubble) bubble.textContent = cell.dataset.note;
    });
    this.activeHighlights = [];
  }

  strumOpenStrings(downstroke = true) {
    audioEngine.strumChord([0, 0, 0, 0, 0, 0], downstroke, 40);
    const sOrder = downstroke ? [5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5];
    sOrder.forEach((s, idx) => {
      const timer = setTimeout(() => { this.vibrateString(s); this.animationTimers.delete(timer); }, idx * 40);
      this.animationTimers.add(timer);
    });
  }

  focusCell(s, f) {
    const target = this.fretCells[`${s}-${f}`];
    if (!target) return;
    Object.values(this.fretCells).forEach(cell => { cell.tabIndex = cell === target ? 0 : -1; });
    target.focus();
  }

  clearAnimations() {
    this.animationTimers.forEach(clearTimeout);
    this.vibrationTimers.forEach(clearTimeout);
    this.animationTimers.clear();
    this.vibrationTimers.clear();
    Object.values(this.stringElements).forEach(element => element.classList.remove('plucked'));
  }

  destroy() {
    this.clearAnimations();
    this.container?.replaceChildren();
    this.stringElements = {};
    this.fretCells = {};
    this.onNoteClick = null;
    this.onStringPluck = null;
  }
}
