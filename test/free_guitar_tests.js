import test from 'node:test';
import assert from 'node:assert/strict';
import { FreeGuitarUI } from '../js/ui/free-guitar.js';
import { GuitarEngine } from '../js/engine/guitar-engine.js';
import { STRINGS } from '../js/music/strings.js';

const english = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const spanish = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

test('fret-note feedback names every string and fret in Spanish and English without throwing', () => {
  const ui = Object.assign(Object.create(FreeGuitarUI.prototype), { noteDetectedText: {}, guitar: { tonality: { root: 0, tipo: 'mayor' } } });
  const openPitchClasses = [4, 11, 7, 2, 9, 4];
  for (const stringData of STRINGS) {
    for (let f = 0; f <= 12; f++) {
      ui.showNote({ s: stringData.s, f, stringData });
      const pitchClass = (openPitchClasses[stringData.s] + f) % 12;
      assert.equal(ui.noteDetectedText.textContent, `${english[pitchClass]} (${spanish[pitchClass]}) · ${stringData.s + 1}ª cuerda, ${f === 0 ? 'al aire' : `traste ${f}`}`);
    }
  }
  ui.guitar.tonality = { root: 5, tipo: 'mayor' };
  ui.showNote({ s: 4, f: 1, stringData: STRINGS[4] });
  assert.equal(ui.noteDetectedText.textContent, 'Bb (Si♭) · 5ª cuerda, traste 1');
});

function cellForNote(note) {
  const classes = new Set();
  const bubble = { textContent: note, style: {} };
  return {
    dataset: { note }, bubble,
    classList: { add: (...names) => names.forEach(name => classes.add(name)), remove: (...names) => names.forEach(name => classes.delete(name)), contains: name => classes.has(name) },
    querySelector: () => bubble
  };
}

function guitarWithCells() {
  const cells = english.map(cellForNote);
  const guitar = Object.assign(Object.create(GuitarEngine.prototype), { fretCells: Object.fromEntries(cells.map((cell, index) => [index, cell])), activeHighlights: [] });
  const ui = Object.assign(Object.create(FreeGuitarUI.prototype), {
    guitar, container: { querySelectorAll: () => cells }, modal: { querySelectorAll: () => [] }, btnStrum: {}
  });
  return { cells, ui };
}

test('both scale presets highlight their exact notes and roots and hide other note labels', () => {
  const { cells, ui } = guitarWithCells();
  for (const [mode, root, notes] of [['am-pentatonic', 'A', ['A', 'C', 'D', 'E', 'G']], ['c-major', 'C', ['C', 'D', 'E', 'F', 'G', 'A', 'B']]]) {
    ui.applyFilter(mode);
    for (const cell of cells) {
      const note = cell.dataset.note;
      assert.equal(cell.classList.contains('highlighted-root'), note === root);
      assert.equal(cell.classList.contains('highlighted-note'), notes.includes(note) && note !== root);
      assert.equal(cell.bubble.style.display, notes.includes(note) ? 'inline-block' : 'none');
      assert.equal(cell.bubble.style.opacity, '1');
    }
  }
});

test('returning from chord or clean view restores note labels and clears scale markers', () => {
  const { cells, ui } = guitarWithCells();
  ui.applyFilter('am-pentatonic');
  cells[0].bubble.textContent = '1';
  ui.currentChordId = 'Am-open';
  ui.applyFilter('clean');
  assert.ok(cells.every(cell => cell.bubble.style.display === 'none'));
  ui.applyFilter('notes');
  assert.equal(ui.currentChordId, null);
  cells.forEach(cell => {
    assert.equal(cell.bubble.textContent, cell.dataset.note);
    assert.equal(cell.bubble.style.display, 'inline-block');
    assert.equal(cell.bubble.style.opacity, '1');
    assert.equal(cell.classList.contains('highlighted-root'), false);
    assert.equal(cell.classList.contains('highlighted-note'), false);
  });
});
