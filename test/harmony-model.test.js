import test from "node:test";
import assert from "node:assert/strict";
import {
  KEYS,
  PROGRESSIONS,
  buildProgression,
  getFretboard,
  noteLabel,
} from "../js/music/harmony.js";

const EXPECTED_SCALES = {
  C: ["C", "D", "E", "F", "G", "A", "B"],
  G: ["G", "A", "B", "C", "D", "E", "F#"],
  D: ["D", "E", "F#", "G", "A", "B", "C#"],
  F: ["F", "G", "A", "Bb", "C", "D", "E"],
  A: ["A", "B", "C#", "D", "E", "F#", "G#"],
  Bb: ["Bb", "C", "D", "Eb", "F", "G", "A"],
};
const EXPECTED_SYMBOLS = {
  C: { pop: ["C", "Am", "F", "G"], cadence: ["Dm", "G", "C"] },
  G: { pop: ["G", "Em", "C", "D"], cadence: ["Am", "D", "G"] },
  D: { pop: ["D", "Bm", "G", "A"], cadence: ["Em", "A", "D"] },
  F: { pop: ["F", "Dm", "Bb", "C"], cadence: ["Gm", "C", "F"] },
  A: { pop: ["A", "F#m", "D", "E"], cadence: ["Bm", "E", "A"] },
  Bb: { pop: ["Bb", "Gm", "Eb", "F"], cadence: ["Cm", "F", "Bb"] },
};
const PITCH_CLASSES = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};
const TUNING_MIDI = [64, 59, 55, 50, 45, 40];
const ROLES = ["Fundamental", "Tercera", "Quinta"];

for (const key of KEYS) {
  test(`${key.tonic}: both progressions keep diatonic spelling, intervals, and chord quality`, () => {
    for (const progression of PROGRESSIONS) {
      const result = buildProgression(key.tonic, progression.id);
      assert.equal(result.tonic, key.tonic);
      assert.equal(result.keyLabel, key.label);
      assert.deepEqual(result.scale, EXPECTED_SCALES[key.tonic]);
      assert.deepEqual(
        result.chords.map((chord) => chord.symbol),
        EXPECTED_SYMBOLS[key.tonic][progression.id],
      );
      assert.deepEqual(
        result.chords.map((chord) => chord.degree),
        progression.degrees,
      );
      for (const chord of result.chords) {
        const index = chord.degree - 1;
        assert.deepEqual(chord.notes, [
          result.scale[index],
          result.scale[(index + 2) % 7],
          result.scale[(index + 4) % 7],
        ]);
        const isMinor = [2, 3, 6].includes(chord.degree);
        assert.equal(chord.quality, isMinor ? "minor" : "major");
        assert.deepEqual(chord.intervals, ["1P", isMinor ? "3m" : "3M", "5P"]);
        assert.deepEqual(
          chord.pitchClasses,
          chord.notes.map((note) => PITCH_CLASSES[note]),
        );
        assert.deepEqual(
          chord.pitchClasses.map(
            (pc) => (pc - chord.pitchClasses[0] + 12) % 12,
          ),
          [0, isMinor ? 3 : 4, 7],
        );
        assert.equal(
          chord.roman,
          ["I", "ii", "iii", "IV", "V", "vi", "vii°"][index],
        );
        assert.ok(
          chord.spanishName && chord.functionLabel && chord.explanation,
        );
      }
    }
  });
}

test("every fret coordinate matches standard tuning and labels chord tones consistently", () => {
  for (const key of KEYS) {
    for (const progression of PROGRESSIONS) {
      for (const chord of buildProgression(key.tonic, progression.id).chords) {
        const rows = getFretboard(chord);
        assert.equal(rows.length, 6);
        rows.forEach((row, string) => {
          assert.equal(row.string, string);
          assert.match(row.label, new RegExp(`^${string + 1}ª · `));
          assert.equal(row.cells.length, 6);
          row.cells.forEach((cell, fret) => {
            const pitchClass = (TUNING_MIDI[string] + fret) % 12;
            const chordIndex = chord.pitchClasses.indexOf(pitchClass);
            assert.equal(cell.fret, fret);
            assert.equal(cell.pitchClass, pitchClass);
            assert.equal(PITCH_CLASSES[cell.note], pitchClass);
            assert.equal(cell.inChord, chordIndex >= 0);
            assert.equal(
              cell.intervalLabel,
              chordIndex >= 0 ? ROLES[chordIndex] : "",
            );
            if (cell.inChord) assert.equal(cell.note, chord.notes[chordIndex]);
          });
        });
      }
    }
  }
});

