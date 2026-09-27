import test from "node:test";
import assert from "node:assert/strict";
import { HarmonyLabUI } from "../js/ui/harmony-lab.js";
import { KEYS, PROGRESSIONS, buildProgression } from "../js/music/harmony.js";

function session(t) {
  const previous = new Map(
    ["document", "requestAnimationFrame", "cancelAnimationFrame"].map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  t.after(() => {
    previous.forEach((descriptor, key) => {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    });
  });
  const frames = new Map();
  let nextFrame = 0;
  globalThis.requestAnimationFrame = (callback) => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  };
  globalThis.cancelAnimationFrame = (id) => frames.delete(id);
  const noteStatus = {};
  globalThis.document = {
    getElementById: (id) => (id === "harmonyNoteStatus" ? noteStatus : null),
  };
  const ctx = { state: "running", currentTime: 10 };
  const calls = [];
  const engine = {
    isMuted: false,
    pendingResume: null,
    voices: [],
    stopCalls: 0,
    ensureContext: () => ctx,
    playNote(string, fret, duration, velocity, delay = 0) {
      const note = {
        string,
        fret,
        duration,
        velocity,
        onset: ctx.currentTime + delay,
      };
      calls.push(note);
      this.voices.push(note);
      return true;
    },
    stopAll() {
      this.stopCalls++;
      this.voices = [];
    },
  };
  const study = buildProgression("C", "pop");
  const classList = { toggle() {}, remove() {} };
  const lab = Object.assign(Object.create(HarmonyLabUI.prototype), {
    root: { hidden: false, querySelectorAll: () => [] },
    engine,
    study,
    runId: 0,
    frame: null,
    playing: false,
    selected: 0,
    tempo: 80,
    playButton: {
      setAttribute(name, value) {
        this[name] = value;
      },
    },
    chordList: { children: study.chords.map(() => ({ classList })) },
    status: {},
    selectChord(index) {
      this.selected = index;
    },
  });
  return { lab, engine, ctx, calls, frames, noteStatus };
}

test("leaving the lab cancels an isolated note, while an idle lab leaves other instruments alone", (t) => {
  const { lab, engine } = session(t);
  engine.voices.push({ fromAnotherInstrument: true });
  lab.stop();
  assert.equal(
    engine.voices.length,
    1,
    "An unused lab must not own another instrument’s audio.",
  );
  engine.voices = [];
  lab.playPosition(5, 3, "Sol");
  assert.equal(engine.voices.length, 1);
  assert.equal(
    lab.playing,
    false,
    "A single note does not start progression playback.",
  );
  lab.stop();
  assert.equal(
    engine.voices.length,
    0,
    "Navigation, visibility and selection changes must cancel isolated notes too.",
  );
});

test("stop during a suspended audio resume prevents delayed playback from starting", async (t) => {
  const { lab, engine, ctx, calls, frames } = session(t);
  let resume;
  ctx.state = "suspended";
  engine.pendingResume = new Promise((resolve) => {
    resume = resolve;
  });
  const playback = lab.playSequence(lab.study.chords);
  lab.stop();
  ctx.state = "running";
  resume();
  await playback;
  assert.equal(calls.length, 0);
  assert.equal(frames.size, 0);
  assert.equal(lab.playing, false);
  assert.equal(lab.playButton["aria-pressed"], "false");
});

test("a rapid restart while audio resumes schedules only the latest request", async (t) => {
  const { lab, engine, ctx, calls, frames } = session(t);
  let resume;
  ctx.state = "suspended";
  engine.pendingResume = new Promise((resolve) => {
    resume = resolve;
  });
  const first = lab.playSequence(lab.study.chords);
  const last = lab.playSequence([lab.study.chords[2]], { arpeggio: true });
  ctx.state = "running";
  resume();
  await Promise.all([first, last]);
  assert.equal(calls.length, 3);
  assert.equal(lab.selected, 2);
  assert.equal(frames.size, 1);
  lab.stop();
  assert.equal(engine.voices.length, 0);
  assert.equal(frames.size, 0);
});

test("progression and arpeggio timing use the audio clock and release all scheduled notes on stop", async (t) => {
  const { lab, engine, ctx, calls, frames } = session(t);
  lab.tempo = 120;
  await lab.playSequence(lab.study.chords);
  assert.equal(calls.length, 12);
  assert.ok(calls.every((note) => note.onset > 10 && note.duration > 0));
  for (let chord = 1; chord < 4; chord++) {
    assert.ok(
      Math.abs(calls[chord * 3].onset - calls[(chord - 1) * 3].onset - 2) <
        1e-8,
      "Four beats at 120 BPM last two seconds.",
    );
  }
  const staleFrame = [...frames.values()][0];
  lab.stop();
  assert.equal(engine.voices.length, 0);
  assert.equal(frames.size, 0);
  ctx.currentTime = 20;
  staleFrame();
  assert.equal(
    frames.size,
    0,
    "A queued frame cannot restart an interrupted run.",
  );
  calls.length = 0;
  await lab.playSequence([lab.study.chords[0]], { arpeggio: true });
  assert.equal(calls.length, 3);
  assert.ok(Math.abs(calls[1].onset - calls[0].onset - 0.5) < 1e-8);
  assert.ok(Math.abs(calls[2].onset - calls[1].onset - 0.5) < 1e-8);
});

test("unavailable, muted or still-suspended audio produces feedback without scheduling notes", async (t) => {
  const { lab, engine, ctx, calls } = session(t);
  engine.isMuted = true;
  await lab.playSequence(lab.study.chords);
  assert.match(lab.status.textContent, /Activa el sonido/);
  engine.isMuted = false;
  ctx.state = "suspended";
  await lab.playSequence(lab.study.chords);
  assert.match(lab.status.textContent, /No se pudo activar/);
  assert.equal(lab.playing, false);
  engine.ensureContext = () => null;
  await lab.playSequence(lab.study.chords);
  assert.match(lab.status.textContent, /no está disponible/);
  assert.equal(calls.length, 0);
});

test("every supported audio voicing sounds the displayed triad in ascending root position", () => {
  const tuning = [64, 59, 55, 50, 45, 40];
  const lab = Object.create(HarmonyLabUI.prototype);
  for (const key of KEYS) {
    for (const progression of PROGRESSIONS) {
      for (const chord of buildProgression(key.tonic, progression.id).chords) {
        const positions = lab.voicing(chord);
        assert.equal(positions.length, 3);
        for (const position of positions) {
          assert.ok(
            Number.isInteger(position.string) &&
              position.string >= 0 &&
              position.string < 6,
          );
          assert.ok(
            Number.isInteger(position.fret) &&
              position.fret >= 0 &&
              position.fret <= 24,
          );
        }
        const pitches = positions.map(
          (position) => tuning[position.string] + position.fret,
        );
        assert.deepEqual(
          pitches.map((pitch) => pitch % 12),
          chord.pitchClasses,
        );
        assert.deepEqual(
          pitches.map((pitch) => pitch - pitches[0]),
          [0, chord.quality === "minor" ? 3 : 4, 7],
        );
      }
    }
  }
});
