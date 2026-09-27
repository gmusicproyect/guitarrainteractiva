/** Renders only progress earned on this device. The class name is kept for existing imports. */
export class ProfileDemoUI {
  constructor({ store, onStartFolder } = {}) {
    this.store = store;
    this.onStartFolder = onStartFolder;
    document.body.classList.remove('mode-visitor');
    document.body.classList.add('mode-student');
    this.unsubscribe = store.subscribe(() => this.render());
    this.render();
  }

  setText(selector, value) {
    document.querySelectorAll(selector).forEach(element => { element.textContent = value; });
  }

  render() {
    const state = this.store.getSnapshot();
    const next = state.nextFolder;
    const continueLabel = next
      ? next.kind === 'orientation' ? 'Empezar mi primera práctica'
        : next.kind === 'completion' ? 'Ver mi resumen' : 'Continuar mi aprendizaje'
      : 'Repasar el módulo';

    this.setText('#heroTitleText', next?.title || 'Ya conoces tu guitarra.');
    this.setText('#heroSubtitleText', next?.teaching.card || 'Has completado las cinco prácticas del instrumento. Vuelve a tus clases cuando quieras reforzar lo aprendido.');
    this.setText('#heroContinueText, [data-continue-label]', continueLabel);
    this.setText('[data-current-lesson]', next?.title || 'Módulo 1 completado');
    this.setText('[data-current-description]', next?.practice.title || 'Repasa las cinco clases a tu ritmo.');
    this.setText('[data-current-duration]', next ? next.kind === 'orientation' ? '1 ejercicio' : `${next.practice.exercises?.length || next.practice.sequence?.length || 5} pasos` : 'A tu ritmo');
    this.setText('[data-progress-xp]', state.xp);
    this.setText('[data-progress-skills], [data-progress-lessons]', state.completedSkills);
    this.setText('[data-progress-percent]', `${state.percent}%`);
    this.setText('[data-progress-streak]', state.streak);
    this.setText('[data-progress-days]', state.practiceDays);
    this.setText('[data-progress-status]', state.storageAvailable
      ? 'Tu avance se guarda en este navegador.'
      : 'Avance disponible durante esta sesión. Este navegador no permite guardarlo.');
    document.querySelectorAll('[data-progress-fill]').forEach(element => { element.style.width = `${state.percent}%`; });
    document.querySelectorAll('[data-progress-ring]').forEach(element => {
      element.style.setProperty('--progress', `${state.percent}%`);
      element.setAttribute('role', 'progressbar');
      element.setAttribute('aria-label', 'Clases del módulo 1 completadas');
      element.setAttribute('aria-valuemin', '0');
      element.setAttribute('aria-valuemax', '100');
      element.setAttribute('aria-valuenow', String(state.percent));
      element.setAttribute('aria-valuetext', `${state.completedSkills} de ${state.totalSkills} clases completadas`);
    });
    document.querySelectorAll('[data-progress-bar]').forEach(element => {
      element.setAttribute('aria-valuenow', String(state.percent));
      element.setAttribute('aria-valuetext', `${state.completedSkills} de ${state.totalSkills} clases completadas`);
    });
    this.renderSkills();
  }

  renderSkills() {
    const container = document.getElementById('progressSkillsList');
    if (!container) return;
    container.replaceChildren();
    for (const folder of this.store.folders.filter(item => item.kind === 'skill')) {
      const status = this.store.getStatus(folder.id);
      const card = document.createElement('article');
      card.className = `progress-skill-card is-${status}`;
      const marker = document.createElement('span');
      marker.className = 'progress-skill-marker';
      marker.setAttribute('aria-hidden', 'true');
      marker.textContent = status === 'completed' ? '✓' : String(folder.order).padStart(2, '0');
      const content = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = folder.title;
      const description = document.createElement('p');
      description.textContent = folder.practice.title;
      const badge = document.createElement('span');
      badge.className = 'progress-skill-status';
      badge.textContent = status === 'completed' ? 'Práctica completada' : status === 'current' ? 'Lista para empezar' : 'Aún por descubrir';
      content.append(title, description, badge);
      const action = document.createElement('button');
      action.type = 'button';
      action.id = `progress-practice-${folder.id}`;
      action.className = 'btn btn-secondary';
      action.textContent = status === 'completed' ? 'Repasar' : 'Practicar';
      action.disabled = status === 'locked';
      action.setAttribute('aria-label', `${action.textContent}: ${folder.title}`);
      action.addEventListener('click', () => this.onStartFolder?.(folder));
      card.append(marker, content, action);
      container.append(card);
    }
  }
}
