/** The learning path is driven by published lessons and real local completions. */
import { DialogController } from './dialog-controller.js';

function escapeHTML(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

export class ModuleOnePathUI {
  constructor({ catalog, store, onStartFolder } = {}) {
    this.container = document.querySelector('#tu-camino .roadmap-timeline');
    this.course = catalog.course;
    this.module = catalog.module;
    this.folders = catalog.folders;
    this.store = store;
    this.onStartFolder = onStartFolder;
    this.modal = document.getElementById('moduleFolderModal');
    this.actionButton = document.getElementById('btnModuleFolderAction');
    this.activeFolder = null;
    this.dialog = this.modal ? new DialogController(this.modal, {
      initialFocus: '#btnCloseModuleFolderModal'
    }) : null;
    ['btnCloseModuleFolderModal', 'btnCloseModuleFolderFooter'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', () => this.closeModal());
    });
    this.actionButton?.addEventListener('click', () => this.handleFolderAction());
    this.store.subscribe(() => this.render());
    this.render();
  }

  getStatus(folder) { return this.store.getStatus(folder.id); }

  getStatusCopy(status, folder) {
    if (status === 'completed') return folder.kind === 'completion' ? 'Revisado' : 'Completada';
    if (status === 'current') return 'Tu siguiente paso';
    return 'Más adelante';
  }

  getUnlockTarget(folder) {
    const target = this.folders.find(item => item.slug === folder.unlocks.target || item.id === folder.unlocks.target);
    return target?.title || `${this.module.nextModule.title} · próximamente`;
  }

  buildFolderSections(folder) {
    const steps = folder.practice.sections || folder.practice.steps || [];
    return [
      { label: 'Descubre', purpose: folder.teaching.purpose, content: `<p>${escapeHTML(folder.teaching.card)}</p>` },
      { label: 'Practica', purpose: folder.practice.title, content: `<ul>${steps.map(step => `<li>${escapeHTML(step)}</li>`).join('')}</ul>` },
      { label: 'Si necesitas ayuda', purpose: 'Puedes intentarlo las veces que quieras.', content: '<p>Cada ejercicio te orienta para encontrar la respuesta. Equivocarse también es parte de aprender.</p>' },
      { label: 'Comprueba tu avance', purpose: 'Completa los ejercicios de esta práctica.', content: '<p>Tu avance se guarda al terminar. Puedes repetir una clase sin perder tu progreso.</p>' },
      { label: 'Después', purpose: this.getUnlockTarget(folder), content: '<p>Avanza a tu ritmo, un paso a la vez.</p>' }
    ];
  }

  renderCourseFlow() {
    const state = this.store.getSnapshot();
    return `<section class="course-flow-overview" aria-labelledby="courseFlowTitle">
      <div class="course-flow-heading"><div><span class="module-path-eyebrow">Tu recorrido musical</span>
        <h3 id="courseFlowTitle">Empieza por conocer tu guitarra</h3></div><strong>Módulo 1 disponible</strong></div>
      <div class="course-module-track">${this.course.modules.map(module => {
        const first = module.id === this.module.id;
        const status = first ? state.moduleComplete ? 'completed' : 'current' : 'locked';
        return `<article class="course-module-node is-${status}">
          <span class="course-module-number">${String(module.order).padStart(2, '0')}</span>
          <strong>${escapeHTML(module.title)}</strong><small>${escapeHTML(module.shortTitle)}</small>
          <span class="course-module-state">${first ? state.moduleComplete ? 'Completado' : 'Disponible' : 'Próximamente'}</span>
        </article>`;
      }).join('')}</div>
    </section>`;
  }

  render() {
    if (!this.container) return;
    const focusedFolder = document.activeElement?.dataset?.folderId;
    const state = this.store.getSnapshot();
    this.renderHeader(state);
    const path = this.folders.map(folder => {
      const status = this.getStatus(folder);
      const action = status === 'completed' ? 'Volver a practicar' : status === 'current' ? 'Ver mi siguiente paso' : 'Conocer la clase';
      return `<article class="folder-path-node is-${status}">
        <div class="folder-path-rail" aria-hidden="true"><span class="folder-path-marker">${status === 'completed' ? '✓' : String(folder.order).padStart(2, '0')}</span><span class="folder-path-line"></span></div>
        <button type="button" class="folder-path-card" data-folder-id="${escapeHTML(folder.id)}">
          <span class="folder-path-topline"><span class="folder-path-label">${escapeHTML(folder.kind === 'completion' ? 'Resumen' : folder.label)}</span>
            <span class="folder-path-status">${escapeHTML(this.getStatusCopy(status, folder))}</span></span>
          <strong class="folder-path-title">${escapeHTML(folder.title)}</strong>
          <span class="folder-path-purpose">${escapeHTML(folder.practice.title)}</span>
          <span class="folder-path-action">${action} <span aria-hidden="true">→</span></span>
        </button></article>`;
    }).join('');
    this.container.innerHTML = `${this.renderCourseFlow()}
      <div class="flow-diagram-intro"><div><span class="module-path-eyebrow">A tu ritmo</span>
        <h3>Cinco clases para empezar con confianza</h3><p>Cada práctica completada abre tu siguiente paso. Siempre puedes volver a repasar.</p></div>
        <div class="flow-diagram-legend" aria-label="Estados de las clases"><span><i class="legend-dot is-completed"></i>Completada</span><span><i class="legend-dot is-current"></i>Siguiente</span><span><i class="legend-dot is-locked"></i>Más adelante</span></div>
      </div><div class="skill-folder-path" aria-label="Clases del módulo 1">${path}</div>
      <article class="next-module-preview is-locked"><span class="next-module-number">Módulo 2</span>
        <div><h3>${escapeHTML(this.module.nextModule.title)}</h3><p>${escapeHTML(this.module.nextModule.preview)}</p></div>
        <span class="next-module-state">Próximamente · en preparación</span></article>`;
    this.container.querySelectorAll('[data-folder-id]').forEach(button => {
      button.addEventListener('click', () => this.openModal(this.folders.find(folder => folder.id === button.dataset.folderId)));
      if (button.dataset.folderId === focusedFolder) button.focus({ preventScroll: true });
    });
    if (this.activeFolder && this.dialog?.isOpen) this.updateAction();
  }

  renderHeader(state) {
    const text = (selector, value) => {
      const element = document.querySelector(`#tu-camino ${selector}`);
      if (element) element.textContent = value;
    };
    text('.section-badge-pill', 'GUITARRA 1 · TU RUTA');
    text('.section-main-heading', 'Cada pequeño paso cuenta.');
    text('.section-sub-heading', 'Conoce tu instrumento, reconoce sus cuerdas y empieza a tocar.');
    text('.prog-title', 'Clases del primer módulo');
    text('.prog-score', `${state.completedSkills} / ${state.totalSkills}`);
    const progressFill = document.querySelector('#tu-camino .global-prog-fill');
    if (progressFill) progressFill.style.width = `${state.percent}%`;
    const progressMeta = document.querySelector('#tu-camino .global-prog-meta');
    if (progressMeta) progressMeta.innerHTML = `<span>${state.percent}% completado</span><span>${state.xp} XP ganados</span>`;
  }

  openModal(folder) {
    if (!this.modal || !folder) return;
    this.activeFolder = folder;
    const text = (id, value) => { const element = document.getElementById(id); if (element) element.textContent = value; };
    text('moduleFolderBadge', folder.kind === 'completion' ? 'Resumen' : folder.label);
    text('moduleFolderTitle', folder.title);
    text('moduleFolderPurpose', folder.teaching.card);
    text('moduleFolderSkill', folder.practice.title);
    const sections = document.getElementById('moduleFolderSections');
    if (sections) sections.innerHTML = this.buildFolderSections(folder).map((section, index) => `<li class="module-folder-section">
      <div class="module-folder-section-rail" aria-hidden="true"><span>${String(index + 1).padStart(2, '0')}</span><i></i></div>
      <div class="module-folder-section-content"><span class="module-folder-detail-label">${escapeHTML(section.label)}</span>
        <strong>${escapeHTML(section.purpose)}</strong>${section.content}</div></li>`).join('');
    this.updateAction();
    this.dialog.open();
  }

  updateAction() {
    const status = this.getStatus(this.activeFolder);
    const label = document.getElementById('moduleFolderStatus');
    if (label) label.textContent = this.getStatusCopy(status, this.activeFolder);
    if (!this.actionButton) return;
    this.actionButton.disabled = status === 'locked';
    this.actionButton.textContent = status === 'completed' ? 'Repasar esta clase'
      : status === 'current' ? this.activeFolder.kind === 'completion' ? 'Ver mi resumen' : 'Empezar práctica'
        : 'Completa la clase anterior';
  }

  closeModal() { this.dialog?.close(); }

  handleFolderAction() {
    if (!this.activeFolder || this.getStatus(this.activeFolder) === 'locked') return;
    const folder = this.activeFolder;
    this.closeModal();
    this.onStartFolder?.(folder);
  }
}
