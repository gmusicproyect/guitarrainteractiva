/** Browser-local learner progress. Rewards are derived from the curriculum, never saved counters. */
export const PROGRESS_STORAGE_KEY = 'gmusic.learner-progress.v1';
const VERSION = 1;
const DAY_MS = 86400000;

function browserStorage() {
  try { return globalThis.localStorage || null; } catch { return null; }
}

export function localDateKey(date) {
  const pad = value => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(`${value}T12:00:00Z`))
    && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
}

function dayNumber(value) { return Date.parse(`${value}T12:00:00Z`) / DAY_MS; }

export class LearnerProgressStore {
  constructor({ folders, storage = browserStorage(), now = () => new Date() }) {
    this.folders = [...folders].sort((a, b) => a.order - b.order);
    this.storage = storage;
    this.now = now;
    this.listeners = new Set();
    this.storageAvailable = Boolean(storage);
    this.state = this.read();
  }

  empty() { return { version: VERSION, onboardingSeen: false, completed: {}, practiceDates: [] }; }

  normalize(raw) {
    const clean = this.empty();
    if (!raw || raw.version !== VERSION || typeof raw !== 'object') return clean;
    clean.onboardingSeen = raw.onboardingSeen === true;
    const records = raw.completed && typeof raw.completed === 'object' ? raw.completed : {};
    for (const folder of this.folders) {
      const timestamp = records[folder.id];
      if (typeof timestamp === 'string' && Number.isFinite(Date.parse(timestamp))
        && Date.parse(timestamp) <= this.now().getTime()
        && this.prerequisitesMet(folder, clean.completed)) {
        clean.completed[folder.id] = new Date(timestamp).toISOString();
      }
    }
    const today = localDateKey(this.now());
    clean.practiceDates = Array.isArray(raw.practiceDates)
      ? [...new Set(raw.practiceDates.filter(date => validDate(date) && date <= today))].sort().slice(-366)
      : [];
    return clean;
  }

  read() {
    if (!this.storage) return this.empty();
    try {
      const raw = this.storage.getItem(PROGRESS_STORAGE_KEY);
      try { return this.normalize(raw ? JSON.parse(raw) : null); } catch { return this.empty(); }
    } catch {
      this.storageAvailable = false;
      return this.empty();
    }
  }

  prerequisitesMet(folder, completed = this.state.completed) {
    return (folder.prerequisites || []).every(id => {
      const prerequisite = this.folders.find(item => item.id === id || item.skill?.id === id);
      return prerequisite && Object.hasOwn(completed, prerequisite.id);
    });
  }

  isCompleted(id) { return Object.hasOwn(this.state.completed, id); }

  getStatus(id) {
    const folder = this.folders.find(item => item.id === id);
    if (!folder) return 'locked';
    if (this.isCompleted(id)) return 'completed';
    return this.prerequisitesMet(folder) ? 'current' : 'locked';
  }

  getNextFolder() {
    return this.folders.find(folder => this.getStatus(folder.id) === 'current') || null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const snapshot = this.getSnapshot();
    this.listeners.forEach(listener => listener(snapshot));
  }

  // Read before writes so another tab's completed lessons survive this tab's next action.
  mergeStoredProgress() {
    if (!this.storageAvailable) return;
    const stored = this.read();
    this.state = this.normalize({
      version: VERSION,
      onboardingSeen: this.state.onboardingSeen || stored.onboardingSeen,
      completed: { ...stored.completed, ...this.state.completed },
      practiceDates: [...stored.practiceDates, ...this.state.practiceDates]
    });
  }

  persist() {
    if (this.storage) {
      try {
        this.storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(this.state));
        this.storageAvailable = true;
      } catch { this.storageAvailable = false; }
    }
    this.notify();
  }

  refresh() {
    this.mergeStoredProgress();
    this.notify();
  }

  markOnboardingSeen() {
    this.mergeStoredProgress();
    this.state.onboardingSeen = true;
    this.persist();
  }

  recordCompletion(id) {
    this.mergeStoredProgress();
    const folder = this.folders.find(item => item.id === id);
    if (!folder || !this.prerequisitesMet(folder)) return { accepted: false, xpAwarded: 0 };
    const newlyCompleted = !this.isCompleted(id);
    if (newlyCompleted) this.state.completed[id] = this.now().toISOString();
    // A repeated lesson is real practice, but its XP is awarded only on the first completion.
    if (folder.kind !== 'completion') {
      this.state.practiceDates = [...new Set([...this.state.practiceDates, localDateKey(this.now())])].sort().slice(-366);
    }
    this.persist();
    return { accepted: true, newlyCompleted, xpAwarded: newlyCompleted ? folder.xp || 0 : 0 };
  }

  getSnapshot() {
    const skills = this.folders.filter(folder => folder.kind === 'skill');
    const completedSkills = skills.filter(folder => this.isCompleted(folder.id)).length;
    const today = dayNumber(localDateKey(this.now()));
    const practicedDays = new Set(this.state.practiceDates.map(dayNumber));
    let cursor = practicedDays.has(today) ? today : today - 1;
    let streak = 0;
    while (practicedDays.has(cursor)) { streak++; cursor--; }
    return {
      onboardingSeen: this.state.onboardingSeen,
      completedIds: Object.keys(this.state.completed),
      completedSkills,
      totalSkills: skills.length,
      percent: skills.length ? Math.round(completedSkills / skills.length * 100) : 0,
      xp: this.folders.reduce((total, folder) => total + (this.isCompleted(folder.id) ? folder.xp || 0 : 0), 0),
      streak,
      practicedToday: practicedDays.has(today),
      practiceDays: this.state.practiceDates.length,
      nextFolder: this.getNextFolder(),
      moduleComplete: skills.length > 0 && completedSkills === skills.length,
      storageAvailable: this.storageAvailable
    };
  }
}
