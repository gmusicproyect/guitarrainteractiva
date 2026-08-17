/**
 * GMUSIC · GUITARRA LIBRE (FULL 12-FRET EXPLORER)
 * Generates an interactive 12-fretboard sandbox with note detection,
 * pentatonic/major scale overlays, chord shapes, and real-time audio playback.
 */

import { guitarAudio } from './audio.js';

export class FreeGuitarController {
  constructor() {
    this.modal = document.getElementById('freeGuitarModal');
    this.btnClose = document.getElementById('btnCloseFreeGuitarModal');
    this.btnCloseFooter = document.getElementById('btnCloseFreeFooter');
    this.container = document.getElementById('fullFretboardContainer');
    this.viewModeSelect = document.getElementById('fretboardViewMode');
    this.btnStrum = document.getElementById('btnFreeGuitarStrum');
    this.noteDetectedText = document.getElementById('freeNoteDetectedText');

    // Standard Open Strings (Strings 1 to 6)
    // String 1: E4, String 2: B3, String 3: G3, String 4: D3, String 5: A2, String 6: E2
    this.stringRoots = [
      { num: 1, rootIndex: 4, octave: 4, name: 'E4' }, // E
      { num: 2, rootIndex: 11, octave: 3, name: 'B3' }, // B
      { num: 3, rootIndex: 7, octave: 3, name: 'G3' }, // G
      { num: 4, rootIndex: 2, octave: 3, name: 'D3' }, // D
      { num: 5, rootIndex: 9, octave: 2, name: 'A2' }, // A
      { num: 6, rootIndex: 4, octave: 2, name: 'E2' }  // E
    ];

    this.chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    this.init();
  }

  init() {
    if (!this.modal || !this.container) return;

    this.renderFretboard();

    // Close handlers
    if (this.btnClose) this.btnClose.addEventListener('click', () => this.close());
    if (this.btnCloseFooter) this.btnCloseFooter.addEventListener('click', () => this.close());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // View mode selector (Notes, Pentatonic, Major, Clean)
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
        this.highlightChord(btn.dataset.chord);
      });
    });

    // Strum All button
    if (this.btnStrum) {
      this.btnStrum.addEventListener('click', () => {
        this.strumFreeGuitar();
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

  renderFretboard() {
    this.container.innerHTML = '';

    // Create 13 columns: Fret 0 (Open) to Fret 12
    for (let fret = 0; fret <= 12; fret++) {
      const fretCol = document.createElement('div');
      fretCol.className = `fretboard-fret-col fret-${fret}`;

      // Inlay dots on frets 3, 5, 7, 9 (single) and 12 (double)
      if ([3, 5, 7, 9].includes(fret)) {
        fretCol.classList.add('inlay-single');
      } else if (fret === 12) {
        fretCol.classList.add('inlay-double');
      }

      // Header
      const header = document.createElement('div');
      header.className = 'fretboard-fret-header';
      header.textContent = fret === 0 ? 'Aire' : `${fret}`;
      fretCol.appendChild(header);

      // 6 Strings per fret column (String 1 to String 6)
      this.stringRoots.forEach(str => {
        const noteIndex = (str.rootIndex + fret) % 12;
        const noteName = this.chromaticScale[noteIndex];

        const cell = document.createElement('div');
        cell.className = 'free-fret-cell';
        cell.dataset.string = str.num;
        cell.dataset.fret = fret;
        cell.dataset.note = noteName;

        const bubble = document.createElement('span');
        bubble.className = 'note-bubble';
        bubble.textContent = noteName;
        cell.appendChild(bubble);

        // Click to play note
        cell.addEventListener('click', () => {
          this.handleFretClick(str.num, fret, noteName);
        });

        fretCol.appendChild(cell);
      });

      this.container.appendChild(fretCol);
    }
  }

  handleFretClick(stringNum, fret, noteName) {
    guitarAudio.playString(stringNum, fret, 2.2, 0.95);

    if (this.noteDetectedText) {
      const noteNameEs = guitarAudio.noteNamesSpanish[noteName] || noteName;
      this.noteDetectedText.textContent = `${noteName} (${noteNameEs}) · Cuerda ${stringNum}, Traste ${fret === 0 ? 'al aire' : fret}`;
    }
  }

  applyFilter(mode) {
    const cells = this.container.querySelectorAll('.free-fret-cell');
    cells.forEach(cell => {
      cell.classList.remove('highlighted-note', 'highlighted-root');
      const bubble = cell.querySelector('.note-bubble');
      if (bubble) bubble.style.display = 'inline-block';
    });

    if (mode === 'clean') {
      cells.forEach(cell => {
        const bubble = cell.querySelector('.note-bubble');
        if (bubble) bubble.style.display = 'none';
      });
      return;
    }

    if (mode === 'am-pentatonic') {
      // Notes in A minor pentatonic: A, C, D, E, G
      const pentaNotes = ['A', 'C', 'D', 'E', 'G'];
      cells.forEach(cell => {
        const note = cell.dataset.note;
        if (pentaNotes.includes(note)) {
          if (note === 'A') {
            cell.classList.add('highlighted-root');
          } else {
            cell.classList.add('highlighted-note');
          }
        } else {
          const bubble = cell.querySelector('.note-bubble');
          if (bubble) bubble.style.opacity = '0.25';
        }
      });
    } else if (mode === 'c-major') {
      // Notes in C major: C, D, E, F, G, A, B
      const cMajNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      cells.forEach(cell => {
        const note = cell.dataset.note;
        if (cMajNotes.includes(note)) {
          if (note === 'C') {
            cell.classList.add('highlighted-root');
          } else {
            cell.classList.add('highlighted-note');
          }
        }
      });
    }
  }

  highlightChord(chordName) {
    const voicing = guitarAudio.getChordVoicing(chordName);
    if (!voicing) return;

    // Clear highlights
    const cells = this.container.querySelectorAll('.free-fret-cell');
    cells.forEach(c => c.classList.remove('highlighted-note', 'highlighted-root'));

    // Strum chord sound
    guitarAudio.strumChord(voicing, true, 35);

    // Highlight fretboard cells
    voicing.forEach((fret, idx) => {
      const stringNum = 6 - idx;
      if (fret >= 0) {
        const targetCell = this.container.querySelector(`.free-fret-cell[data-string="${stringNum}"][data-fret="${fret}"]`);
        if (targetCell) {
          targetCell.classList.add('highlighted-root');
        }
      }
    });

    if (this.noteDetectedText) {
      this.noteDetectedText.textContent = `Acorde de ${chordName} tocado`;
    }
  }

  strumFreeGuitar() {
    guitarAudio.strumChord([0, 0, 0, 0, 0, 0], true, 40);
  }
}