test("flat keys keep Bb and Eb spellings on the fretboard, including diminished fifths", () => {
  const bb = buildProgression("Bb", "pop").chords[0];
  const bbCells = getFretboard(bb, 16).flatMap((row) => row.cells);
  assert.ok(bbCells.some((cell) => cell.note === "Bb"));
  assert.ok(
    bbCells
      .filter((cell) => cell.pitchClass === 10)
      .every(
        (cell) => cell.note === "Bb" && cell.intervalLabel === "Fundamental",
      ),
  );
  const diminished = { quality: "diminished", notes: ["A", "C", "Eb"] };
  const fifths = getFretboard(diminished, 16)
    .flatMap((row) => row.cells)
    .filter((cell) => cell.pitchClass === 3);
  assert.ok(fifths.length > 0);
  assert.ok(
    fifths.every(
      (cell) => cell.note === "Eb" && cell.intervalLabel === "Quinta",
    ),
  );
});

test("Spanish labels preserve tonal accidentals, accept display glyphs, and omit octaves", () => {
  for (const [input, expected] of [
    ["C", "Do"],
    ["D4", "Re"],
    ["F#3", "Fa♯"],
    ["Bb", "Si♭"],
    ["Eb2", "Mi♭"],
    ["B♭", "Si♭"],
    ["F♯", "Fa♯"],
    ["E#", "Mi♯"],
    ["Cb", "Do♭"],
  ]) {
    assert.equal(noteLabel(input), expected);
  }
  for (const invalid of ["", "H", "hello"])
    assert.throws(() => noteLabel(invalid), RangeError);
  for (const invalid of [null, undefined, 42, {}])
    assert.throws(() => noteLabel(invalid), TypeError);
});

test("invalid keys, progressions, ranges, and contradictory chord data are rejected", () => {
  for (const tonic of ["H", "Cb", "B♭", "", null, undefined, {}])
    assert.throws(() => buildProgression(tonic, "pop"), RangeError);
  for (const id of ["other", "", null, undefined, {}])
    assert.throws(() => buildProgression("C", id), RangeError);
  const chord = buildProgression("C", "pop").chords[0];
  for (const maxFret of [-1, 17, 1.5, NaN, Infinity, "5", null])
    assert.throws(() => getFretboard(chord, maxFret), RangeError);
  for (const invalid of [
    null,
    {},
    { quality: "major", notes: ["C", "D", "E"] },
    { quality: "minor", notes: ["C", "E", "G"] },
    { quality: "major", notes: ["C4", "E4", "G4"] },
    { quality: "major", notes: ["C", "E", "H"] },
  ]) {
    assert.throws(() => getFretboard(invalid), TypeError);
  }
  assert.equal(getFretboard(chord, 0)[0].cells.length, 1);
  assert.equal(getFretboard(chord, 16)[0].cells.length, 17);
});

test("consumer edits cannot corrupt future calculations or public configuration", () => {
  assert.ok(Object.isFrozen(KEYS) && KEYS.every(Object.isFrozen));
  assert.ok(
    Object.isFrozen(PROGRESSIONS) &&
      PROGRESSIONS.every((progression) => Object.isFrozen(progression.degrees)),
  );
  const result = buildProgression("C", "pop");
  result.scale[0] = "H";
  result.chords[0].notes[0] = "H";
  result.chords[0].intervals[0] = "wrong";
  const next = buildProgression("C", "pop");
  assert.equal(next.scale[0], "C");
  assert.deepEqual(next.chords[0].notes, ["C", "E", "G"]);
  assert.deepEqual(next.chords[0].intervals, ["1P", "3M", "5P"]);
});
