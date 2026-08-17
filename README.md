# Guitarra Interactiva / Guitarra Uno

Herramienta de práctica de guitarra en una sola página HTML — sin backend, sin dependencias.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `guitarra-uno.html` | **Entrada principal** — Módulo 1 guiado (5 pasos) + laboratorio libre |
| `guitarra-interactiva.html` | Versión laboratorio (escalas, acordes CAGED, progresiones, cambios, reto) |

## Cómo usar

Abre `guitarra-uno.html` en el navegador (doble clic o servidor local):

```bash
python3 -m http.server 8765
# http://127.0.0.1:8765/guitarra-uno.html
```

### Modo guiado (Módulo 1)

- `?paso=1` … `?paso=5` — paso concreto del ejercicio
- `?modo=libre` — explorar sin guía

## Características

- Diapasón interactivo con síntesis de cuerda (Karplus–Strong)
- Escalas, acordes, sistema CAGED, progresiones, cambios con metrónomo
- Modo espejo con micrófono (opcional, solo feedback visual)
- Reto de notas y grados

Sonido sintetizado; el micrófono solo se usa si activas el modo espejo.
