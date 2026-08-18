# GMusic · Guitarra interactiva

Experiencia web para aprender guitarra mediante recorridos guiados, ejercicios interactivos y síntesis de audio en el navegador.

## Probar la aplicación

### GitHub Pages

**https://gmusicproyect.github.io/guitarrainteractiva/**

### En local

```bash
python3 -m http.server 3000
```

Abre `http://localhost:3000/`.

## Recorrido principal

1. Elige guitarra como instrumento.
2. Conoce el espacio de práctica interactivo.
3. Revisa la primera ruta de aprendizaje.
4. Recorre los cinco módulos de Guitarra 1.
5. Comienza el Módulo 1 con anatomía, clavijero, cuerdas, cejuela y primeras pulsaciones.

La interfaz separa el contenido en tres vistas para evitar una página extensa:

- **Inicio:** misión y ejercicio actual.
- **Ruta:** módulos ordenados del curso.
- **Habilidades:** progreso y acceso a la guitarra libre.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `index.html` | Aplicación y recorrido de bienvenida |
| `css/` | Sistema visual, guitarra, módulos y modales |
| `js/` | Interfaz, audio, ejercicios y motores musicales |
| `data/` | Curso y progreso de demostración |
| `test/contract_tests.js` | Contratos del motor musical |
| `test/modulo1_instrumento_tests.js` | 17 verificaciones del Módulo 1 |

## Versiones anteriores

Las demostraciones originales se conservan en:

- `guitarra-uno.html`: módulo guiado anterior.
- `guitarra-interactiva.html`: laboratorio anterior de escalas, acordes y retos.

## Verificación

```bash
node test/contract_tests.js
node test/module1_structure_tests.js
node test/modulo1_instrumento_tests.js
```

La aplicación no requiere backend ni proceso de compilación.
