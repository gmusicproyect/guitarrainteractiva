import { CLASE_5_PULSACIONES } from '../../data/courses/guitar1/05-primeras-pulsaciones/clase5.js';

const COURSE_BASE = 'data/courses/guitar1';

async function fetchJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`No se pudo cargar ${path} (${response.status})`);
  return response.json();
}

export async function loadCourseCatalog() {
  const [course, module] = await Promise.all([
    fetchJSON(`${COURSE_BASE}/course.json`),
    fetchJSON(`${COURSE_BASE}/module1/module.json`)
  ]);
  const folders = await Promise.all(module.folders.map(async slug => {
    const folder = await fetchJSON(`${COURSE_BASE}/module1/${slug}/manifest.json`);
    const xp = folder.practice.exercises?.reduce((sum, exercise) => sum + (exercise.xp || 0), 0)
      ?? (folder.skill?.id === CLASE_5_PULSACIONES.skillId ? CLASE_5_PULSACIONES.xpTotal : 0);
    return { ...folder, slug, xp };
  }));
  return { course, module, folders };
}
