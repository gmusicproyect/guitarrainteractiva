/**
 * GMUSIC · ROADMAP CONTROLLER ("TU CAMINO EN GUITARRA")
 * Manages module interactions, review triggers, and pedagogical path progress.
 */

import { guitarAudio } from './audio.js';

export class RoadmapController {
  constructor() {
    this.container = document.getElementById('tu-camino');
    this.init();
  }

  init() {
    if (!this.container) return;

    // Review buttons on completed modules (Module 1 and Module 2)
    const reviewButtons = this.container.querySelectorAll('.btn-mod-review');
    reviewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modId = btn.dataset.module;
        this.handleReviewModule(modId);
      });
    });

    // Locked modules click hints
    const lockedModules = this.container.querySelectorAll('.locked-mod');
    lockedModules.forEach(card => {
      card.addEventListener('click', () => {
        // Little gentle wiggle feedback
        card.style.transform = 'scale(0.99)';
        setTimeout(() => { card.style.transform = ''; }, 150);
      });
    });
  }

  handleReviewModule(modId) {
    if (modId === '1') {
      // Play open strings review strum
      guitarAudio.strumChord([0, 0, 0, 0, 0, 0], true, 45);
      // Smooth scroll to hero guitar
      const heroGuitar = document.getElementById('heroGuitar');
      if (heroGuitar) {
        heroGuitar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (modId === '2') {
      // Play note sequence on fretboard
      guitarAudio.playString(1, 1, 1.2);
      setTimeout(() => guitarAudio.playString(2, 3, 1.2), 150);
      setTimeout(() => guitarAudio.playString(3, 2, 1.2), 300);
    }
  }
}
