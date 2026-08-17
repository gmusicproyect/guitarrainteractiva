/**
 * GMUSIC CONTRACT TEST SUITE (v1.0 Contrato de Ejercicios)
 * Validates all doctrinal rules, technical conventions, continuity algorithms,
 * canonical spelling tables, anchor calculations, and the 11 exercise engines.
 */

import { STRINGS, STRING_BY_S, getMidiNote, getPitchClass } from '../js/music/strings.js';
import { SPELL, getSpelledNote, CANONICAL_TONALITIES } from '../js/music/spelling.js';
import { CHORDS, getAnchorFingers } from '../js/music/chords.js';
import { buildCagedChord, CAGED_FORMS } from '../js/music/caged.js';
import { getAbiertaSet, getAbiertaFretsString } from '../js/music/scales.js';
import { exerciseEngine } from '../js/engine/exercise-engine.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('\n--- 1. CONVENCIONES TÉCNICAS (s: 0..5, MIDI 40..64) ---');
assert(STRINGS[0].s === 0 && STRINGS[0].midi === 64, 's=0 es 1ª cuerda (Mi aguda, e) con midi 64');
assert(STRINGS[1].s === 1 && STRINGS[1].midi === 59, 's=1 es 2ª cuerda (Si, B) con midi 59');
assert(STRINGS[2].s === 2 && STRINGS[2].midi === 55, 's=2 es 3ª cuerda (Sol, G) con midi 55');
assert(STRINGS[3].s === 3 && STRINGS[3].midi === 50, 's=3 es 4ª cuerda (Re, D) con midi 50');
assert(STRINGS[4].s === 4 && STRINGS[4].midi === 45, 's=4 es 5ª cuerda (La, A) con midi 45');
assert(STRINGS[5].s === 5 && STRINGS[5].midi === 40, 's=5 es 6ª cuerda (Mi grave, E) con midi 40');
assert(getMidiNote(5, 3) === 43, 'midi en s:5, f:3 es 43 (Sol / G)');
assert(getPitchClass(5, 3) === 7, 'pitchClass en s:5, f:3 es 7 (Sol / G)');

console.log('\n--- 2. TABLA CANÓNICA SPELL (12 TONALIDADES) ---');
assert(CANONICAL_TONALITIES.length === 12, '12 tonalidades canónicas registradas');
const fSharpSeventh = getSpelledNote(5, { root: 6, tipo: 'mayor' });
assert(fSharpSeventh.en === 'E#' && fSharpSeventh.es === 'Mi#', 'En Fa# mayor (root:6), el 7º grado (pc:5) es Mi# (E#)');
const cMajorRoot = getSpelledNote(0, { root: 0, tipo: 'mayor' });
assert(cMajorRoot.en === 'C' && cMajorRoot.es === 'Do', 'En Do mayor (root:0), la tónica es Do (C)');
const dbMajorRoot = getSpelledNote(1, { root: 1, tipo: 'mayor' });
assert(dbMajorRoot.en === 'Db' && dbMajorRoot.es === 'Re♭', 'En Re♭ mayor (root:1), la tónica es Re♭ (Db)');

console.log('\n--- 3. REGLA DE CONTINUIDAD EN ESCALAS (abiertaSet) ---');
const reMayorResult = getAbiertaFretsString(2, 'mayor');
assert(reMayorResult === '023-024-024-02-023-023', `Re mayor continuidad: esperado 023-024-024-02-023-023, obtenido: ${reMayorResult}`);

const doMayorResult = getAbiertaFretsString(0, 'mayor');
assert(doMayorResult === '013-023-023-02-013-013', `Do mayor continuidad: esperado 013-023-023-02-013-013, obtenido: ${doMayorResult}`);

const solMayorResult = getAbiertaFretsString(7, 'mayor');
assert(solMayorResult === '023-023-024-02-013-023', `Sol mayor continuidad: esperado 023-023-024-02-013-023, obtenido: ${solMayorResult}`);

console.log('\n--- 4. ACORDES, DEDOS ANCLA Y CAGED ---');
const amToCAnchors = getAnchorFingers('Am-open', 'C-open');
assert(amToCAnchors.length === 2, 'Am ➔ C tiene 2 dedos ancla comunes');
assert(amToCAnchors.some(a => a.s === 1 && a.f === 1 && a.finger === 1), 'Dedo 1 en s:1 f:1 es ancla entre Am y C');
assert(amToCAnchors.some(a => a.s === 3 && a.f === 2 && a.finger === 2), 'Dedo 2 en s:3 f:2 es ancla entre Am y C');

