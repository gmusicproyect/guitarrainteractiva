/**
 * GMUSIC FREE GUITAR UI CONTROLLER (v1.1)
 * Configures the unified GuitarEngine with a custom window (fromFret: 0, toFret: 12, maxFrets: 16).
 * Demonstrates layers, scales, chords, and polyphonic real-time audio playback.
 */

import { GuitarEngine } from '../engine/guitar-engine.js';
import { CHORDS } from '../music/chords.js';
import { SCALES } from '../music/scales.js';
import { getSpelledNote } from '../music/spelling.js';
import { audioEngine } from '../engine/audio-engine.js';
import { DialogController } from './dialog-controller.js';

export class FreeGuitarUI {
  constructor() {
    this.modal = document.getElementById('freeGuitarModal');
    this.btnClose = document.getElementById('btnCloseFreeGuitarModal');
    this.btnCloseFooter = document.getElementById('btnCloseFreeFooter');
    this.container = document.getElementById('fullFretboardContainer');
    this.viewModeSelect = document.getElementById('fretboardViewMode');
    this.btnStrum = document.getElementById('btnFreeGuitarStrum');
    this.noteDetectedText = document.getElementById('freeNoteDetectedText');

    this.guitar = null;
    this.init();
  }

  init() {
    if (!this.modal || !this.container) return;
    this.dialog = new DialogController(this.modal, { initialFocus: this.btnClose, onClose: () => {
      audioEngine.stopAll();
      this.guitar?.clearAnimations();
    } });
    this.noteDetectedText?.setAttribute('role', 'status');
    this.noteDetectedText?.setAttribute('aria-live', 'polite');

    // Instantiate unified GuitarEngine on 0..12 window (engine supports 0..16)
    this.guitar = new GuitarEngine({
      container: this.container,
      view: 'fretboard',
      fromFret: 0,
      toFret: 12,
      showInlays: true,
      interactive: true,
      onNoteClick: note => this.showNote(note)
    });

    // Close handlers
    if (this.btnClose) this.btnClose.addEventListener('click', () => this.close());
    if (this.btnCloseFooter) this.btnCloseFooter.addEventListener('click', () => this.close());

    // View filter selector
    if (this.viewModeSelect) {
      this.viewModeSelect.addEventListener('change', (e) => {
        this.applyFilter(e.target.value);
      });
    }

    // Quick chord presets
    const chordButtons = this.modal.querySelectorAll('.btn-chord-chip');
    chordButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const chordKey = `${btn.dataset.chord}-open`;
        this.highlightChord(chordKey);
      });
    });

    // Strum All button
    if (this.btnStrum) {
      this.btnStrum.addEventListener('click', () => {
        audioEngine.strumChord(CHORDS[this.currentChordId]?.strumArray || [0, 0, 0, 0, 0, 0], true, 35);
      });
    }
  }

  open() {
    if (!this.dialog) return;
    this.applyFilter(this.viewModeSelect ? this.viewModeSelect.value : 'notes');
    this.dialog.open();
  }

  close() {
    this.dialog?.close();
  }

  showNote({ f, stringData }) {
    if (!this.noteDetectedText) return;
    const { en, es } = getSpelledNote((stringData.midi + f) % 12, this.guitar?.tonality);
    this.noteDetectedText.textContent = `${en} (${es}) · ${stringData.stringNumber}ª cuerda, ${f === 0 ? 'al aire' : `traste ${f}`}`;
  }

  applyFilter(mode) {
    if (!this.guitar) return;
    this.guitar.clearFretHighlights();
    this.currentChordId = null;
    this.modal.querySelectorAll('.btn-chord-chip').forEach(button => {
      button.classList.remove('active');
      button.setAttribute('aria-pressed', 'false');
    });
    if (this.btnStrum) this.btnStrum.textContent = 'Rasguear cuerdas al aire';

    const cells = this.container.querySelectorAll('.fret-matrix-cell');
    cells.forEach(c => {
      const bubble = c.querySelector('.fret-note-bubble');
      if (bubble) {
        bubble.style.display = 'inline-block';
        bubble.style.opacity = '1';
      }
    });

    if (mode === 'clean') {
      cells.forEach(c => {
        const bubble = c.querySelector('.fret-note-bubble');
        if (bubble) bubble.style.display = 'none';
      });
      return;
    }

    const scale = SCALES[mode];
    if (scale) {
      cells.forEach(cell => {
        const note = cell.dataset.note;
        if (scale.notes.includes(note)) {
          if (note === scale.root) {
            cell.classList.add('highlighted-root');
          } else {
            cell.classList.add('highlighted-note');
          }
        } else {
          const bubble = cell.querySelector('.fret-note-bubble');
          if (bubble) bubble.style.display = 'none';
        }
      });
    }
  }

  highlightChord(chordId) {
    const chord = CHORDS[chordId];
    if (!chord || !this.guitar) return;

    this.applyFilter('notes');
    if (this.viewModeSelect) this.viewModeSelect.value = 'notes';
    this.currentChordId = chordId;
    this.modal.querySelectorAll('.btn-chord-chip').forEach(button => {
      const selected = `${button.dataset.chord}-open` === chordId;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    if (this.btnStrum) this.btnStrum.textContent = `Rasguear ${chord.symbol}`;

    // Play strum
    audioEngine.strumChord(chord.strumArray, true, 35);

    // Highlight active chord positions
    Object.values(chord.positions).forEach(pos => {
      if (pos.status === 'fretted') {
        this.guitar.highlightCell(pos.s, pos.f, 'highlighted-root', `${pos.finger || ''}`);
      } else if (pos.status === 'open') {
        this.guitar.highlightCell(pos.s, 0, 'highlighted-note', '○');
      }
    });

    if (this.noteDetectedText) {
      this.noteDetectedText.textContent = `Acorde de ${chord.name} (${chord.symbol}) tocado`;
    }
  }
}
