import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--port')) {
  console.error('Uso: npm run serve -- --port 3000');
  process.exit(1);
}
const port = args.length ? Number(args[1]) : 3000;
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('El puerto debe ser un número entre 1 y 65535.');
  process.exit(1);
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

const server = createServer(async (request, response) => {
  const sendError = (status, message) => {
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : message);
  };
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.setHeader('Allow', 'GET, HEAD');
    sendError(405, 'Método no permitido');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    sendError(400, 'Ruta inválida');
    return;
  }
  if (pathname.includes('\0') || pathname.split(/[\\/]/).some(segment => segment.startsWith('.'))) {
    sendError(404, 'No encontrado');
    return;
  }

  try {
    let filename = path.resolve(root, `.${pathname}`);
    if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
    filename = await realpath(filename);
    const relative = path.relative(root, filename);
    if (relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) {
      sendError(404, 'No encontrado');
      return;
    }
    const contentType = types[path.extname(filename)];
    if (!contentType || !(await stat(filename)).isFile()) {
      sendError(404, 'No encontrado');
      return;
    }
    const data = await readFile(filename);
    response.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': data.byteLength,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) {
    const missing = ['ENOENT', 'ENOTDIR', 'EACCES'].includes(error.code);
    if (!missing) console.error('No se pudo servir el recurso:', error.message);
    sendError(missing ? 404 : 500, missing ? 'No encontrado' : 'Error al leer el recurso');
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `El puerto ${port} está ocupado. Usa npm run serve -- --port 3001.`
    : `No se pudo iniciar el servidor: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`GMusic disponible en http://127.0.0.1:${port}/ — Ctrl+C para salir.`);
});
