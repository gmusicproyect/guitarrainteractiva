/** Original lesson model. Tonal provides note spelling, scales, and chord construction. */
import { Chord, Note, Scale } from "../vendor/tonal.js";

export const KEYS = Object.freeze(
  [
    { tonic: "C", label: "Do mayor" },
    { tonic: "G", label: "Sol mayor" },
    { tonic: "D", label: "Re mayor" },
    { tonic: "F", label: "Fa mayor" },
    { tonic: "A", label: "La mayor" },
    { tonic: "Bb", label: "Si♭ mayor" },
  ].map(Object.freeze),
);

export const PROGRESSIONS = Object.freeze(
  [
    {
      id: "pop",
      name: "Un viaje de cuatro acordes",
      degrees: Object.freeze([1, 6, 4, 5]),
    },
    {
      id: "cadence",
      name: "Tensión y reposo",
      degrees: Object.freeze([2, 5, 1]),
    },
  ].map(Object.freeze),
);

const SPANISH_NOTES = {
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
  A: "La",
  B: "Si",
};
const QUALITIES = [
  "major",
  "minor",
  "minor",
  "major",
  "major",
  "minor",
  "diminished",
];
const ROMANS = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
const QUALITY_LABELS = {
  major: "mayor",
  minor: "menor",
  diminished: "disminuido",
};
const SUFFIXES = { major: "", minor: "m", diminished: "dim" };
const DEGREE_FUNCTIONS = [
  {
    label: "Tónica",
    explanation:
      "Es el acorde de casa: suele dar una sensación de llegada y estabilidad.",
  },
  {
    label: "Predominante",
    explanation:
      "Prepara el movimiento hacia la dominante. Escucha cómo enlaza con el quinto grado.",
  },
  {
    label: "Reposo relativo",
    explanation:
      "Comparte dos notas con la tónica y ofrece otro color dentro de la tonalidad.",
  },
  {
    label: "Subdominante",
    explanation:
      "Abre el recorrido al alejarnos de la tónica. Puede preparar la tensión del quinto grado.",
  },
  {
    label: "Dominante",
    explanation:
      "Crea una sensación de dirección hacia la tónica. Al volver al primer grado puedes escuchar la resolución.",
  },
  {
    label: "Reposo relativo",
    explanation:
      "Es el acorde menor relativo: comparte dos notas con la tónica y cambia el color sin salir de la tonalidad.",
  },
  {
    label: "Dominante",
    explanation:
      "Su quinta disminuida genera inestabilidad y sus notas pueden conducir hacia la tónica.",
  },
];
const STANDARD_TUNING = ["E4", "B3", "G3", "D3", "A2", "E2"];
const CHORD_ROLES = ["Fundamental", "Tercera", "Quinta"];

/** Spanish pitch-name label, preserving accidentals and omitting the octave. */
export function noteLabel(note) {
  if (typeof note !== "string") throw new TypeError("A note must be a string.");
  const parsed = Note.get(note.replaceAll("♯", "#").replaceAll("♭", "b"));
  if (parsed.empty) throw new RangeError(`Unknown note: ${note}`);
  return `${SPANISH_NOTES[parsed.letter]}${parsed.acc.replaceAll("#", "♯").replaceAll("b", "♭")}`;
}

/** Build major-key diatonic triads for a supported progression; inputs are exact IDs. */
export function buildProgression(tonic, id) {
  const key = KEYS.find((candidate) => candidate.tonic === tonic);
  if (!key) throw new RangeError("Choose a supported major key.");
  const progression = PROGRESSIONS.find((candidate) => candidate.id === id);
  if (!progression) throw new RangeError("Choose a supported progression.");
  const scale = Scale.get(`${tonic} major`).notes;
  const chords = progression.degrees.map((degree) => {
    const root = scale[degree - 1];
    const quality = QUALITIES[degree - 1];
    const chord = Chord.getChord(quality, root);
    const functionCopy = DEGREE_FUNCTIONS[degree - 1];
    return {
      symbol: `${root}${SUFFIXES[quality]}`,
      spanishName: `${noteLabel(root)} ${QUALITY_LABELS[quality]}`,
      degree,
      roman: ROMANS[degree - 1],
      quality,
      notes: [...chord.notes],
      intervals: [...chord.intervals],
      pitchClasses: chord.notes.map((note) => Note.chroma(note)),
      functionLabel: functionCopy.label,
      explanation: functionCopy.explanation,
    };
  });
  return { tonic, keyLabel: key.label, scale: [...scale], chords };
}

/**
 * Six strings in high-E-first canonical order (string 0 = 1st string).
 * Each cell is a pitch name at fret 0..maxFret; chord notes keep their tonal spelling.
 * Markers identify chord tones, not a fingering or a recommended playable voicing.
 */
export function getFretboard(chord, maxFret = 5) {
  if (!Number.isInteger(maxFret) || maxFret < 0 || maxFret > 16)
    throw new RangeError("maxFret must be an integer from 0 to 16.");
  if (
    !chord ||
    !Object.hasOwn(QUALITY_LABELS, chord.quality) ||
    !Array.isArray(chord.notes) ||
    chord.notes.length !== 3
  ) {
    throw new TypeError("A major, minor, or diminished triad is required.");
  }
  const parsed = chord.notes.map((note) =>
    typeof note === "string" ? Note.get(note) : null,
  );
  if (parsed.some((note) => !note || note.empty || note.oct !== undefined))
    throw new TypeError(
      "Chord notes must be valid pitch names without octaves.",
    );
  const expected = Chord.getChord(chord.quality, parsed[0].pc).notes;
  if (parsed.some((note, index) => note.pc !== expected[index]))
    throw new TypeError("Chord notes must match its quality in root position.");
  const pitchClasses = parsed.map((note) => note.chroma);
  const useFlats = parsed.some((note) => note.acc.includes("b"));
  return STANDARD_TUNING.map((openNote, string) => {
    const openMidi = Note.midi(openNote);
    const cells = Array.from({ length: maxFret + 1 }, (_, fret) => {
      const midi = openMidi + fret;
      const pitchClass = midi % 12;
      const chordIndex = pitchClasses.indexOf(pitchClass);
      const inChord = chordIndex >= 0;
      const note = inChord
        ? chord.notes[chordIndex]
        : Note.pitchClass(
            useFlats ? Note.fromMidi(midi) : Note.fromMidiSharps(midi),
          );
      return {
        fret,
        note,
        pitchClass,
        inChord,
        intervalLabel: inChord ? CHORD_ROLES[chordIndex] : "",
      };
    });
    return { string, label: `${string + 1}ª · ${noteLabel(openNote)}`, cells };
  });
}
