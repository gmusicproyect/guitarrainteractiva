# Dependencias y atribución

## Tonal 6.4.3 · MIT

El laboratorio de armonía utiliza [Tonal](https://github.com/tonaljs/tonal), publicado como [`tonal@6.4.3`](https://www.npmjs.com/package/tonal/v/6.4.3), para calcular nombres de notas, escalas e intervalos de acordes. La versión exacta y sus dependencias están fijadas en `package.json` y `package-lock.json`.

El navegador carga una copia local en [`js/vendor/tonal.js`](../js/vendor/tonal.js). No solicita código a una CDN ni requiere compilar la página antes de servirla. Se incluyen los módulos Chord, Note y Scale y sus dependencias necesarias, provenientes de la distribución de Tonal fijada en el archivo de bloqueo.

Los avisos de copyright, la licencia MIT íntegra y la relación de paquetes incluidos se distribuyen en [`js/vendor/tonal.LICENSE.txt`](../js/vendor/tonal.LICENSE.txt). El generador conserva las licencias de los paquetes incluidos; cuando un paquete del mismo proyecto no incorpora un archivo de licencia propio, utiliza la licencia MIT general de Tonal y comprueba su declaración de licencia.

## Generación reproducible

[esbuild 0.28.2](https://github.com/evanw/esbuild), bajo licencia MIT, se utiliza únicamente como herramienta de desarrollo para generar esta dependencia local. No forma parte del código enviado al navegador. Su versión también está fijada.

```sh
npm ci
npm run vendor:tonal
npm run check:vendor
```

El generador [`scripts/vendor-tonal.mjs`](../scripts/vendor-tonal.mjs) no inserta fechas ni rutas locales en el resultado. `check:vendor` vuelve a generar el contenido en memoria y comprueba que el código y los avisos distribuidos coincidan exactamente. También se ejecuta dentro de `npm run check`. Los cambios de versión requieren revisar y guardar el bundle y sus avisos actualizados junto con el archivo de bloqueo.

## Contenido pedagógico

Las descripciones de funciones armónicas y el texto de las prácticas son contenido original de esta aplicación. No se han copiado lecciones, ilustraciones ni bases de datos de Open Music Theory u otros cursos. Los nombres convencionales de notas e intervalos se calculan con Tonal.

El diapasón del laboratorio señala notas que pertenecen al acorde. Estas marcas no representan por sí solas una digitación recomendada: una combinación completa de marcas puede ser imposible de tocar simultáneamente.
