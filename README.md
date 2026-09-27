# GMusic · Guitarra interactiva

Un espacio de práctica de guitarra en español: lecciones guiadas, instrumento interactivo, ejercicios con respuesta inmediata y sonido generado en el navegador. HTML, CSS y módulos JavaScript nativos, con una copia local de Tonal para el laboratorio de armonía y sin compilación necesaria para servir el sitio.

[Abrir la versión publicada](https://gmusicproyect.github.io/guitarrainteractiva/)

## Qué incluye

- Un panel de estudio con la siguiente misión, la ruta y las habilidades aprendidas.
- El **Módulo 1: Conoce tu guitarra**, con bienvenida y cinco habilidades: anatomía, clavijero, cuerdas al aire, cejuela y trastes, y primeras pulsaciones.
- Ejercicios que comprueban la respuesta antes de avanzar y permiten volver a intentarlo.
- Progreso local, desbloqueo secuencial y XP por completar una clase; los repasos no duplican la recompensa.
- Una guitarra libre para explorar notas, acordes y escalas con Web Audio.
- Un [Laboratorio de armonía](index.html#armonia) con dos miniestudios originales, I–vi–IV–V y ii–V–I, en seis tonalidades mayores: reproducción por acordes, exploración de tríadas en el diapasón y una pregunta sobre el grado V.
- Navegación con teclado, diálogos con gestión de foco y adaptación a pantallas pequeñas.

**Alcance actual:** los módulos 2–5 aparecen como próximos contenidos. No están implementados como cursos completos. El progreso pertenece al navegador y al dispositivo: no hay cuentas, autenticación, servidor ni sincronización entre dispositivos. Los ejercicios evalúan la interacción en pantalla; no califican el sonido de una guitarra real mediante el micrófono.

El laboratorio es una práctica independiente del XP y del progreso de las clases. Sus sonidos son sintetizados; no incluye catálogo de canciones ni análisis automático de grabaciones. Consulta la [selección de recursos musicales](docs/MUSIC_RESOURCES.md) para conocer el papel de Open Music Theory, Tonal y los demás proyectos, y los [avisos de terceros](docs/THIRD_PARTY.md) para mantener la dependencia local.

## Guardado del avance

Se recuerdan las clases completadas, la bienvenida vista y las fechas de práctica. Una clase pendiente comienza de nuevo; no se guarda la posición dentro de sus ejercicios. El XP se calcula desde las clases completadas: las cinco habilidades suman 180 XP y la introducción aporta 5 XP adicionales.

Los datos se guardan en `localStorage` bajo la clave `gmusic.learner-progress.v1`. Borrar los datos del sitio elimina ese progreso; otro navegador, puerto o dominio tiene su propio registro. Si el almacenamiento está bloqueado, la interfaz lo indica y conserva el avance en memoria mientras la página permanece abierta.

## Ejecutar en local

Necesitas Node.js **22.13 o posterior**; el archivo `.nvmrc` selecciona Node 24. Desde la carpeta del repositorio:

```bash
npm ci
npm run serve
```

Abre [http://127.0.0.1:3000/](http://127.0.0.1:3000/). El servidor de desarrollo solo escucha en tu equipo. Para otro puerto:

```bash
npm run serve -- --port 3001
```

También puedes usar cualquier servidor de archivos estáticos, por ejemplo `python3 -m http.server 3000`. Abre la aplicación por HTTP, no mediante `file://`: los módulos y los manifiestos JSON necesitan un servidor.

El navegador debe admitir módulos JavaScript, `fetch` y Web Audio. El audio se activa al interactuar con la página. Las tipografías de Google Fonts requieren conexión; si no están disponibles, se utilizan las fuentes de respaldo.

## Verificar cambios

```bash
npm run check
```

Este comando ejecuta las siguientes verificaciones:

| Comando | Qué comprueba |
| --- | --- |
| `npm run check:static` | Sintaxis JavaScript, scripts integrados en las páginas históricas, JSON válido y existencia de imports, recursos locales y manifiestos referenciados. |
| `npm test` | Contratos musicales, estructura y ejercicios del Módulo 1, y pruebas de regresión del comportamiento. |
| `npm run check:vendor` | Coherencia de la copia local de Tonal con su generación reproducible. |

Las pruebas usan el ejecutor integrado de Node. Tras `npm ci`, las verificaciones se ejecutan localmente sin conexión. La validación estática comprueba referencias literales; las rutas calculadas en tiempo de ejecución y el diseño visual deben comprobarse en el navegador.

El flujo de GitHub Actions ejecuta `npm ci` y `npm run check` con Node 22 y 24 en cada push y pull request. Usa permisos de lectura y versiones de las acciones fijadas a un commit. Dependabot propone actualizaciones de esas acciones.

Antes de publicar un cambio visual o de interacción, comprueba también en el navegador:

1. Completar la bienvenida y abrir la siguiente clase desde el panel y la ruta.
2. Responder incorrectamente, volver a intentar y confirmar que solo una respuesta válida permite avanzar.
3. Completar una clase, recargar y comprobar el progreso y el siguiente desbloqueo.
4. Repasar una clase y comprobar que el XP no se duplica.
5. Recorrer botones y diálogos con Tab, Mayús+Tab y Escape, y revisar la vista móvil.
6. Activar el sonido, cambiar de vista durante una reproducción y abrir la guitarra libre.
7. Abrir Armonía, cambiar tonalidad y progresión, escuchar la secuencia y responder el reto del grado V.

## Organización

| Ruta | Responsabilidad |
| --- | --- |
| `index.html` | Aplicación principal y bienvenida. |
| `css/` | Estilos del panel, guitarra, ruta y diálogos. |
| `js/app.js` | Inicio de la aplicación y navegación. |
| `js/ui/` | Controladores de las vistas y las prácticas. |
| `js/engine/` | Audio, guitarra y evaluación de ejercicios. |
| `js/state/` | Guardado, validación y cálculo del progreso local. |
| `js/music/` | Cuerdas, notas, acordes, escalas y formas CAGED. |
| `js/vendor/` | Copia local de Tonal y su licencia. |
| `docs/` | Recursos musicales, decisiones de integración y avisos de terceros. |
| `data/courses/guitar1/course.json` | Mapa de los cinco módulos. |
| `data/courses/guitar1/module1/` | Manifiesto del módulo y contenido de cada carpeta. |
| `test/` | Pruebas automatizadas. |
| `scripts/` | Servidor local y validación estática. |
| `.github/` | Integración continua y actualización de acciones. |

La aplicación principal carga el Módulo 1 desde sus manifiestos JSON. Los datos JavaScript anteriores se conservan porque otros ejercicios y pruebas todavía los utilizan. Al modificar un contenido, revisa sus consumidores y mantén coherentes la enseñanza, la respuesta y la condición de desbloqueo.

Las páginas `guitarra-uno.html` y `guitarra-interactiva.html` se conservan como demostraciones históricas. Su comportamiento y sus datos son independientes del panel principal.

## Publicación

El sitio se puede servir directamente desde la raíz del repositorio en GitHub Pages o en cualquier alojamiento estático. Publica `index.html` junto con `css/`, `js/`, `data/` y los recursos que referencie. No hay una carpeta `dist` ni variables de entorno obligatorias.

El flujo de calidad valida los cambios; no despliega el sitio. La publicación depende de la configuración de Pages del repositorio.
