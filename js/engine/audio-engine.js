/**
 * GMUSIC AUDIO ENGINE (v1.1)
 * Pure Web Audio API guitar synthesis engine.
 * Features:
 * - Initializes strictly upon first user gesture (no autoplay errors)
 * - Calibrated standard tuning frequencies (E2=82.41Hz, A2=110.00Hz, D3=146.83Hz, G3=196.00Hz, B3=246.94Hz, E4=329.63Hz)
 * - Harmonic overtones, acoustic body filtering, pluck transient, and realistic natural decay
 * - Strumming engine with adjustable speed and downstroke/upstroke directions
 */

import { STRING_BY_S } from '../music/strings.js';

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.initialized = false;
    this.voices = new Set();
    this.pendingResume = null;
  }

  /**
   * Initializes or resumes AudioContext strictly after a user interaction
   */
  ensureContext() {
    try {
      if (!this.ctx || this.ctx.state === 'closed') {
        const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!AudioContextClass) return null;
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        this.initialized = true;
      }
      if (['suspended', 'interrupted'].includes(this.ctx.state) && !this.pendingResume) {
        this.pendingResume = Promise.resolve(this.ctx.resume())
          .catch(() => { this.stopAll(); })
          .finally(() => { this.pendingResume = null; });
      }
      return this.ctx;
    } catch {
      this.stopAll();
      return null;
    }
  }

  /**
   * Calculate precise frequency for string index s (0..5) and fret f (0..16)
   */
  getFrequency(s, f = 0) {
    const stringData = STRING_BY_S[s] || STRING_BY_S[0];
    const baseFreq = stringData.baseFreq;
    return baseFreq * Math.pow(2, f / 12);
  }

  /**
   * Play a single plucked note on string s (0..5) at fret f (0..16)
   */
  playNote(s, f = 0, duration = 2.4, velocity = 0.9, delay = 0) {
    if (this.isMuted || !Number.isInteger(s) || !STRING_BY_S[s] || !Number.isInteger(f) || f < 0 || f > 24) return false;
    if (![duration, velocity, delay].every(Number.isFinite) || duration <= 0 || velocity <= 0 || delay < 0) return false;
    const ctx = this.ensureContext();
    if (!ctx) return false;
    duration = Math.min(duration, 8);
    velocity = Math.min(velocity, 1);
    // Bound polyphony and release all connected nodes when a note finishes.
    if (this.voices.size >= 24) this.voices.values().next().value.stop();
    const nodes = [];
    const sources = [];
    const voice = {
      stop: () => {
        sources.forEach(source => { try { source.stop(); } catch { /* Already ended. */ } });
        nodes.forEach(node => node.disconnect());
        this.voices.delete(voice);
      }
    };
    this.voices.add(voice);
    try {

      const now = ctx.currentTime + delay;
      const freq = this.getFrequency(s, f);

      // Master Note Gain Envelope
      const noteGain = ctx.createGain();
      nodes.push(noteGain);
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(velocity * 0.4, now + 0.006); // Fast acoustic attack
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Wooden Acoustic Body Filter
      const bodyFilter = ctx.createBiquadFilter();
      nodes.push(bodyFilter);
      bodyFilter.type = 'lowpass';
      const cutoff = s >= 3 ? Math.min(freq * 6, 2400) : Math.min(freq * 8, 4500);
      bodyFilter.frequency.setValueAtTime(cutoff, now);
      bodyFilter.frequency.exponentialRampToValueAtTime(freq * 1.6, now + duration * 0.85);
      bodyFilter.Q.setValueAtTime(1.6, now);

      // Harmonic Synthesis (Fundamental + Overtones)
      const harmonics = [
        { mult: 1.0, gain: 1.0, type: 'triangle' },
        { mult: 2.0, gain: 0.55, type: 'sawtooth' },
        { mult: 3.0, gain: 0.32, type: 'sine' },
        { mult: 4.0, gain: 0.18, type: 'sine' },
        { mult: 5.0, gain: 0.09, type: 'sine' }
      ];

      harmonics.forEach(h => {
        const osc = ctx.createOscillator();
        const hGain = ctx.createGain();
        nodes.push(osc, hGain);
        sources.push(osc);
        if (h.mult === 1) osc.onended = () => {
          nodes.forEach(node => node.disconnect());
          this.voices.delete(voice);
        };

        osc.type = h.type;
        osc.frequency.setValueAtTime(freq * h.mult, now);

        const hDecay = duration / (h.mult * 0.75);
        hGain.gain.setValueAtTime(h.gain * 0.28, now);
        hGain.gain.exponentialRampToValueAtTime(0.00001, now + Math.min(duration, hDecay));

        osc.connect(hGain);
        hGain.connect(bodyFilter);

        osc.start(now);
        osc.stop(now + duration + 0.05);
      });

      // Plectrum / Finger Attack Noise
      this.createPickNoise(ctx, now, bodyFilter, s, nodes, sources);

      bodyFilter.connect(noteGain);
      noteGain.connect(this.masterGain);
      return true;
    } catch {
      voice.stop();
      return false;
    }
  }

  /**
   * Generates pick attack noise burst
   */
  createPickNoise(ctx, time, destination, s, nodes, sources) {
    const bufferSize = Math.floor(ctx.sampleRate * 0.02); // 20ms burst
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(s >= 3 ? 1400 : 2800, time);
    noiseFilter.Q.setValueAtTime(2.5, time);

    const noiseGain = ctx.createGain();
    nodes.push(whiteNoise, noiseFilter, noiseGain);
    sources.push(whiteNoise);
    noiseGain.gain.setValueAtTime(0.12, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(destination);

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.025);
  }

  /**
   * Strums a chord given an array of fret positions for strings s:5 down to s:0
   * e.g. Am = [-1, 0, 2, 2, 1, 0] (-1 is muted)
   */
  strumChord(strumArray, downstroke = true, strumSpeedMs = 35) {
    if (this.isMuted || !Array.isArray(strumArray) || !Number.isFinite(strumSpeedMs)) return;
    const speed = Math.max(0, Math.min(strumSpeedMs, 500)) / 1000;

    // strumArray index 0 is s:5 (6th string), index 5 is s:0 (1st string)
    const indices = downstroke ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0];

    indices.forEach((arrIdx, step) => {
      const fret = strumArray[arrIdx];
      const s = 5 - arrIdx; // convert array index to canonical s
      if (fret !== undefined && fret >= 0) {
        this.playNote(s, fret, 2.6, 0.85, step * speed);
      }
    });
  }

  /**
   * Toggle mute
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) this.stopAll();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  stopAll() {
    [...this.voices].forEach(voice => voice.stop());
  }
}

export const audioEngine = new AudioEngine();
