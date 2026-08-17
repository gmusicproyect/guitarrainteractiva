/**
 * GMUSIC PROFILE DEMO STATE CONTROLLER (v1.1)
 * Manages switching between New Visitor view and Registered Student view (fixtures).
 */

import { DEMO_PROGRESS_FIXTURE } from '../../data/demo-progress.js?v=2';

export class ProfileDemoUI {
  constructor() {
    this.btnStudent = document.getElementById('btnModeStudent');
    this.btnVisitor = document.getElementById('btnModeVisitor');
    this.heroContinueText = document.getElementById('heroContinueText');
    this.heroTitleText = document.getElementById('heroTitleText');
    this.heroSubtitleText = document.getElementById('heroSubtitleText');

    this.currentMode = document.body.classList.contains('mode-visitor') ? 'visitor' : 'student';
    this.init();
  }

  init() {
    if (this.btnStudent) {
      this.btnStudent.addEventListener('click', () => this.setMode('student'));
    }
    if (this.btnVisitor) {
      this.btnVisitor.addEventListener('click', () => this.setMode('visitor'));
    }
  }

  setMode(mode) {
    this.currentMode = mode;

    if (mode === 'student') {
      document.body.classList.remove('mode-visitor');
      document.body.classList.add('mode-student');
      this.btnStudent?.classList.add('active');
      this.btnVisitor?.classList.remove('active');
      this.btnStudent?.setAttribute('aria-pressed', 'true');
      this.btnVisitor?.setAttribute('aria-pressed', 'false');
      if (this.heroContinueText) {
        this.heroContinueText.textContent = 'Continuar con Am';
      }
      if (this.heroTitleText) this.heroTitleText.textContent = 'Hoy vas a dominar La menor.';
      if (this.heroSubtitleText) {
        this.heroSubtitleText.textContent = 'Una práctica guiada de 8 minutos para formar el acorde Am y cambiar desde Mi menor con más seguridad.';
      }
    } else {
      document.body.classList.remove('mode-student');
      document.body.classList.add('mode-visitor');
      this.btnVisitor?.classList.add('active');
      this.btnStudent?.classList.remove('active');
      this.btnVisitor?.setAttribute('aria-pressed', 'true');
      this.btnStudent?.setAttribute('aria-pressed', 'false');
      if (this.heroContinueText) {
        this.heroContinueText.textContent = 'Tocar la 6ª cuerda';
      }
      if (this.heroTitleText) this.heroTitleText.textContent = 'Aprende las cuerdas al aire.';
      if (this.heroSubtitleText) {
        this.heroSubtitleText.textContent = 'Tu primera misión es reconocer las seis cuerdas por su nombre, grosor y sonido.';
      }
    }

    document.dispatchEvent(new CustomEvent('gmusic:modechange', { detail: { mode } }));
  }
}
