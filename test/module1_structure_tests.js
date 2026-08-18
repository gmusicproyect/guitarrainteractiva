import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const testRoot = path.dirname(fileURLToPath(import.meta.url));
const courseRoot = path.join(testRoot, '..', 'data', 'courses', 'guitar1');
const moduleRoot = path.join(courseRoot, 'module1');
const readJSON = filePath => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const course = readJSON(path.join(courseRoot, 'course.json'));
const moduleManifest = readJSON(path.join(moduleRoot, 'module.json'));
const folders = moduleManifest.folders.map(folderName => ({
  folderName,
  ...readJSON(path.join(moduleRoot, folderName, 'manifest.json'))
}));

assert.equal(course.modules.length, 5, 'Guitarra 1 debe mostrar cinco módulos');
assert.equal(course.modules[0].id, moduleManifest.id);
assert.deepEqual(
  moduleManifest.folderSectionFlow,
  ['teaching', 'practice', 'remediation', 'assessment', 'unlocks']
);
assert.deepEqual(folders.map(folder => folder.order), [0, 1, 2, 3, 4, 5, 6]);

const skillFolders = folders.filter(folder => folder.kind === 'skill');
assert.equal(skillFolders.length, 5, 'El Módulo 1 debe certificar cinco habilidades del instrumento');
assert.deepEqual(skillFolders.map(folder => folder.skill.id), moduleManifest.certifiedSkills);
assert.equal(folders.some(folder => folder.kind === 'capstone'), false);

for (const folder of folders) {
  assert.ok(folder.id && folder.title && folder.purpose, `${folder.folderName} necesita identidad y propósito`);
  assert.ok(folder.teaching?.card && folder.teaching?.purpose, `${folder.folderName} necesita enseñanza completa`);
  assert.ok(folder.practice?.title && folder.practice?.purpose, `${folder.folderName} necesita práctica completa`);
  assert.ok(Array.isArray(folder.practice.sections) || Array.isArray(folder.practice.steps));
  assert.ok(folder.remediation?.message && folder.remediation?.purpose, `${folder.folderName} necesita apoyo completo`);
  assert.ok(folder.assessment?.exitCriteria && folder.assessment?.purpose, `${folder.folderName} necesita evaluación completa`);
  assert.ok(folder.unlocks?.target && folder.unlocks?.purpose, `${folder.folderName} necesita desbloqueo completo`);
}

assert.deepEqual(
  folders.slice(0, -1).map(folder => folder.unlocks.target),
  moduleManifest.folders.slice(1),
  'Cada carpeta debe desbloquear la siguiente etapa'
);
assert.equal(folders.at(-1).unlocks.target, moduleManifest.nextModule.id);
assert.equal(folders.at(-1).completion.totalXp, moduleManifest.totalXp);
assert.deepEqual(folders.at(-1).completion.skillsCertified, moduleManifest.certifiedSkills);

console.log('Module 1 structure: all assertions passed');
