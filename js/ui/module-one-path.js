/**
 * Renders Module 1 from its folder manifests.
 * The path is data-driven so curriculum structure and product UI stay aligned.
 */

const MODULE_BASE = 'data/courses/guitar1/module1';
const COURSE_MANIFEST = 'data/courses/guitar1/course.json';

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
      const [courseResponse, moduleResponse] = await Promise.all([
        fetch(COURSE_MANIFEST),
        fetch(`${MODULE_BASE}/module.json`)
      ]);
      if (!courseResponse.ok) throw new Error('No se pudo cargar el manifiesto del curso');
      if (!moduleResponse.ok) throw new Error('No se pudo cargar el manifiesto del módulo');
      this.course = await courseResponse.json();
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
    return String(folder.order).padStart(2, '0');
  }

  getUnlockTarget(folder) {
    const targetId = folder.unlocks.target;
    const targetFolder = this.folders.find((item, index) => (
      this.module.folders[index] === targetId || item.id === targetId
    ));

    return targetFolder?.title || this.module.nextModule.title;
  }

  buildFolderSections(folder) {
    const practiceSteps = folder.practice.sections || folder.practice.steps || [];
    const practiceContent = practiceSteps.length
      ? `<ul>${practiceSteps.map(step => `<li>${escapeHTML(step)}</li>`).join('')}</ul>`
      : `<p>${escapeHTML(folder.practice.title)}</p>`;

    return [
      {
        label: 'Enseñanza',
        purpose: folder.teaching.purpose,
        content: `<p>${escapeHTML(folder.teaching.card)}</p>`
      },
      {
        label: 'Práctica',
        purpose: folder.practice.purpose,
        content: practiceContent
      },
      {
        label: 'Apoyo',
        purpose: folder.remediation.purpose,
        content: `<p>${escapeHTML(folder.remediation.message)}</p>`
      },
      {
        label: 'Evaluación',
        purpose: folder.assessment.purpose,
        content: `<p>${escapeHTML(folder.assessment.exitCriteria)}</p>`
      },
      {
        label: 'Desbloqueo',
        purpose: folder.unlocks.purpose,
        content: `<p>Abre: <strong>${escapeHTML(this.getUnlockTarget(folder))}</strong></p>`
      }
    ];
  }

  renderCourseFlow() {
    const modules = this.course.modules.map(module => {
      const isFirst = module.id === this.module.id;
      const isSecond = module.order === 2;
      const state = isFirst
        ? this.mode === 'student' ? 'completed' : 'current'
        : isSecond && this.mode === 'student'
          ? 'current'
          : 'locked';
      const stateCopy = state === 'completed' ? 'Completado' : state === 'current' ? 'En curso' : 'Posterior';

      return `
        <article class="course-module-node is-${state}">
          <span class="course-module-number">${String(module.order).padStart(2, '0')}</span>
          <strong>${escapeHTML(module.title)}</strong>
          <small>${escapeHTML(module.shortTitle)}</small>
          <span class="course-module-state">${stateCopy}</span>
        </article>
      `;
    }).join('');

    return `
      <section class="course-flow-overview" aria-labelledby="courseFlowTitle">
        <div class="course-flow-heading">
          <div>
            <span class="module-path-eyebrow">Mapa de Guitarra 1</span>
            <h3 id="courseFlowTitle">Cinco módulos, una progresión clara</h3>
          </div>
          <strong>${this.course.modules.length} módulos</strong>
        </div>
        <div class="course-module-track">${modules}</div>
      </section>
    `;
  }

  render() {
    if (!this.module || !this.folders) return;

    const completedSkills = this.mode === 'student' ? this.module.certifiedSkills.length : 0;
    const progress = Math.round((completedSkills / this.module.certifiedSkills.length) * 100);
    this.renderHeader(completedSkills, progress);

    const pathMarkup = this.folders.map(folder => {
      const status = this.getStatus(folder);
      const kindClass = folder.kind === 'capstone' ? ' is-capstone' : '';
      const actionCopy = status === 'current' ? 'Abrir carpeta' : 'Ver flujo interno';

      return `
        <article class="folder-path-node is-${status}${kindClass}">
          <div class="folder-path-rail" aria-hidden="true">
            <span class="folder-path-marker">${escapeHTML(this.getMarker(status, folder))}</span>
            <span class="folder-path-line"></span>
          </div>
          <button type="button" class="folder-path-card" data-folder-id="${escapeHTML(folder.id)}">
            <span class="folder-path-topline">
              <span class="folder-path-label">${escapeHTML(folder.label)}</span>
              <span class="folder-path-status">${escapeHTML(this.getStatusCopy(status, folder))}</span>
            </span>
            <strong class="folder-path-title">${escapeHTML(folder.title)}</strong>
            <span class="folder-path-purpose-label">Propósito</span>
            <span class="folder-path-purpose">${escapeHTML(folder.purpose)}</span>
            <span class="folder-path-action">${actionCopy} →</span>
          </button>
        </article>
      `;
    }).join('');

    const nextStatus = this.mode === 'student' ? 'current' : 'locked';
    this.container.innerHTML = `
      ${this.renderCourseFlow()}
      <div class="flow-diagram-intro">
        <div>
          <span class="module-path-eyebrow">Diagrama de flujo prioritario</span>
          <h3>Módulo 1 · Conoce tu guitarra</h3>
          <p>Selecciona cualquier carpeta para ver el propósito de cada sección, incluso si todavía está bloqueada.</p>
        </div>
        <div class="flow-diagram-legend" aria-label="Estados del diagrama">
          <span><i class="legend-dot is-completed"></i>Completada</span>
          <span><i class="legend-dot is-current"></i>En curso</span>
          <span><i class="legend-dot is-locked"></i>Posterior</span>
        </div>
      </div>
      <figure class="skill-folder-path" aria-label="Flujo de carpetas del Módulo 1">
        ${pathMarkup}
      </figure>
      <article class="next-module-preview is-${nextStatus}">
        <span class="next-module-number">Módulo 2</span>
        <div>
          <h3>${escapeHTML(this.module.nextModule.title)}</h3>
          <p>${escapeHTML(this.module.nextModule.preview)}</p>
        </div>
        <span class="next-module-state">${nextStatus === 'current' ? 'Disponible' : escapeHTML(this.module.nextModule.unlockRequirement)}</span>
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

    if (badge) badge.textContent = 'GUITARRA 1 · 5 MÓDULOS';
    if (heading) heading.textContent = 'Módulo 1 · Conoce tu guitarra';
    if (subheading) subheading.textContent = this.module.purpose;
    if (progressTitle) progressTitle.textContent = 'Habilidades del instrumento';
    if (progressScore) progressScore.textContent = `${completedSkills} / ${this.module.certifiedSkills.length}`;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressMeta) {
      progressMeta.innerHTML = `<span>${progress}% del módulo</span><span>${this.module.totalXp} XP</span>`;
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
    document.getElementById('moduleFolderSections').innerHTML = this.buildFolderSections(folder)
      .map((section, index) => `
        <li class="module-folder-section">
          <div class="module-folder-section-rail" aria-hidden="true">
            <span>${String(index + 1).padStart(2, '0')}</span>
            <i></i>
          </div>
          <div class="module-folder-section-content">
            <span class="module-folder-detail-label">${escapeHTML(section.label)}</span>
            <strong>${escapeHTML(section.purpose)}</strong>
            ${section.content}
          </div>
        </li>
      `).join('');

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
