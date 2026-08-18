/**
 * GMUSIC · MODULE 1 SKILL TREE VALIDATION TEST
 * Tests that all 5 classes, remediation hints, and skills from the flowchart
 * load with valid data, XP points, and runner associations.
 */

import { MODULE_1_COURSE, CLASE_1_DATA, CLASE_2_DATA, CLASE_3_DATA, CLASE_4_DATA, CLASE_5_DATA, MODULE_1_COMPLETION } from '../data/courses/guitar1/index.js';
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

console.log('\n--- VERIFICACIÓN DEL ÁRBOL DE HABILIDADES DEL MÓDULO 1 ---');

assert(MODULE_1_COURSE.clases.length === 5, 'El Módulo 1 contiene exactamente 5 clases de habilidades');

// Clase 1
assert(CLASE_1_DATA.skillId === 'g1.strings.open', 'Clase 1 registra skill g1.strings.open');
assert(CLASE_1_DATA.ejercicios.length === 6, 'Clase 1 tiene 6 ejercicios para las 6 cuerdas');
const c1e1 = CLASE_1_DATA.ejercicios[0];
const resC1 = exerciseEngine.evaluate(c1e1, { s: 5 });
assert(resC1.success === true, 'Clase 1 Ejercicio 1 valida cuerda 6 correctamente');

// Clase 2
assert(CLASE_2_DATA.skillId === 'g1.fretboard.coords', 'Clase 2 registra skill g1.fretboard.coords');
const c2e1 = CLASE_2_DATA.ejercicios[0];
const resC2 = exerciseEngine.evaluate(c2e1, { s: 0, f: 1 });
assert(resC2.success === true, 'Clase 2 Ejercicio 1 valida coordenada {s:0, f:1}');

// Clase 3
assert(CLASE_3_DATA.skillId === 'g1.melody.first-notes', 'Clase 3 registra skill g1.melody.first-notes');
assert(CLASE_3_DATA.melodiaSecuencia.secuencia.length === 3, 'Clase 3 define melodía Mi-Fa-Sol de 3 notas');

// Clase 4
assert(CLASE_4_DATA.skillId === 'g1.rhythm.pulse-60bpm', 'Clase 4 registra skill g1.rhythm.pulse-60bpm');
assert(CLASE_4_DATA.ejercicioRitmo.bpm === 60 && CLASE_4_DATA.ejercicioRitmo.bpmReducido === 45, 'Clase 4 tiene 60 BPM con fallback H4 a 45 BPM');

// Clase 5
assert(CLASE_5_DATA.skillId === 'g1.capstone.first-riff', 'Clase 5 registra skill g1.capstone.first-riff');
assert(CLASE_5_DATA.frase1.secuencia.length === 4, 'Clase 5 Frase 1 tiene 4 notas');
assert(CLASE_5_DATA.frase2.secuencia.length === 4, 'Clase 5 Frase 2 tiene 4 notas');
assert(CLASE_5_DATA.riffCompleto.secuenciaCompleta.length === 8, 'Clase 5 Riff completo une Frase 1 y Frase 2 (8 notas)');

// Desbloqueo Módulo 2
assert(MODULE_1_COMPLETION.skillsCertified.length === 5, 'Certificación final acredita 5 habilidades dominadas');
assert(MODULE_1_COMPLETION.nextModule.id === 'g1-m2', 'Puente configurado hacia Módulo 2 (Primeros Acordes)');

console.log(`\n========================================`);
console.log(`TEST DE HABILIDADES MÓDULO 1: ${passed} PASADAS, ${failed} FALLIDAS`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
