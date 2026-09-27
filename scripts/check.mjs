import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const ignored = new Set(['node_modules', 'work', 'coverage', 'test-results', 'playwright-report', '_extracted']);
const errors = [];
let referenceCount = 0;
let scriptCount = 0;
let jsonCount = 0;

function collect(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('.') || ignored.has(entry.name)) return [];
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return collect(filename);
    return entry.isFile() ? [filename] : [];
  });
}

function checkSyntax(filename, source, module = true) {
  scriptCount += 1;
  const args = source === undefined
    ? ['--check', filename]
    : ['--check', `--input-type=${module ? 'module' : 'commonjs'}`];
  const result = spawnSync(process.execPath, args, { input: source, encoding: 'utf8' });
  if (result.status !== 0) {
    errors.push(`${path.relative(root, filename)}: ${result.stderr || result.error?.message || 'Sintaxis inválida'}`);
  }
}

function checkReference(filename, reference) {
  if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference)) return;
  const pathname = reference.split(/[?#]/, 1)[0];
  if (!pathname) return;
  referenceCount += 1;
  let target;
  try {
    target = path.resolve(pathname.startsWith('/') ? root : path.dirname(filename), decodeURIComponent(pathname.replace(/^\//, '')));
  } catch {
    errors.push(`${path.relative(root, filename)}: ruta inválida ${reference}`);
    return;
  }
  const relative = path.relative(root, target);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    errors.push(`${path.relative(root, filename)}: recurso fuera del proyecto: ${reference}`);
  } else if (!existsSync(target) || (!statSync(target).isFile() && !existsSync(path.join(target, 'index.html')))) {
    errors.push(`${path.relative(root, filename)}: no existe ${reference}`);
  }
}

function checkManifestReferences(filename, value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.manifest === 'string') checkReference(filename, value.manifest);
  for (const child of Object.values(value)) checkManifestReferences(filename, child);
}

for (const filename of collect(root).sort()) {
  const extension = path.extname(filename);
  if (!['.js', '.mjs', '.json', '.html', '.css'].includes(extension)) continue;
  const source = readFileSync(filename, 'utf8');

  if (extension === '.js' || extension === '.mjs') {
    checkSyntax(filename);
    for (const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.{1,2}\/[^'"]+)\1/g)) {
      checkReference(filename, match[2]);
    }
  }

  if (extension === '.json') {
    try {
      const data = JSON.parse(source);
      jsonCount += 1;
      checkManifestReferences(filename, data);
      if (path.basename(filename) === 'module.json' && Array.isArray(data.folders)) {
        data.folders.forEach(folder => checkReference(filename, `${folder}/manifest.json`));
      }
    } catch (error) {
      errors.push(`${path.relative(root, filename)}: ${error.message}`);
    }
  }

  if (extension === '.html') {
    for (const match of source.matchAll(/<(?:script|link|img|source|a)\b[^>]*?\b(?:src|href)\s*=\s*(['"])(.*?)\1/gi)) {
      checkReference(filename, match[2]);
    }
    for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (/\bsrc\s*=/i.test(match[1]) || !match[2].trim()) continue;
      if (/\btype\s*=\s*['"]application\/(?:ld\+)?json['"]/i.test(match[1])) continue;
      checkSyntax(filename, match[2], /\btype\s*=\s*['"]module['"]/i.test(match[1]));
    }
  }

  if (extension === '.css') {
    for (const match of source.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/gi)) {
      checkReference(filename, match[1]);
    }
  }
}

if (errors.length) {
  console.error(`Verificación estática: ${errors.length} problema(s).\n${errors.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Verificación estática correcta: ${scriptCount} scripts, ${jsonCount} JSON y ${referenceCount} referencias locales.`);
}
