/**
 * GMUSIC ROADMAP UI CONTROLLER (v1.1)
 * Renders the vertical pedagogical timeline from canonical GUITAR_1_COURSE data.
 */

import { GUITAR_1_COURSE } from '../../data/courses/guitar1.js?v=2';
import { audioEngine } from '../engine/audio-engine.js';

export class RoadmapUI {
  constructor(options = {}) {
    this.container = document.getElementById('tu-camino');
    this.onContinueChord = options.onContinueChord || null;
    this.init();
  }

  init() {
    if (!this.container) return;

    // Review buttons for completed modules
    const reviewButtons = this.container.querySelectorAll('.btn-mod-review');
    reviewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modId = btn.dataset.module;
        if (modId === '1') {
          audioEngine.strumChord([0, 0, 0, 0, 0, 0], true, 40);
          document.getElementById('heroGuitar')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (modId === '2') {
          audioEngine.playNote(1, 1, 1.2);
          setTimeout(() => audioEngine.playNote(2, 3, 1.2), 150);
          setTimeout(() => audioEngine.playNote(3, 2, 1.2), 300);
        }
      });
    });

    // Continue CTA on active module 3
    const btnRoadmapContinueAm = document.getElementById('btnRoadmapContinueAm');
    if (btnRoadmapContinueAm && this.onContinueChord) {
      btnRoadmapContinueAm.addEventListener('click', () => {
        this.onContinueChord('Am-open');
      });
    }

    // Locked modules tactile feedback
    const lockedNodes = this.container.querySelectorAll('.locked-mod');
    lockedNodes.forEach(node => {
      node.addEventListener('click', () => {
        node.style.transform = 'scale(0.99)';
        setTimeout(() => { node.style.transform = ''; }, 120);
      });
    });
  }
}
