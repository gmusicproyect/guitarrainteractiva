import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LearnerProgressStore, PROGRESS_STORAGE_KEY, localDateKey } from '../js/state/learner-progress.js';
import { loadCourseCatalog } from '../js/state/course-catalog.js';

const root = new URL('../', import.meta.url);
const originalFetch = globalThis.fetch;
globalThis.fetch = async path => ({ ok: true, json: async () => JSON.parse(fs.readFileSync(new URL(path, root), 'utf8')) });
const catalog = await loadCourseCatalog();
globalThis.fetch = originalFetch;
const folders = catalog.folders;
const ids = folders.map(folder => folder.id);
const now = () => new Date(2026, 8, 26, 12);
const memoryStorage = (initial = null) => {
  let value = initial;
  return { getItem: key => key === PROGRESS_STORAGE_KEY ? value : null, setItem: (key, next) => { assert.equal(key, PROGRESS_STORAGE_KEY); value = next; } };
};
const create = (storage = memoryStorage(), clock = now) => new LearnerProgressStore({ folders, storage, now: clock });

const fresh = create();
assert.equal(fresh.getSnapshot().xp, 0, 'A new learner never inherits demo XP');
assert.equal(fresh.getSnapshot().completedSkills, 0);
assert.equal(fresh.getNextFolder().id, ids[0]);
assert.equal(fresh.getStatus(ids[1]), 'locked', 'The actual prerequisite controls lesson access');
assert.equal(fresh.recordCompletion(ids[2]).accepted, false, 'A locked lesson cannot grant progress');
assert.equal(fresh.recordCompletion('invented').accepted, false);
assert.equal(fresh.recordCompletion(undefined).accepted, false);
fresh.markOnboardingSeen();
assert.equal(fresh.getSnapshot().onboardingSeen, true);
assert.equal(fresh.getSnapshot().xp, 0, 'Dismissing the introduction never completes an exercise');
assert.equal(fresh.getNextFolder().id, ids[0]);

const storage = memoryStorage();
const store = create(storage);
let notifications = 0;
const unsubscribe = store.subscribe(() => notifications++);
assert.deepEqual(store.recordCompletion(ids[0]), { accepted: true, newlyCompleted: true, xpAwarded: 5 });
assert.equal(store.getNextFolder().id, ids[1]);
assert.equal(store.getSnapshot().completedSkills, 0, 'Orientation is not a completed skill');
assert.equal(store.recordCompletion(ids[0]).xpAwarded, 0, 'Duplicate completion is idempotent');
assert.equal(store.getSnapshot().xp, 5);
assert.equal(store.getSnapshot().practiceDays, 1);
assert.equal(notifications, 2);
unsubscribe();
store.recordCompletion(ids[1]);
assert.equal(notifications, 2, 'Subscriptions can be removed');
assert.equal(store.getSnapshot().percent, 20);
assert.equal(create(storage).getSnapshot().xp, 30, 'Completion survives reloading');
assert.equal(create(storage).getNextFolder().id, ids[2]);
for (const id of ids.slice(2)) assert.equal(store.recordCompletion(id).accepted, true);
assert.equal(store.getSnapshot().moduleComplete, true);
assert.equal(store.getSnapshot().percent, 100);
assert.equal(store.getSnapshot().completedSkills, 5);
assert.equal(store.getSnapshot().xp, 185, 'Five lessons earn 180 XP, orientation adds 5');
assert.equal(store.getNextFolder(), null);
for (const id of ids) store.recordCompletion(id);
assert.equal(store.getSnapshot().xp, 185, 'Reviewing the entire course never duplicates XP');

for (const raw of ['broken-json', 'null', '[]', '{}', '{"version":2,"xp":99999}', '{"version":1,"completed":"oops","practiceDates":12}']) {
  assert.equal(create(memoryStorage(raw)).getSnapshot().xp, 0, `Malformed/versioned storage is safe: ${raw}`);
}
const tampered = create(memoryStorage(JSON.stringify({
  version: 1, xp: 100000, completed: {
    [ids[0]]: 'not-a-date', [ids[1]]: now().toISOString(),
    [ids[2]]: '2099-01-01T12:00:00Z', unknown: now().toISOString()
  }, practiceDates: ['2026-02-30', '2099-01-01', 'invalid']
})));
assert.equal(tampered.getSnapshot().xp, 0, 'Invalid dates, invented rewards and unmet prerequisites are discarded');
assert.equal(tampered.getSnapshot().streak, 0);

const throwingStorage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); } };
const ephemeral = create(throwingStorage);
assert.equal(ephemeral.getSnapshot().storageAvailable, false);
ephemeral.recordCompletion(ids[0]);
ephemeral.recordCompletion(ids[1]);
assert.equal(ephemeral.getSnapshot().xp, 30, 'Blocked storage keeps working in memory');
const quota = create({ getItem: () => null, setItem() { throw new Error('full'); } });
quota.recordCompletion(ids[0]);
assert.equal(quota.getSnapshot().xp, 5);
assert.equal(quota.getSnapshot().storageAvailable, false, 'The UI can disclose failed persistence');
const noStorage = create(null);
noStorage.recordCompletion(ids[0]);
assert.equal(noStorage.getSnapshot().xp, 5);
assert.equal(noStorage.getSnapshot().storageAvailable, false);

const streakStorage = memoryStorage();
let currentDate = new Date(2026, 8, 25, 23, 45);
const daily = create(streakStorage, () => currentDate);
daily.recordCompletion(ids[0]);
assert.equal(daily.getSnapshot().streak, 1);
currentDate = new Date(2026, 8, 26, 0, 15);
assert.equal(daily.getSnapshot().streak, 1, 'Yesterday keeps a streak alive before practice today');
daily.recordCompletion(ids[0]);
assert.equal(daily.getSnapshot().streak, 2, 'A reviewed lesson counts as daily practice');
assert.equal(daily.getSnapshot().xp, 5);
currentDate = new Date(2026, 8, 28, 10);
assert.equal(daily.getSnapshot().streak, 0, 'A missed day resets the visible streak');
assert.equal(localDateKey(new Date(2026, 0, 2, 0, 5)), '2026-01-02', 'Practice uses the learner’s local date');

const sharedStorage = memoryStorage();
const firstTab = create(sharedStorage);
const secondTab = create(sharedStorage);
firstTab.recordCompletion(ids[0]);
secondTab.recordCompletion(ids[1]);
firstTab.refresh();
assert.equal(firstTab.getSnapshot().xp, 30, 'Progress from another tab is merged before a write');
assert.equal(secondTab.getSnapshot().completedSkills, 1);

const escaped = store.getSnapshot();
escaped.completedIds.length = 0;
assert.equal(store.getSnapshot().completedSkills, 5, 'Returned counters cannot mutate stored progress');

console.log('Learner progress: storage, prerequisites, rewards, local dates, recovery and cross-tab assertions passed');
