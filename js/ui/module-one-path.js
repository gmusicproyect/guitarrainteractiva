/**
 * Renders Module 1 from its folder manifests.
 * The path is data-driven so curriculum structure and product UI stay aligned.
 */

const MODULE_BASE = 'data/courses/guitar1/module1';

function escapeHTML(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export class ModuleOnePathUI {
  constructor({ onNavigateHome } = {}) {
    this.container = document.querySelector('#tu-camino .roadmap-timeline');
    this.onNavigateHome = onNavigateHome || null;
    this.mode = document.body.classList.contains('mode-student') ? 'student' : 'visitor';

    this.modal = document.getElementById('moduleFolderModal');
    this.closeButtons = [
      document.getElementById('btnCloseModuleFolderModal'),
      document.getElementById('btnCloseModuleFolderFooter')
    ].filter(Boolean);
    this.actionButton = document.getElementById('btnModuleFolderAction');
    this.activeFolder = null;

    this.init();
  }

  async init() {
    if (!this.container) return;

    try {
      const moduleResponse = await fetch(`${MODULE_BASE}/module.json`);
      if (!moduleResponse.ok) throw new Error('No se pudo cargar el manifiesto del módulo');
      this.module = await moduleResponse.json();

      this.folders = await Promise.all(this.module.folders.map(async folderName => {
        const response = await fetch(`${MODULE_BASE}/${folderName}/manifest.json`);
        if (!response.ok) throw new Error(`No se pudo cargar ${folderName}`);
        return response.json();
      }));

      this.bindModal();
      this.render();

      document.addEventListener('gmusic:modechange', event => {
        this.mode = event.detail.mode;
        this.render();
      });
    } catch (error) {
      console.error(error);
      this.container.innerHTML = `
        <div class="module-path-error" role="status">
          No pudimos cargar la ruta del Módulo 1. Recarga la página para intentarlo otra vez.
        </div>
      `;
    }
  }

  bindModal() {
    this.closeButtons.forEach(button => button.addEventListener('click', () => this.closeModal()));
    this.modal?.addEventListener('click', event => {
      if (event.target === this.modal) this.closeModal();
    });
    this.actionButton?.addEventListener('click', () => this.handleFolderAction());
  }

  getStatus(folder) {
    if (this.mode === 'student') return 'completed';
    if (folder.order === 0) return 'completed';
    if (folder.order === 1) return 'current';
    return 'locked';
  }

  getStatusCopy(status, folder) {
    if (status === 'completed') return folder.kind === 'completion' ? 'Completado' : 'Listo para repasar';
    if (status === 'current') return 'Tu siguiente paso';
    return 'Bloqueado';
  }

  getMarker(status, folder) {
    if (status === 'completed') return '✓';
    if (status === 'current') return folder.order;
    return '·';
  }

  render() {
    if (!this.module || !this.folders) return;

    const completedSkills = this.mode === 'student' ? this.module.certifiedSkills.length : 0;
    const progress = Math.round((completedSkills / this.module.certifiedSkills.length) * 100);
    this.renderHeader(completedSkills, progress);

    const pathMarkup = this.folders.map(folder => {
      const status = this.getStatus(folder);
      const isLocked = status === 'locked';
      const skillLine = folder.skill
        ? escapeHTML(folder.skill.statement)
        : folder.kind === 'capstone'
          ? 'Integra las cuatro habilidades del módulo.'
          : escapeHTML(folder.practice.title);
      const kindClass = folder.kind === 'capstone' ? ' is-capstone' : '';

      return `
        <article class="folder-path-node is-${status}${kindClass}">
          <div class="folder-path-rail" aria-hidden="true">
            <span class="folder-path-marker">${escapeHTML(this.getMarker(status, folder))}</span>
            <span class="folder-path-line"></span>
          </div>
          <button type="button" class="folder-path-card" data-folder-id="${escapeHTML(folder.id)}" ${isLocked ? 'disabled' : ''}>
            <span class="folder-path-topline">
              <span class="folder-path-label">${escapeHTML(folder.label)}</span>
              <span class="folder-path-status">${escapeHTML(this.getStatusCopy(status, folder))}</span>
            </span>
            <strong class="folder-path-title">${escapeHTML(folder.title)}</strong>
            <span class="folder-path-purpose">${escapeHTML(folder.purpose)}</span>
            <span class="folder-path-skill">${skillLine}</span>
            ${status === 'current' ? '<span class="folder-path-action">Abrir habilidad →</span>' : ''}
          </button>
        </article>
      `;
    }).join('');

    const nextStatus = this.mode === 'student' ? 'current' : 'locked';
    this.container.innerHTML = `
      <div class="module-path-summary">
        <div>
          <span class="module-path-eyebrow">Módulo 1</span>
          <h3>${escapeHTML(this.module.title)}</h3>
          <p>${escapeHTML(this.module.purpose)}</p>
        </div>
        <div class="module-path-count">
          <strong>4</strong>
          <span>habilidades</span>
          <small>+ 1 reto musical</small>
        </div>
      </div>
      <div class="skill-folder-path">${pathMarkup}</div>
      <article class="next-module-preview is-${nextStatus}">
        <span class="next-module-number">Módulo 2</span>
        <div>
          <h3>${escapeHTML(this.module.nextModule.title)}</h3>
          <p>${escapeHTML(this.module.nextModule.preview)}</p>
        </div>
        <span class="next-module-state">${nextStatus === 'current' ? 'Disponible' : 'Completa el riff para desbloquear'}</span>
      </article>
    `;

    this.container.querySelectorAll('[data-folder-id]').forEach(button => {
      button.addEventListener('click', () => {
        const folder = this.folders.find(item => item.id === button.dataset.folderId);
        if (folder) this.openModal(folder, this.getStatus(folder));
      });
    });
  }

  renderHeader(completedSkills, progress) {
    const badge = document.querySelector('#tu-camino .section-badge-pill');
    const heading = document.querySelector('#tu-camino .section-main-heading');
    const subheading = document.querySelector('#tu-camino .section-sub-heading');
    const progressTitle = document.querySelector('#tu-camino .prog-title');
    const progressScore = document.querySelector('#tu-camino .prog-score');
    const progressFill = document.querySelector('#tu-camino .global-prog-fill');
    const progressMeta = document.querySelector('#tu-camino .global-prog-meta');

    if (badge) badge.textContent = 'GUITARRA 1 · MÓDULO 1';
    if (heading) heading.textContent = 'Tu guitarra y tus primeras notas';
    if (subheading) subheading.textContent = 'Avanza por cuatro habilidades y termina tocando tu primer riff.';
    if (progressTitle) progressTitle.textContent = 'Habilidades certificadas';
    if (progressScore) progressScore.textContent = `${completedSkills} / 4`;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressMeta) {
      progressMeta.innerHTML = `<span>${progress}% del módulo</span><span>1 reto final</span>`;
    }
  }

  openModal(folder, status) {
    if (!this.modal) return;
    this.activeFolder = { folder, status };

    document.getElementById('moduleFolderBadge').textContent = folder.label;
    document.getElementById('moduleFolderStatus').textContent = this.getStatusCopy(status, folder);
    document.getElementById('moduleFolderTitle').textContent = folder.title;
    document.getElementById('moduleFolderPurpose').textContent = folder.purpose;
    document.getElementById('moduleFolderSkill').textContent = folder.skill
      ? folder.skill.statement
      : folder.kind === 'capstone'
        ? 'Integra las cuatro habilidades del módulo en una interpretación completa.'
        : folder.practice.title;
    document.getElementById('moduleFolderTeaching').textContent = folder.teaching.card;
    const practiceSteps = folder.practice.sections || folder.practice.steps || [];
    document.getElementById('moduleFolderPractice').innerHTML = practiceSteps.length
      ? practiceSteps.map(section => `<li>${escapeHTML(section)}</li>`).join('')
      : `<li>${escapeHTML(folder.practice.title)}</li>`;
    document.getElementById('moduleFolderRemediation').textContent = folder.remediation.message;
    document.getElementById('moduleFolderAssessment').textContent = folder.assessment.exitCriteria;

    if (this.actionButton) {
      this.actionButton.disabled = status === 'locked';
      this.actionButton.textContent = status === 'completed'
        ? 'Repasar esta etapa'
        : status === 'current'
          ? 'Empezar habilidad'
          : 'Etapa bloqueada';
    }

    this.modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.hidden = true;
    document.body.style.overflow = '';
  }

  handleFolderAction() {
    if (!this.activeFolder || this.activeFolder.status === 'locked') return;
    const { folder } = this.activeFolder;
    this.closeModal();

    if (this.onNavigateHome) this.onNavigateHome();
    window.setTimeout(() => {
      const guitar = document.getElementById('heroGuitar');
      guitar?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (folder.order <= 1) guitar?.querySelector('[data-s="5"]')?.focus({ preventScroll: true });
    }, 250);
  }
}
