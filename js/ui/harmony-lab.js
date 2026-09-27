import { audioEngine } from "../engine/audio-engine.js";
import {
  KEYS,
  PROGRESSIONS,
  buildProgression,
  getFretboard,
  noteLabel,
} from "../music/harmony.js";

const TUNING = [64, 59, 55, 50, 45, 40];
const ROLES = ["Fundamental", "Tercera", "Quinta"];

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

/** One original musical study, with the same theory driving sound and the note map. */
export class HarmonyLabUI {
  constructor({ engine = audioEngine } = {}) {
    this.root = document.getElementById("harmonyLab");
    if (!this.root) return;
    this.engine = engine;
    this.runId = 0;
    this.frame = null;
    this.playing = false;
    this.hasAudio = false;
    this.selected = 0;
    this.tempo = 80;
    this.keySelect = document.getElementById("harmonyKey");
    this.progressionSelect = document.getElementById("harmonyProgression");
    this.chordList = document.getElementById("harmonyChords");
    this.board = document.getElementById("harmonyFretboard");
    this.playButton = document.getElementById("harmonyPlay");
    this.status = document.getElementById("harmonyPlayback");
    KEYS.forEach((key) => this.keySelect.add(new Option(key.label, key.tonic)));
    PROGRESSIONS.forEach((progression) =>
      this.progressionSelect.add(new Option(progression.name, progression.id)),
    );
    this.keySelect.addEventListener("change", () => this.renderStudy());
    this.progressionSelect.addEventListener("change", () => this.renderStudy());
    document
      .getElementById("harmonyTempo")
      .addEventListener("input", (event) => {
        this.stop();
        this.tempo = Number(event.target.value);
        document.getElementById("harmonyTempoValue").value = this.tempo;
      });
    this.playButton.addEventListener("click", () => {
      if (this.playing) this.stop();
      else void this.playSequence(this.study.chords);
    });
    document.getElementById("harmonyArpeggio").addEventListener("click", () => {
      void this.playSequence([this.study.chords[this.selected]], {
        arpeggio: true,
      });
    });
    document.getElementById("harmonyResolve").addEventListener("click", () => {
      const cadence = buildProgression(this.keySelect.value, "cadence");
      void this.playSequence(
        cadence.chords.filter((chord) => [5, 1].includes(chord.degree)),
      );
    });
    this.board.addEventListener("keydown", (event) =>
      this.moveOnFretboard(event),
    );
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.stop();
    });
    window.addEventListener("pagehide", () => this.stop());
    this.renderStudy();
  }

  renderStudy() {
    this.stop();
    this.study = buildProgression(
      this.keySelect.value,
      this.progressionSelect.value,
    );
    this.selected = 0;
    this.chordList.replaceChildren();
    this.chordList.dataset.count = this.study.chords.length;
    this.study.chords.forEach((chord, index) => {
      const button = element("button", undefined, "harmony-chord");
      button.type = "button";
      button.setAttribute(
        "aria-label",
        `${chord.roman}: ${chord.spanishName}, ${chord.functionLabel}. Explorar acorde`,
      );
      const name = element("span", chord.spanishName, "harmony-chord-name");
      name.append(element("span", chord.symbol, "harmony-chord-symbol"));
      button.append(
        element("span", chord.roman, "harmony-roman"),
        name,
        element("span", chord.functionLabel, "harmony-function"),
      );
      button.addEventListener("click", () => {
        this.stop();
        this.selectChord(index);
        void this.playSequence([chord]);
      });
      this.chordList.append(button);
    });
    document.getElementById("harmonyScale").textContent = this.study.scale
      .map(noteLabel)
      .join(" · ");
    this.selectChord(0);
    this.renderChallenge();
  }

  selectChord(index) {
    const active = document.activeElement;
    const fretFocus =
      this.board.contains(active) && active.matches("button[data-string]")
        ? { string: active.dataset.string, fret: active.dataset.fret }
        : null;
    const noteFocus = document.getElementById("harmonyNotes").contains(active)
      ? active.dataset.noteIndex
      : null;
    this.selected = index;
    const chord = this.study.chords[index];
    [...this.chordList.children].forEach((button, i) =>
      button.setAttribute("aria-pressed", String(i === index)),
    );
    document.getElementById("harmonyChordTitle").textContent =
      `${chord.spanishName} · ${chord.symbol}`;
    document.getElementById("harmonyExplanation").textContent =
      chord.explanation;
    document.getElementById("harmonyConstruction").textContent =
      `Tríada ${chord.quality === "minor" ? "menor: fundamental, tercera menor y quinta justa." : "mayor: fundamental, tercera mayor y quinta justa."}`;
    document.getElementById("harmonyNoteStatus").textContent =
      `Explora las notas de ${chord.spanishName}.`;
    const notes = document.getElementById("harmonyNotes");
    notes.replaceChildren();
    const positions = this.voicing(chord);
    chord.notes.forEach((note, i) => {
      const button = element("button");
      button.type = "button";
      button.dataset.noteIndex = i;
      button.append(
        element("strong", noteLabel(note)),
        element("small", ROLES[i]),
      );
      button.setAttribute(
        "aria-label",
        `Escuchar ${noteLabel(note)}, ${ROLES[i].toLowerCase()}`,
      );
      button.addEventListener("click", () => {
        this.stop();
        const { string, fret } = positions[i];
        this.playPosition(
          string,
          fret,
          `${noteLabel(note)} · ${ROLES[i].toLowerCase()}`,
        );
      });
      notes.append(button);
    });
    this.renderFretboard(chord);
    if (fretFocus)
      this.board
        .querySelector(
          `[data-string="${fretFocus.string}"][data-fret="${fretFocus.fret}"]`,
        )
        ?.focus({ preventScroll: true });
    else if (noteFocus !== null)
      notes
        .querySelector(`[data-note-index="${noteFocus}"]`)
        ?.focus({ preventScroll: true });
  }

  renderFretboard(chord) {
    this.board.replaceChildren();
    getFretboard(chord).forEach((row) => {
      const string = element("div", undefined, "harmony-string");
      string.append(element("span", row.label, "harmony-string-label"));
      row.cells.forEach((cell) => {
        const button = element(
          "button",
          undefined,
          `harmony-fret${cell.inChord ? " is-chord" : ""}${cell.intervalLabel === "Fundamental" ? " is-root" : ""}`,
        );
        button.type = "button";
        button.tabIndex = row.string === 0 && cell.fret === 0 ? 0 : -1;
        button.dataset.string = row.string;
        button.dataset.fret = cell.fret;
        const description = `${noteLabel(cell.note)}, cuerda ${row.string + 1}, ${cell.fret ? `traste ${cell.fret}` : "al aire"}, ${cell.intervalLabel ? cell.intervalLabel.toLowerCase() : "fuera del acorde"}`;
        button.setAttribute("aria-label", description);
        button.append(element("span", noteLabel(cell.note)));
        button.addEventListener("focus", () => {
          this.board.querySelectorAll("button").forEach((other) => {
            other.tabIndex = other === button ? 0 : -1;
          });
        });
        button.addEventListener("click", () => {
          this.stop();
          this.playPosition(row.string, cell.fret, description);
        });
        string.append(button);
      });
      this.board.append(string);
    });
  }

  moveOnFretboard(event) {
    const button = event.target.closest("button[data-string]");
    if (!button) return;
    let string = Number(button.dataset.string);
    let fret = Number(button.dataset.fret);
    const moves = {
      ArrowLeft: () => {
        fret = Math.max(0, fret - 1);
      },
      ArrowRight: () => {
        fret = Math.min(5, fret + 1);
      },
      ArrowUp: () => {
        string = Math.max(0, string - 1);
      },
      ArrowDown: () => {
        string = Math.min(5, string + 1);
      },
      Home: () => {
        fret = 0;
      },
      End: () => {
        fret = 5;
      },
    };
    if (!moves[event.key]) return;
    event.preventDefault();
    moves[event.key]();
    this.board
      .querySelector(`[data-string="${string}"][data-fret="${fret}"]`)
      ?.focus();
  }

  playPosition(string, fret, description) {
    const status = document.getElementById("harmonyNoteStatus");
    const ok = this.engine.playNote(string, fret, 1.8, 0.7);
    this.hasAudio ||= ok;
    status.textContent = ok
      ? description
      : this.engine.isMuted
        ? "Activa el sonido con el botón de la cabecera para escuchar."
        : "El audio no está disponible en este navegador.";
  }

  // Triads ascend from octave 3. Pick the nearest available open string for each pitch.
  voicing(chord) {
    let previous = 47;
    return chord.pitchClasses.map((pitchClass) => {
      let midi = 48 + pitchClass;
      while (midi <= previous) midi += 12;
      previous = midi;
      const string = TUNING.findIndex((open) => open <= midi);
      return { string, fret: midi - TUNING[string] };
    });
  }

  async playSequence(chords, { arpeggio = false } = {}) {
    this.stop();
    if (this.engine.isMuted) {
      this.status.textContent =
        "Activa el sonido con el botón de la cabecera para escuchar.";
      return;
    }
    const ctx = this.engine.ensureContext();
    if (!ctx) {
      this.status.textContent =
        "El audio no está disponible en este navegador.";
      return;
    }
    const run = this.runId;
    this.playing = true;
    this.playButton.textContent = "■ Detener";
    this.playButton.setAttribute("aria-pressed", "true");
    if (this.engine.pendingResume) await this.engine.pendingResume;
    if (run !== this.runId || this.root.hidden) return;
    if (ctx.state !== "running") {
      this.stop();
      this.status.textContent =
        "No se pudo activar el audio. Vuelve a pulsar Escuchar.";
      return;
    }
    const beatDuration = 60 / this.tempo;
    const barDuration = beatDuration * 4;
    const onset = ctx.currentTime + 0.06;
    chords.forEach((chord, index) => {
      this.voicing(chord).forEach(({ string, fret }, noteIndex) => {
        const delay = Math.max(
          0,
          onset -
            ctx.currentTime +
            index * barDuration +
            noteIndex * (arpeggio ? beatDuration : 0.035),
        );
        this.engine.playNote(
          string,
          fret,
          Math.min(barDuration, 2.8),
          0.67,
          delay,
        );
      });
    });
    let lastBar = -1;
    const update = () => {
      if (run !== this.runId) return;
      const elapsed = ctx.currentTime - onset;
      const bar = Math.floor(Math.max(0, elapsed) / barDuration);
      if (bar >= chords.length) {
        this.stop();
        this.status.textContent =
          "Escucha terminada. Explora un acorde o cambia de tonalidad.";
        return;
      }
      if (bar !== lastBar) {
        lastBar = bar;
        const chord = chords[bar];
        const selected = this.study.chords.findIndex(
          (candidate) => candidate.symbol === chord.symbol,
        );
        if (selected >= 0) this.selectChord(selected);
        [...this.chordList.children].forEach((button, i) =>
          button.classList.toggle("is-playing", i === selected),
        );
        this.status.textContent = `${chord.spanishName} · grado ${chord.roman} · acorde ${bar + 1} de ${chords.length}`;
      }
      const beat = Math.floor(Math.max(0, elapsed) / beatDuration) % 4;
      this.root
        .querySelectorAll(".harmony-pulse span")
        .forEach((dot, i) => dot.classList.toggle("is-beat", i === beat));
      this.frame = requestAnimationFrame(update);
    };
    update();
  }

  stop() {
    this.runId++;
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
    if (this.playing || this.hasAudio) this.engine.stopAll();
    this.playing = false;
    this.hasAudio = false;
    if (!this.root) return;
    this.playButton.textContent = "▶ Escuchar progresión";
    this.playButton.setAttribute("aria-pressed", "false");
    this.root
      .querySelectorAll(".is-playing,.is-beat")
      .forEach((item) => item.classList.remove("is-playing", "is-beat"));
    this.status.textContent = "4 pulsos por acorde · compás de 4/4";
  }

  renderChallenge() {
    const dominant = this.study.chords.find((chord) => chord.degree === 5);
    document.getElementById("harmonyQuestion").textContent =
      `¿Qué acorde es el grado V en ${this.study.keyLabel}?`;
    const answers = document.getElementById("harmonyAnswers");
    const feedback = document.getElementById("harmonyFeedback");
    feedback.textContent =
      "Pista: cuenta cinco notas desde la primera de la tonalidad.";
    answers.replaceChildren();
    // Alphabetic ordering keeps the choices independent from the visible progression order.
    [...this.study.chords]
      .sort((a, b) => a.spanishName.localeCompare(b.spanishName, "es"))
      .forEach((chord) => {
        const button = element("button", chord.spanishName);
        button.type = "button";
        button.addEventListener("click", () => {
          const correct = chord.symbol === dominant.symbol;
          button.dataset.answer = correct ? "correct" : "incorrect";
          if (correct) {
            feedback.textContent = `✓ Exacto. ${dominant.spanishName} es el grado V: parte de ${noteLabel(dominant.notes[0])}, la quinta nota de la tonalidad. Cambia de tonalidad para intentarlo otra vez.`;
          } else {
            feedback.textContent = `Prueba otra vez: ${chord.spanishName} es el grado ${chord.roman}. Busca el acorde construido sobre ${noteLabel(this.study.scale[4])}.`;
          }
        });
        answers.append(button);
      });
  }
}
