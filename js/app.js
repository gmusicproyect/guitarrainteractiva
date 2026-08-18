/**
 * GMUSIC MAIN APPLICATION BOOTSTRAP (v1.1)
 * Initializes all core engines, data pipelines, and UI controllers.
 */

import { audioEngine } from './engine/audio-engine.js';
import { HeroGuitarUI } from './ui/hero-guitar.js?v=5';
import { PracticeViewUI } from './ui/practice-view.js?v=5';
import { FreeGuitarUI } from './ui/free-guitar.js?v=3';
import { ProfileDemoUI } from './ui/profile-demo.js?v=6';
import { ModuleOnePathUI } from './ui/module-one-path.js?v=6';

function initApp() {
  // 1. Initialize UI Controllers
  const heroGuitar = new HeroGuitarUI();
  const practiceView = new PracticeViewUI();
  const freeGuitar = new FreeGuitarUI();
  const profileDemo = new ProfileDemoUI();

  // 2. Keep each area of the product in its own view.
  const appViewSections = Array.from(document.querySelectorAll('[data-app-view]'));
  const viewNavLinks = Array.from(document.querySelectorAll('[data-nav-view]'));

  const setAppView = (view) => {
    appViewSections.forEach(section => {
      section.hidden = section.dataset.appView !== view;
    });

    viewNavLinks.forEach(link => {
      const isActive = link.dataset.navView === view;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    const hashByView = { home: '#inicio', route: '#ruta', progress: '#habilidades' };
    window.history.replaceState(null, '', hashByView[view] || '#inicio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  viewNavLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      setAppView(link.dataset.navView);
    });
  });

  document.getElementById('logoLink')?.addEventListener('click', (event) => {
    event.preventDefault();
    setAppView('home');
  });

  const viewByHash = { '#inicio': 'home', '#ruta': 'route', '#habilidades': 'progress' };
  setAppView(viewByHash[window.location.hash] || 'home');

  // Connected Module One Path with explicit folder practice dispatch
  const moduleOnePath = new ModuleOnePathUI({
    onNavigateHome: () => setAppView('home'),
    onStartFolder: (folder) => {
      practiceView.open(folder);
    }
  });

  // 3. Guide first-time visitors before showing the course interface.
  const onboardingFlow = document.getElementById('onboardingFlow');
  const onboardingStepLabel = document.getElementById('onboardingStepLabel');
  const onboardingProgressBar = document.getElementById('onboardingProgressBar');
  const onboardingBack = document.getElementById('onboardingBack');
  const onboardingNext = document.getElementById('onboardingNext');
  const onboardingStudentLogin = document.getElementById('onboardingStudentLogin');
  const onboardingSteps = Array.from(document.querySelectorAll('[data-onboarding-step]'));
  let onboardingStep = 1;

  const renderOnboardingStep = () => {
    onboardingSteps.forEach(stepEl => {
      const stepNumber = Number(stepEl.dataset.onboardingStep);
      stepEl.hidden = stepNumber !== onboardingStep;
    });

    if (onboardingStepLabel) onboardingStepLabel.textContent = `Paso ${onboardingStep} de 3`;
    if (onboardingProgressBar) onboardingProgressBar.style.width = `${(onboardingStep / 3) * 100}%`;
    if (onboardingBack) onboardingBack.disabled = onboardingStep === 1;

    if (onboardingNext) {
      if (onboardingStep === 1) onboardingNext.textContent = 'Continuar';
      else if (onboardingStep === 2) onboardingNext.textContent = 'Ver mi ruta';
      else onboardingNext.textContent = 'Empezar primera misión';
    }
  };

  const openOnboarding = () => {
    if (!onboardingFlow) return;
    onboardingStep = 1;
    renderOnboardingStep();
    onboardingFlow.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeOnboarding = ({ focusGuitar = false } = {}) => {
    if (!onboardingFlow) return;
    onboardingFlow.hidden = true;
    document.body.style.overflow = '';

    if (focusGuitar) {
      setAppView('home');
      window.setTimeout(() => {
        const guitar = document.getElementById('heroGuitar');
        guitar?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        guitar?.querySelector('[data-s="5"]')?.focus({ preventScroll: true });
      }, 250);
    }
  };

  onboardingNext?.addEventListener('click', () => {
    if (onboardingStep < 3) {
      onboardingStep += 1;
      renderOnboardingStep();
      return;
    }
    closeOnboarding({ focusGuitar: true });
  });

  onboardingBack?.addEventListener('click', () => {
    if (onboardingStep > 1) {
      onboardingStep -= 1;
      renderOnboardingStep();
    }
  });

  onboardingStudentLogin?.addEventListener('click', () => {
    profileDemo.setMode('student');
    closeOnboarding();
  });

  document.getElementById('btnModeVisitor')?.addEventListener('click', openOnboarding);
  document.getElementById('btnModeStudent')?.addEventListener('click', () => closeOnboarding());

  renderOnboardingStep();
  document.body.style.overflow = 'hidden';

  // 4. Setup Audio Engine Controls
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      const isMuted = audioEngine.toggleMute();
      if (isMuted) {
        audioToggleBtn.classList.add('muted');
        if (audioIcon) audioIcon.textContent = '🔇';
        audioToggleBtn.querySelector('.audio-text').textContent = 'Silenciado';
      } else {
        audioToggleBtn.classList.remove('muted');
        if (audioIcon) audioIcon.textContent = '🔊';
        audioToggleBtn.querySelector('.audio-text').textContent = 'Audio ON';
        // Play soft confirmation pluck
        audioEngine.playNote(0, 0, 1.2, 0.6);
      }
    });
  }

  // 5. Connect Main CTA Buttons
  const btnHeroContinue = document.getElementById('btnHeroContinue');
  const btnHeroExplore = document.getElementById('btnHeroExplore');
  const btnContinueAm = document.getElementById('btnContinueAm');
  const btnStartTodaySession = document.getElementById('btnStartTodaySession');
  const navFreeGuitar = document.getElementById('navFreeGuitar');
  const btnOpenFreeGuitar = document.getElementById('btnOpenFreeGuitar');

  if (btnHeroContinue) {
    btnHeroContinue.addEventListener('click', () => {
      if (document.body.classList.contains('mode-visitor')) {
        document.getElementById('heroGuitar')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.querySelector('#heroGuitar [data-s="5"]')?.focus({ preventScroll: true });
      } else {
        practiceView.open('03-cuerdas');
      }
    });
  }

  if (btnContinueAm) {
    btnContinueAm.addEventListener('click', () => {
      practiceView.open('03-cuerdas');
    });
  }

  if (btnStartTodaySession) {
    btnStartTodaySession.addEventListener('click', () => {
      practiceView.open('03-cuerdas');
    });
  }

  if (btnHeroExplore) {
    btnHeroExplore.addEventListener('click', () => {
      freeGuitar.open();
    });
  }

  if (navFreeGuitar) {
    navFreeGuitar.addEventListener('click', () => {
      freeGuitar.open();
    });
  }

  if (btnOpenFreeGuitar) {
    btnOpenFreeGuitar.addEventListener('click', () => {
      freeGuitar.open();
    });
  }

  // 6. Safe AudioContext user-gesture resume (Avoids browser autoplay block)
  const initAudioGesture = () => {
    audioEngine.ensureContext();
    window.removeEventListener('click', initAudioGesture);
    window.removeEventListener('keydown', initAudioGesture);
    window.removeEventListener('touchstart', initAudioGesture);
  };

  window.addEventListener('click', initAudioGesture, { once: true });
  window.addEventListener('keydown', initAudioGesture, { once: true });
  window.addEventListener('touchstart', initAudioGesture, { once: true });
}

// Bootstrap once DOM content is fully parsed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
