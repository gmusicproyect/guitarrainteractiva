# Recursos musicales y laboratorio de armonía

El laboratorio conecta una práctica breve de guitarra con sus acordes, notas y grados. Los recursos siguientes tienen funciones distintas: unos aportan teoría y referencias; otros permiten calcular o visualizar música. La selección se revisó el 26 de septiembre de 2026.

## Primer piloto

El **Laboratorio de armonía**, accesible desde **Armonía** o [desde la aplicación](../index.html#armonia), contiene dos miniestudios originales sobre las progresiones **I–vi–IV–V** y **ii–V–I**. Se pueden explorar en Do, Sol, Re, Fa, La y Si♭ mayores (`C`, `G`, `D`, `F`, `A`, `Bb`).

El estudiante elige progresión, tonalidad y tempo, escucha cuatro pulsos por acorde, reconoce las notas de cada tríada en las seis cuerdas entre los trastes 0 y 5 y responde una pregunta breve sobre el grado V. La visualización muestra ubicaciones de notas para explorar; no prescribe tocar todas esas posiciones como una única digitación.

Los textos en español y los miniestudios son originales de esta aplicación. Open Music Theory se ofrece como lectura adicional: el piloto no copia ni adapta textos, imágenes, partituras o ejercicios del libro. Las progresiones son material de práctica, sin atribuirlas a una canción determinada.

Este piloto incluye audio sintetizado para los ejercicios. No incluye catálogo de canciones, grabaciones de canciones, evaluación por micrófono ni análisis automático de la armonía de un archivo de audio. Tampoco modifica el XP ni el progreso de las lecciones.

## Recursos y decisiones de integración

| Recurso | Función y uso en este proyecto | Licencia y alcance verificado |
| --- | --- | --- |
| [Open Music Theory](https://viva.pressbooks.pub/openmusictheory/) | Libro y cuaderno de ejercicios. OMT2 es la edición de consulta para fundamentos, armonía y música popular; se enlaza como lectura adicional. El [repositorio original](https://github.com/openmusictheory/openmusictheory.github.io) conserva el sitio anterior. | OMT2 declara **CC BY-SA 4.0**, salvo indicación distinta. El [pie del sitio original](https://github.com/openmusictheory/openmusictheory.github.io/blob/master/_includes/footer.html) también declara CC BY-SA 4.0. Una futura adaptación deberá conservar la atribución y las condiciones aplicables; los materiales externos requieren su propia revisión. |
| [vpavlenko/study-music](https://github.com/vpavlenko/study-music) | Wiki de libros, cursos, herramientas y análisis. Se usa para investigación editorial y selección de actividades, especialmente su [sección de rock](https://github.com/vpavlenko/study-music/blob/main/parts/rock.md). | No se encontró una licencia explícita en el README ni un archivo de licencia del repositorio. Enlazar una referencia no implica permiso para copiar sus textos, partituras, audio o materiales de terceros. |
| [noteflakes/awesome-music](https://github.com/noteflakes/awesome-music) | Directorio de bibliotecas, programas, partituras y recursos educativos. Se usa para descubrir y comparar herramientas antes de seleccionar una integración concreta. | La colección declara [**CC0**](https://github.com/noteflakes/awesome-music#license). Cada proyecto y recurso enlazado mantiene sus propias condiciones. |
| [music21](https://github.com/cuthbertLab/music21) | Herramientas de Python para análisis musical y musicología computacional. Posible uso futuro fuera del navegador para preparar o revisar datos de ejercicios antes de publicarlos. No se ejecuta en este piloto. | Código y documentación propios bajo **BSD-3-Clause**. El [README](https://github.com/cuthbertLab/music21#license-coverage-and-otherprior-licenses) distingue las licencias de software externo y las partituras del corpus; la licencia del código no autoriza todo el corpus por igual. |
| [Tonal](https://github.com/tonaljs/tonal) | Biblioteca JavaScript de notas, intervalos, acordes, escalas y tonalidades. Es la dependencia musical del piloto en el navegador: calcula el material armónico y las notas de las tríadas. El sonido y la interfaz pertenecen a la aplicación. | **MIT**. Se conserva una copia local de la versión **6.4.3**, junto con sus avisos; véase [THIRD_PARTY.md](THIRD_PARTY.md). |
| [mingus](https://github.com/bspaans/python-mingus) | Paquete Python para crear y analizar música. No se integra: sus funciones se solapan con las elegidas para el laboratorio y requeriría un entorno Python adicional al sitio estático. | [**GPL-3.0**](https://github.com/bspaans/python-mingus/blob/master/LICENSE). Una futura incorporación de código requeriría evaluar sus condiciones de distribución. |
| [harmonimation](https://github.com/melodysium/harmonimation) | Genera visualizaciones de teoría desde transcripciones: círculos de notas, conexiones armónicas y representaciones rítmicas. Posible uso futuro para producir animaciones previamente renderizadas y publicarlas como recursos educativos. | [**MIT**](https://github.com/melodysium/harmonimation/blob/main/LICENSE). Su entorno requiere Python 3.13 o posterior, Manim y music21, con ajustes de instalación descritos por el proyecto. No es un componente listo para importar en esta web; su ejecución y las animaciones todavía no forman parte del piloto. |

## Lecturas de Open Music Theory

- [Triads](https://viva.pressbooks.pub/openmusictheory/chapter/triads/): notas de una tríada, cualidades y símbolos de acordes.
- [Roman Numerals](https://viva.pressbooks.pub/openmusictheory/chapter/roman-numerals/): relación entre la fundamental, el grado y la calidad del acorde; comparación entre tonalidades.
- [Introduction to Harmonic Schemas in Pop Music](https://viva.pressbooks.pub/openmusictheory/chapter/intro-to-pop-schemas/): patrones armónicos en el contexto de la música popular.

Estas lecturas amplían el contexto del piloto. La etiqueta de un grado describe su relación con una tonalidad; por sí sola no constituye un análisis completo de una canción.

## Dependencia local de Tonal

El navegador carga [js/vendor/tonal.js](../js/vendor/tonal.js) desde el propio sitio. No necesita descargar Tonal desde una CDN ni ejecutar una compilación para servir las páginas. El archivo de [licencia](../js/vendor/tonal.LICENSE.txt) se conserva junto al código.

Para regenerar la copia local después de instalar las dependencias de desarrollo:

```bash
npm ci
npm run vendor:tonal
npm run check:vendor
```

La generación usa versiones fijadas de Tonal y de la herramienta de empaquetado. El registro de procedencia y las instrucciones de mantenimiento están en [THIRD_PARTY.md](THIRD_PARTY.md).
