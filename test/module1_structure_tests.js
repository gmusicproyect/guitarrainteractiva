const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const moduleRoot = path.join(__dirname, '..', 'data', 'courses', 'guitar1', 'module1');
const readJSON = filePath => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const moduleManifest = readJSON(path.join(moduleRoot, 'module.json'));
const folders = moduleManifest.folders.map(folderName => ({
  folderName,
  ...readJSON(path.join(moduleRoot, folderName, 'manifest.json'))
}));

assert.deepEqual(
  folders.map(folder => folder.order),
  [0, 1, 2, 3, 4, 5, 6],
  'Las carpetas deben mantener un orden continuo del 00 al 06'
);

const skillFolders = folders.filter(folder => folder.kind === 'skill');
assert.equal(skillFolders.length, 4, 'El Módulo 1 debe certificar exactamente cuatro habilidades');
assert.deepEqual(
  skillFolders.map(folder => folder.skill.id),
  moduleManifest.certifiedSkills,
  'Las habilidades certificadas deben coincidir con las cuatro carpetas de habilidad'
);

const capstone = folders.find(folder => folder.kind === 'capstone');
assert.ok(capstone, 'Debe existir un reto integrador');
assert.equal(capstone.skill.id, moduleManifest.capstone);
assert.equal(capstone.skill.certifiesIndependentSkill, false);
assert.equal(capstone.assessment.certifies, false);
assert.equal(capstone.assessment.integratesSkills, 4);

for (const folder of folders) {
  assert.ok(folder.id && folder.title && folder.purpose, `${folder.folderName} necesita identidad y propósito`);
  assert.ok(folder.teaching?.card, `${folder.folderName} necesita contenido de enseñanza`);
  assert.ok(folder.practice?.title, `${folder.folderName} necesita una práctica`);
  assert.ok(
    Array.isArray(folder.practice.sections) || Array.isArray(folder.practice.steps),
    `${folder.folderName} necesita pasos o secciones de práctica`
  );
  assert.ok(folder.remediation?.message, `${folder.folderName} necesita recuperación pedagógica`);
  assert.ok(folder.assessment?.exitCriteria, `${folder.folderName} necesita criterio de salida`);
  assert.ok(folder.unlocks, `${folder.folderName} debe declarar qué desbloquea`);
}

const skillIds = new Set(skillFolders.map(folder => folder.skill.id));
for (const folder of skillFolders) {
  for (const prerequisite of folder.prerequisites) {
    assert.ok(
      skillIds.has(prerequisite) || prerequisite === 'g1-m1-onboarding',
      `${folder.folderName} tiene un prerrequisito desconocido: ${prerequisite}`
    );
  }
}

const pulse = folders.find(folder => folder.skill?.id === 'g1.rhythm.pulse-60bpm');
assert.deepEqual(pulse.practice.config, { bpm: 60, remediationBpm: 45, toleranceMs: 180 });
assert.match(pulse.assessment.scoreFormula, /180 ms/);
assert.match(pulse.assessment.exitCriteria, /85%/);

console.log('Module 1 structure: all assertions passed');