const cagedCInFret3 = buildCagedChord('C', 3);
assert(cagedCInFret3.positions[4].f === 3 && cagedCInFret3.positions[1].f === 1, 'Forma C en ancla 3 reproduce Do abierto');

console.log('\n--- 5. LOS 11 MOTORES DE EJERCICIO ---');

// 4.1 find_string
const resFindString = exerciseEngine.evaluate(
  { type: 'find_string', pregunta: 'Toca la cuerda La', respuesta: { s: 4 } },
  { s: 4 }
);
assert(resFindString.success === true, '4.1 find_string evalúa acierto en s:4');

// 4.2 find_fret
const resFindFret = exerciseEngine.evaluate(
  { type: 'find_fret', pregunta: 'Toca el traste 3 de la 6ª cuerda', respuesta: { s: 5, f: 3 } },
  { s: 5, f: 3 }
);
assert(resFindFret.success === true, '4.2 find_fret evalúa acierto en s:5, f:3');

// 4.3 find_note
const resFindNote = exerciseEngine.evaluate(
  { type: 'find_note', pregunta: 'Encuentra un Do', tonalidad: { root: 0, tipo: 'mayor' }, respuesta: { pc: 0 }, ventana: { vista: 'custom', desde: 0, hasta: 5 } },
  { s: 1, f: 1 }
);
assert(resFindNote.success === true, '4.3 find_note evalúa Do en s:1, f:1');

// 4.4 place_finger
const resPlaceFinger = exerciseEngine.evaluate(
  { type: 'place_finger', instruccion: 'Dedo 1 → 3ª cuerda, traste 1', respuesta: { s: 2, f: 1, dedo: 1 } },
  { s: 2, f: 1, dedo: 1 }
);
assert(resPlaceFinger.success === true, '4.4 place_finger evalúa colocación de dedo');

// 4.5 build_chord
const resBuildChord = exerciseEngine.evaluate(
  { type: 'build_chord', chordId: 'Am-open' },
  { 1: { f: 1 }, 2: { f: 2 }, 3: { f: 2 } }
);
assert(resBuildChord.success === true, '4.5 build_chord evalúa construcción de Am');

// 4.6 identify_chord
const resIdentifyChord = exerciseEngine.evaluate(
  { type: 'identify_chord', muestra: { acorde: 'G' }, opciones: ['G', 'C', 'Em'], respuesta: 'G' },
  { seleccion: 'G' }
);
assert(resIdentifyChord.success === true, '4.6 identify_chord evalúa selección correcta');

// 4.7 complete_chord
const resCompleteChord = exerciseEngine.evaluate(
  { type: 'complete_chord', acorde: 'C', dadas: [{s:4,f:3},{s:2,f:0},{s:1,f:1},{s:0,f:0}], respuesta: { s: 3, f: 2 } },
  { s: 3, f: 2 }
);
assert(resCompleteChord.success === true, '4.7 complete_chord evalúa nota faltante');

// 4.8 chord_transition
const transitionRunner = exerciseEngine.getRunner('chord_transition');
const planTransition = transitionRunner.getTransitionPlan({ secuencia: ['Am', 'C'], bpm: 60, cambiaCada: 4, mostrarAnclas: true });
assert(planTransition.length === 2 && planTransition[0].anchors.length === 2, '4.8 chord_transition genera plan con anclas');

// 4.9 play_sequence
const playSequenceRunner = exerciseEngine.getRunner('play_sequence');
const scalePlan = playSequenceRunner.buildPlan({ escala: { root: 2, tipo: 'mayor', vista: 'abierta' }, bpm: 70 });
assert(scalePlan.sequence.length === 17, '4.9 play_sequence genera secuencia continua de 17 notas para Re mayor (023-024-024-02-023-023)');

// 4.10 multiple_choice
const resMultipleChoice = exerciseEngine.evaluate(
  { type: 'multiple_choice', pregunta: '¿Qué grado es Si en Sol mayor?', opciones: ['III', 'IV', 'V'], respuesta: 'III' },
  { seleccion: 'III' }
);
assert(resMultipleChoice.success === true, '4.10 multiple_choice evalúa respuesta conceptual');

// 4.11 listen_and_find
const resListenAndFind = exerciseEngine.evaluate(
  { type: 'listen_and_find', suenaPc: 4, ventana: { vista: 'custom', desde: 0, hasta: 4 }, respuesta: { pc: 4 } },
  { s: 0, f: 0 } // Mi al aire
);
assert(resListenAndFind.success === true, '4.11 listen_and_find evalúa nota escuchada');

console.log(`\n========================================`);
console.log(`RESULTADO DE AUDITORÍA: ${passed} PASADAS, ${failed} FALLIDAS`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
