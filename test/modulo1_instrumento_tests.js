import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exerciseEngine } from '../js/engine/exercise-engine.js';

const testRoot = path.dirname(fileURLToPath(import.meta.url));
const moduleRoot = path.join(testRoot, '..', 'data', 'courses', 'guitar1', 'module1');
const readJSON = relativePath => JSON.parse(fs.readFileSync(path.join(moduleRoot, relativePath), 'utf8'));
const moduleManifest = readJSON('module.json');
const anatomy = readJSON('01-anatomia-guitarra/manifest.json');
const tuning = readJSON('02-clavijero-y-afinacion/manifest.json');
const strings = readJSON('03-las-seis-cuerdas/manifest.json');
const frets = readJSON('04-cejuela-y-trastes/manifest.json');
const plucks = readJSON('05-primeras-pulsaciones/manifest.json');
const completion = readJSON('06-desbloqueo-modulo-2/manifest.json');

let passed = 0;
let failed = 0;

function check(condition, message) {
  if (condition) {
    passed += 1;
    console.log(`  PASS: ${message}`);
  } else {
    failed += 1;
    console.error(`  FAIL: ${message}`);
  }
}

console.log('\n--- VERIFICACIÓN DEL MÓDULO 1: CONOCE TU GUITARRA (EL INSTRUMENTO) ---');

check(moduleManifest.certifiedSkills.length === 5, 'El Módulo 1 contiene exactamente 5 clases sobre el instrumento');
check(anatomy.skill.id === 'g1.m1.anatomy', 'Clase 1 registra skill g1.m1.anatomy');
check(anatomy.content.parts.length === 8, 'Clase 1 define las 8 partes principales de la guitarra');
const anatomyResult = exerciseEngine.evaluate(anatomy.practice.exercises[0], { seleccion: 'En la pala o cabeza' });
check(anatomyResult.success === true, 'Clase 1 Ejercicio 1 evalúa respuesta conceptual sobre la pala');

check(tuning.skill.id === 'g1.m1.tuning-pegs', 'Clase 2 registra skill g1.m1.tuning-pegs');
check(tuning.content.tuningPegs.length === 6, 'Clase 2 mapea las 6 clavijas mecánicas');
const tuningResult = exerciseEngine.evaluate(tuning.practice.exercises[1], { s: 5 });
check(tuningResult.success === true, 'Clase 2 Ejercicio 2 evalúa selección de 6ª cuerda para afinar');

check(strings.skill.id === 'g1.m1.strings-open', 'Clase 3 registra skill g1.m1.strings-open');
check(strings.practice.exercises.length === 6, 'Clase 3 tiene ejercicios de las 6 cuerdas al aire');
const stringsResult = exerciseEngine.evaluate(strings.practice.exercises[0], { s: 5 });
check(stringsResult.success === true, 'Clase 3 Ejercicio 1 evalúa la 6ª cuerda (Mi grave)');

check(frets.skill.id === 'g1.m1.nut-and-frets', 'Clase 4 registra skill g1.m1.nut-and-frets');
const openResult = exerciseEngine.evaluate(frets.practice.exercises[0], { s: 0, f: 0 });
check(openResult.success === true, 'Clase 4 Ejercicio 1 evalúa traste 0 (cuerda al aire en cejuela)');
const firstFretResult = exerciseEngine.evaluate(frets.practice.exercises[1], { s: 0, f: 1 });
check(firstFretResult.success === true, 'Clase 4 Ejercicio 2 evalúa traste 1 (acortar cuerda para subir a Fa)');

check(plucks.skill.id === 'g1.m1.first-plucks', 'Clase 5 registra skill g1.m1.first-plucks');
check(plucks.practice.sequence.length === 6, 'Clase 5 define secuencia de pulsación limpia en 6 cuerdas');
check(completion.completion.skillsCertified.length === 5, 'Certificación final acredita 5 habilidades del instrumento');
check(completion.unlocks.target === 'guitar1-module2', 'Puente configurado hacia Módulo 2 (Primeros Acordes Em y Am)');

console.log(`\nTEST MÓDULO 1 (EL INSTRUMENTO): ${passed} PASADAS, ${failed} FALLIDAS`);
if (failed > 0) process.exit(1);
