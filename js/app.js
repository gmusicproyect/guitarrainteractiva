/** Application composition: navigation, first-visit guidance, and earned local progress. */
import { audioEngine } from './engine/audio-engine.js';
import { HeroGuitarUI } from './ui/hero-guitar.js';
import { PracticeViewUI } from './ui/practice-view.js';
import { FreeGuitarUI } from './ui/free-guitar.js';
import { ProfileDemoUI } from './ui/profile-demo.js';
import { ModuleOnePathUI } from './ui/module-one-path.js';
import { DialogController } from './ui/dialog-controller.js';
import { LearnerProgressStore, PROGRESS_STORAGE_KEY } from './state/learner-progress.js';
import { loadCourseCatalog } from './state/course-catalog.js';

function initApp() {
  const practice = new PracticeViewUI();
  const freeGuitar = new FreeGuitarUI();
  let store = null;
  let modulePath = null;
  let loading = false;
  const pendingCompletions = [];
  const viewSections = [...document.querySelectorAll('[data-app-view]')];
  const viewLinks = [...document.querySelectorAll('[data-nav-view]')];
  const hashByView = { home: '#inicio', route: '#ruta', progress: '#habilidades' };
  const viewByHash = Object.fromEntries(Object.entries(hashByView).map(([view, hash]) => [hash, view]));
  const titleByView = { home: 'Inicio', route: 'Mi ruta', progress: 'Mi progreso' };

  function setView(requested, { history = 'push', focus = true } = {}) {
    const view = Object.hasOwn(hashByView, requested) ? requested : 'home';
    viewSections.forEach(section => { section.hidden = section.dataset.appView !== view; });
    viewLinks.forEach(link => {
      const active = link.dataset.navView === view;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (history !== 'none' && window.location.hash !== hashByView[view]) {
      window.history[history === 'replace' ? 'replaceState' : 'pushState']({ view }, '', hashByView[view]);
    }
    document.title = `${titleByView[view]} · GMusic`;
    if (focus) {
      const heading = viewSections.find(section => !section.hidden)?.querySelector('h1, h2');
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  viewLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    setView(link.dataset.navView);
  }));
  document.getElementById('logoLink')?.addEventListener('click', event => {
    event.preventDefault();
    setView('home');
  });
  document.querySelector('a[href="#mainContent"]')?.addEventListener('click', event => {
    event.preventDefault();
    document.getElementById('mainContent')?.focus();
  });
  setView(viewByHash[window.location.hash] || 'home', { history: 'replace', focus: false });

  const onboarding = document.getElementById('onboardingFlow');
  const steps = [...document.querySelectorAll('[data-onboarding-step]')];
  const nextButton = document.getElementById('onboardingNext');
  const backButton = document.getElementById('onboardingBack');
  let step = 1;
  const onboardingDialog = onboarding ? new DialogController(onboarding, {
    initialFocus: '#onboardingNext',
    onClose: () => store?.markOnboardingSeen()
  }) : null;

  function renderOnboarding({ focus = false } = {}) {
    steps.forEach(element => { element.hidden = Number(element.dataset.onboardingStep) !== step; });
    const stepLabel = document.getElementById('onboardingStepLabel');
    const fill = document.getElementById('onboardingProgressBar');
    if (stepLabel) stepLabel.textContent = `Paso ${step} de ${steps.length}`;
    if (fill) fill.style.width = `${step / steps.length * 100}%`;
    if (backButton) { backButton.hidden = false; backButton.disabled = step === 1; }
    if (nextButton) nextButton.textContent = step === steps.length ? 'Empezar a practicar' : 'Continuar';
    const heading = steps.find(element => !element.hidden)?.querySelector('h1, h2, h3');
    if (heading && onboarding) {
      if (!heading.id) heading.id = `onboardingTitle${step}`;
      onboarding.setAttribute('aria-labelledby', heading.id);
    }
    if (focus) {
      if (heading) { heading.tabIndex = -1; heading.focus(); }
    }
  }
  function openOnboarding() {
    if (!steps.length) return;
    step = 1;
    renderOnboarding();
    onboardingDialog?.open();
  }
  nextButton?.addEventListener('click', () => {
    if (step < steps.length) { step++; renderOnboarding({ focus: true }); }
    else { onboardingDialog?.close(); continueLearning(); }
  });
  backButton?.addEventListener('click', () => {
    if (step > 1) { step--; renderOnboarding({ focus: true }); }
  });
  document.getElementById('onboardingStudentLogin')?.addEventListener('click', () => onboardingDialog?.close());
  document.getElementById('btnShowOnboarding')?.addEventListener('click', openOnboarding);

  function followLocation() {
    const view = viewByHash[window.location.hash];
    if (!view && window.location.hash) return;
    practice.close();
    freeGuitar.close();
    modulePath?.closeModal();
    onboardingDialog?.close();
    setView(view || 'home', { history: 'none' });
  }
  window.addEventListener('popstate', followLocation);
  window.addEventListener('hashchange', followLocation);

  function startFolder(folder) {
    if (store && folder && store.getStatus(folder.id) !== 'locked') practice.open(folder);
  }
  function continueLearning() {
    if (!store) { void initializeCourse(); return; }
    const next = store.getNextFolder();
    if (next) startFolder(next);
    else setView('route');
  }
  ['btnHeroContinue', 'btnStartTodaySession'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', continueLearning);
  });
  ['btnHeroExplore', 'navFreeGuitar', 'btnOpenFreeGuitar'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => freeGuitar.open());
  });

  const audioButton = document.getElementById('audioToggleBtn');
  function updateAudioButton() {
    const muted = audioEngine.isMuted;
    audioButton?.classList.toggle('muted', muted);
    audioButton?.setAttribute('aria-pressed', String(muted));
    audioButton?.setAttribute('aria-label', muted ? 'Activar sonido de guitarra' : 'Silenciar sonido de guitarra');
    const icon = document.getElementById('audioIcon');
    if (icon) icon.innerHTML = `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4 6 8H3v8h3l5 4Z"/><path d="${muted ? 'm16 9 6 6m0-6-6 6' : 'M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14'}"/></svg>`;
    const text = audioButton?.querySelector('.audio-text');
    if (text) text.textContent = muted ? 'Sin sonido' : 'Sonido activo';
  }
  audioButton?.addEventListener('click', () => {
    audioEngine.toggleMute();
    updateAudioButton();
    if (!audioEngine.isMuted) audioEngine.playNote(0, 0, 1.2, 0.6);
  });
  updateAudioButton();

  document.addEventListener('gmusic:foldercompleted', event => {
    const folderId = event.detail?.folderId;
    if (store) store.recordCompletion(folderId);
    else if (typeof folderId === 'string') pendingCompletions.push(folderId);
  });
  // Register the completion listener before the first interactive lesson becomes usable.
  new HeroGuitarUI();
  window.addEventListener('storage', event => {
    if (event.key === PROGRESS_STORAGE_KEY) store?.refresh();
  });
  window.addEventListener('pageshow', event => { if (event.persisted) store?.refresh(); });

  async function initializeCourse() {
    if (loading || store) return;
    loading = true;
    const continueButton = document.getElementById('btnHeroContinue');
    if (continueButton) continueButton.disabled = true;
    try {
      const catalog = await loadCourseCatalog();
      store = new LearnerProgressStore({ folders: catalog.folders });
      new ProfileDemoUI({ store, onStartFolder: startFolder });
      modulePath = new ModuleOnePathUI({ catalog, store, onStartFolder: startFolder });
      pendingCompletions.splice(0).forEach(id => store.recordCompletion(id));
      if (!store.getSnapshot().onboardingSeen) openOnboarding();
    } catch (error) {
      console.error('No se pudo cargar el curso:', error);
      document.querySelectorAll('[data-progress-status]').forEach(element => {
        element.textContent = 'No se pudo cargar el curso. Comprueba tu conexión y vuelve a intentarlo.';
      });
      const continueText = document.getElementById('heroContinueText');
      if (continueText) continueText.textContent = 'Reintentar carga';
      const container = document.querySelector('#tu-camino .roadmap-timeline');
      if (container) {
        container.replaceChildren();
        const message = document.createElement('p');
        message.className = 'module-path-error';
        message.setAttribute('role', 'status');
        message.textContent = 'No pudimos cargar tus clases. Comprueba tu conexión.';
        const retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'btn btn-primary';
        retry.textContent = 'Volver a intentar';
        retry.addEventListener('click', () => { void initializeCourse(); });
        container.append(message, retry);
      }
    } finally {
      loading = false;
      if (continueButton) continueButton.disabled = false;
    }
  }
  void initializeCourse();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp, { once: true });
else initApp();
