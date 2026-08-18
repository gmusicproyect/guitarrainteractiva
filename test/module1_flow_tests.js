/**
 * GMUSIC · MODULE 1 (EL INSTRUMENTO) FLOW VALIDATION TEST
 * Tests all 5 instrument classes:
 * 01-Anatomía, 02-Clavijero, 03-Las Seis Cuerdas, 04-Cejuela y Trastes, 05-Primeras Pulsaciones.
 */

import {
  MODULO_1_INSTRUMENTO_COURSE,
  CLASE_1_ANATOMIA,
  CLASE_2_CLAVIJERO,
  CLASE_3_CUERDAS,
  CLASE_4_CEJUELA_TRASTES,
  CLASE_5_PULSACIONES,
  MODULO_1_COMPLETION
} from '../data/courses/guitar1/index.js';
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

console.log('\n--- VERIFICACIÓN DEL FLUJO PEDAGÓGICO DEL MÓDULO 1 (EL INSTRUMENTO) ---');

assert(MODULO_1_INSTRUMENTO_COURSE.clases.length === 5, 'El Módulo 1 contiene exactamente 5 clases del instrumento');

// Clase 1: Anatomía
assert(CLASE_1_ANATOMIA.skillId === 'g1.m1.anatomy', 'Clase 1 registra skill g1.m1.anatomy');
assert(CLASE_1_ANATOMIA.partes.length === 8, 'Clase 1 define las 8 partes físicas de la guitarra');
const c1e1 = CLASE_1_ANATOMIA.ejercicios[0];
const resC1 = exerciseEngine.evaluate(c1e1, { seleccion: 'En la pala o cabeza' });
assert(resC1.success === true, 'Clase 1 Ejercicio 1 valida ubicación de clavijas');

// Clase 2: Clavijero
assert(CLASE_2_CLAVIJERO.skillId === 'g1.m1.tuning-pegs', 'Clase 2 registra skill g1.m1.tuning-pegs');
assert(CLASE_2_CLAVIJERO.mapaClavijas.length === 6, 'Clase 2 mapea las 6 clavijas');
const c2e2 = CLASE_2_CLAVIJERO.ejercicios[1];
const resC2 = exerciseEngine.evaluate(c2e2, { s: 5 });
assert(resC2.success === true, 'Clase 2 Ejercicio 2 valida selección de 6ª cuerda para afinar');

// Clase 3: Las Seis Cuerdas
assert(CLASE_3_CUERDAS.skillId === 'g1.m1.strings-open', 'Clase 3 registra skill g1.m1.strings-open');
assert(CLASE_3_CUERDAS.ejercicios.length === 6, 'Clase 3 tiene 6 ejercicios para las 6 cuerdas');
const c3e1 = CLASE_3_CUERDAS.ejercicios[0];
const resC3 = exerciseEngine.evaluate(c3e1, { s: 5 });
assert(resC3.success === true, 'Clase 3 Ejercicio 1 valida 6ª cuerda (Mi grave)');

// Clase 4: Cejuela y Trastes
assert(CLASE_4_CEJUELA_TRASTES.skillId === 'g1.m1.nut-and-frets', 'Clase 4 registra skill g1.m1.nut-and-frets');
const c4e1 = CLASE_4_CEJUELA_TRASTES.ejercicios[0];
const resC4 = exerciseEngine.evaluate(c4e1, { s: 0, f: 0 });
assert(resC4.success === true, 'Clase 4 Ejercicio 1 valida traste 0 (cuerda al aire)');

// Clase 5: Primeras Pulsaciones
assert(CLASE_5_PULSACIONES.skillId === 'g1.m1.first-plucks', 'Clase 5 registra skill g1.m1.first-plucks');
assert(CLASE_5_PULSACIONES.ejercicioSecuenciaAire.secuencia.length === 6, 'Clase 5 define secuencia de pulsación en 6 cuerdas');

// Desbloqueo Módulo 2
assert(MODULO_1_COMPLETION.skillsCertified.length === 5, 'Certificación final acredita 5 habilidades del instrumento');
assert(MODULO_1_COMPLETION.nextModule.id === 'g1-m2', 'Puente configurado hacia Módulo 2 (Primeros Acordes)');

console.log(`\n========================================`);
console.log(`TEST DE FLUJO MÓDULO 1: ${passed} PASADAS, ${failed} FALLIDAS`);
console.log(`========================================\n`);
