import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioEngine } from '../js/engine/audio-engine.js';
import { PracticeViewUI } from '../js/ui/practice-view.js';
import { CHORDS } from '../js/music/chords.js';

function practiceSession() {
  return Object.assign(Object.create(PracticeViewUI.prototype), {
    activeMode: 'folder', folderPhase: 'practice', activeFolderId: 'g1-m1-anatomy', activeFolderData: { exercises: [{}, {}] },
    currentStepIndex: 0, stepSolved: false, sessionCompleted: false, completedSteps: new Set(),
    btnNext: {}, feedbackBox: { classList: { toggle() {} } }, feedbackText: {}, instructionText: { focus() {} },
    renderCurrentFolderStep() { this.stepSolved = false; }
  });
}

test('teaching opens before a lesson and cannot award progress or bypass the first answer', t => {
  const previousDocument = globalThis.document;
  const events = [];
  globalThis.document = { dispatchEvent: event => events.push(event) };
  t.after(() => { globalThis.document = previousDocument; });
  const session = practiceSession();
  const manifest = { id: 'g1-m1-anatomy', teaching: { card: 'Original teaching content' }, content: { parts: [] } };
  assert.equal(session.openFolder(manifest), true);
  assert.equal(session.activeFolderManifest, manifest);
  assert.equal(session.folderPhase, 'teaching');
  session.handleNextStep();
  assert.equal(session.folderPhase, 'practice');
  assert.equal(session.currentStepIndex, 0);
  assert.equal(session.completedSteps.size, 0);
  assert.equal(events.length, 0);
  session.handleNextStep();
  assert.equal(session.currentStepIndex, 0);
  assert.equal(events.length, 0);
  assert.equal(session.openFolder('g1-m1-completion'), true);
  assert.equal(session.folderPhase, 'summary');
});

test('practice cannot skip unanswered or incorrect steps', () => {
  const session = practiceSession();
  session.handleNextStep();
  assert.equal(session.currentStepIndex, 0);
  assert.equal(session.completedSteps.size, 0);
  session.setSolved(false, 'Try again');
  session.handleNextStep();
  assert.equal(session.currentStepIndex, 0);
  assert.equal(session.btnNext.disabled, true);
  session.setSolved(true, 'Correct');
  session.handleNextStep();
  assert.equal(session.currentStepIndex, 1);
  assert.equal(session.completedSteps.size, 1);
  session.handleNextStep();
  assert.equal(session.sessionCompleted, false);
});

test('only a complete folder emits progress, once, with the canonical folder id', t => {
  const previousDocument = globalThis.document;
  const events = [];
  globalThis.document = { dispatchEvent: event => events.push(event) };
  t.after(() => { globalThis.document = previousDocument; });
  const session = practiceSession();
  session.close = () => {};
  session.setSolved(true, 'Correct');
  session.handleNextStep();
  assert.equal(events.length, 0);
  session.setSolved(true, 'Correct');
  session.handleNextStep();
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'gmusic:foldercompleted');
  assert.deepEqual(events[0].detail, { folderId: 'g1-m1-anatomy' });
  session.handleNextStep();
  session.finishFolder();
  assert.equal(events.length, 1);
});

test('unassisted chord assessment rejects empty, partial, and extra positions', () => {
  const session = practiceSession();
  session.activeMode = 'chord';
  session.chordData = CHORDS['Am-open'];
  session.chordStages = [{ type: 'build' }];
  let advances = 0;
  session.setChordStep = () => { advances++; };
  for (const placement of [{}, { 1: { f: 1 } }, { 1: { f: 1 }, 2: { f: 2 }, 3: { f: 2 }, 4: { f: 3 } }]) {
    session.placedFingers = placement;
    session.handleNextStep();
    assert.equal(advances, 0);
  }
  session.placedFingers = { 1: { f: 1 }, 2: { f: 2 }, 3: { f: 2 } };
  session.handleNextStep();
  assert.equal(advances, 1);
});

class FakeAudioContext {
  constructor() { this.currentTime = 10; this.state = 'running'; this.sampleRate = 1000; this.destination = {}; this.oscillators = []; }
  node() {
    const parameter = { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} };
    return { gain: parameter, frequency: parameter, Q: parameter, connect() {}, disconnect() { this.disconnected = true; }, start(time) { this.startTime = time; }, stop() {} };
  }
  createGain() { return this.node(); }
  createBiquadFilter() { return this.node(); }
  createOscillator() { const node = this.node(); this.oscillators.push(node); return node; }
  createBufferSource() { return this.node(); }
  createBuffer(channels, size) { return { getChannelData: () => new Float32Array(size) }; }
  resume() { this.state = 'running'; return Promise.resolve(); }
}

function installAudio(t, Context = FakeAudioContext) {
  const previous = globalThis.AudioContext;
  globalThis.AudioContext = Context;
  t.after(() => { globalThis.AudioContext = previous; });
  return new AudioEngine();
}

test('audio schedules a chord on the audio clock and releases voices on stop', t => {
  const audio = installAudio(t);
  audio.strumChord([-1, 0, 2, 2, 1, 0], true, 35);
  assert.equal(audio.voices.size, 5);
  const fundamentals = audio.ctx.oscillators.filter((_, index) => index % 5 === 0);
  assert.equal(fundamentals.length, 5);
  assert.equal(fundamentals[0].startTime, 10.035);
  assert.equal(fundamentals[4].startTime, 10.175);
  audio.stopAll();
  assert.equal(audio.voices.size, 0);
  assert.ok(audio.ctx.oscillators.every(node => node.disconnected));
});

test('audio stays bounded, rejects invalid coordinates and stops existing sound when muted', t => {
  const audio = installAudio(t);
  assert.equal(audio.playNote(99, 0), false);
  assert.equal(audio.playNote(0, NaN), false);
  assert.equal(audio.ctx, null);
  for (let index = 0; index < 40; index++) audio.playNote(0, 0);
  assert.equal(audio.voices.size, 24);
  assert.equal(audio.toggleMute(), true);
  assert.equal(audio.voices.size, 0);
  assert.equal(audio.playNote(0, 0), false);
});

test('a rejected audio resume is handled and cancels queued voices', async t => {
  class BlockedContext extends FakeAudioContext {
    constructor() { super(); this.state = 'suspended'; }
    resume() { return Promise.reject(new Error('User gesture required')); }
  }
  const audio = installAudio(t, BlockedContext);
  audio.playNote(0, 0);
  await audio.pendingResume;
  assert.equal(audio.voices.size, 0);
  assert.equal(audio.pendingResume, null);
});

test('unsupported or unavailable audio does not prevent interaction', t => {
  class UnavailableContext { constructor() { throw new Error('Audio unavailable'); } }
  const audio = installAudio(t, UnavailableContext);
  assert.equal(audio.playNote(0, 0), false);
  assert.doesNotThrow(() => audio.strumChord([0, 0, 0, 0, 0, 0]));
});
