/**
 * GMUSIC · MASTER MANIFEST: MÓDULO 1 (CONOCE TU GUITARRA · EL INSTRUMENTO)
 * 5 Clases de Fundamentos del Instrumento + Certificación + Puente al Módulo 2
 */

import { ONBOARDING_DATA } from './00-onboarding/intro.js';
import { CLASE_1_ANATOMIA } from './01-anatomia-guitarra/clase1.js';
import { CLASE_2_CLAVIJERO } from './02-clavijero-y-afinacion/clase2.js';
import { CLASE_3_CUERDAS } from './03-las-seis-cuerdas/clase3.js';
import { CLASE_4_CEJUELA_TRASTES } from './04-cejuela-y-trastes/clase4.js';
import { CLASE_5_PULSACIONES } from './05-primeras-pulsaciones/clase5.js';
import { MODULO_1_COMPLETION } from './06-desbloqueo-modulo-2/completion.js';

export const MODULO_1_INSTRUMENTO_COURSE = {
  id: 'guitarra-1-modulo-1',
  moduloNumero: 1,
  title: 'Módulo 1: Conoce tu guitarra (El Instrumento)',
  description: 'Descubre la anatomía del instrumento, cómo funciona el clavijero, las 6 cuerdas y sus calibres, la cejuela y tus primeras pulsaciones.',
  onboarding: ONBOARDING_DATA,
  clases: [
    CLASE_1_ANATOMIA,
    CLASE_2_CLAVIJERO,
    CLASE_3_CUERDAS,
    CLASE_4_CEJUELA_TRASTES,
    CLASE_5_PULSACIONES
  ],
  completion: MODULO_1_COMPLETION
};

export {
  ONBOARDING_DATA,
  CLASE_1_ANATOMIA,
  CLASE_2_CLAVIJERO,
  CLASE_3_CUERDAS,
  CLASE_4_CEJUELA_TRASTES,
  CLASE_5_PULSACIONES,
  MODULO_1_COMPLETION
};
