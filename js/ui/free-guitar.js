/**
 * GMUSIC FREE GUITAR UI CONTROLLER (v1.1)
 * Configures the unified GuitarEngine with a custom window (fromFret: 0, toFret: 12, maxFrets: 16).
 * Demonstrates layers, scales, chords, and polyphonic real-time audio playback.
 */

import { GuitarEngine } from '../engine/guitar-engine.js';
import { CHORDS } from '../music/chords.js';
import { SCALES } from '../music/scales.js?v=2';
import { SPELL } from '../music/spelling.js';
import { audioEngine } from '../engine/audio-engine.js?v=2';

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

    // Instantiate unified GuitarEngine on 0..12 window (engine supports 0..16)
    this.guitar = new GuitarEngine({
      container: this.container,
      view: 'fretboard',
      fromFret: 0,
      toFret: 12,
      showInlays: true,
      interactive: true,
      onNoteClick: ({ s, f, note, stringData }) => {
        if (this.noteDetectedText) {
          const es = SPELL.getNoteEs(note);
          this.noteDetectedText.textContent = `${note} (${es}) · Cuerda ${stringData.stringNumber} (s:${s}), Traste ${f === 0 ? 'al aire' : f}`;
        }
      }
    });

    // Close handlers
    if (this.btnClose) this.btnClose.addEventListener('click', () => this.close());
    if (this.btnCloseFooter) this.btnCloseFooter.addEventListener('click', () => this.close());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

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
        chordButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const chordKey = `${btn.dataset.chord}-open`;
        this.highlightChord(chordKey);
      });
    });

    // Strum All button
    if (this.btnStrum) {
      this.btnStrum.addEventListener('click', () => {
        audioEngine.strumChord([0, 0, 0, 0, 0, 0], true, 35);
      });
    }
  }

  open() {
    this.modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    this.applyFilter(this.viewModeSelect ? this.viewModeSelect.value : 'notes');
  }

  close() {
    this.modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  applyFilter(mode) {
    if (!this.guitar) return;
    this.guitar.clearFretHighlights();

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

    if (mode === 'am-pentatonic') {
      const scale = SCALES['am-pentatonic'];
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
          if (bubble) bubble.style.opacity = '0.25';
        }
      });
    } else if (mode === 'c-major') {
      const scale = SCALES['c-major'];
      cells.forEach(cell => {
        const note = cell.dataset.note;
        if (scale.notes.includes(note)) {
          if (note === scale.root) {
            cell.classList.add('highlighted-root');
          } else {
            cell.classList.add('highlighted-note');
          }
        }
      });
    }
  }

  highlightChord(chordId) {
    const chord = CHORDS[chordId];
    if (!chord || !this.guitar) return;

    this.guitar.clearFretHighlights();

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
