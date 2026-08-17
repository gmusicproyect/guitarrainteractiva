/**
 * GMUSIC · REALISTIC WEB AUDIO GUITAR SYNTHESIS ENGINE
 * Synthesizes acoustic guitar strings using harmonic additive oscillators,
 * bandpass body resonance, pluck transient noise, and realistic decay envelopes.
 */

class GuitarAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    
    // Standard Guitar Tuning Frequencies (Hz)
    // String 1 (E4), String 2 (B3), String 3 (G3), String 4 (D3), String 5 (A2), String 6 (E2)
    this.openStringFreqs = {
      1: 329.63, // E4 (Mi aguda)
      2: 246.94, // B3 (Si)
      3: 196.00, // G3 (Sol)
      4: 146.83, // D3 (Re)
      5: 110.00, // A2 (La)
      6: 82.41   // E2 (Mi grave)
    };

    this.noteNamesSpanish = {
      'C': 'Do', 'C#': 'Do#', 'D': 'Re', 'D#': 'Re#', 'E': 'Mi',
      'F': 'Fa', 'F#': 'Fa#', 'G': 'Sol', 'G#': 'Sol#', 'A': 'La',
      'A#': 'La#', 'B': 'Si'
    };
  }

  /**
   * Initializes or resumes the AudioContext upon user gesture
   */
  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Calculate frequency for a given string and fret number
   * f = f0 * 2^(fret / 12)
   */
  getFrequency(stringNum, fret = 0) {
    const baseFreq = this.openStringFreqs[stringNum] || 110;
    return baseFreq * Math.pow(2, fret / 12);
  }

  /**
   * Play a single plucked guitar string with rich acoustic harmonics & body resonance
   */
  playString(stringNum, fret = 0, duration = 2.0, velocity = 0.9) {
    if (this.isMuted) return;
    this.initContext();

    const now = this.ctx.currentTime;
    const freq = this.getFrequency(stringNum, fret);

    // Master string gain envelope
    const stringGain = this.ctx.createGain();
    stringGain.gain.setValueAtTime(0.0001, now);
    stringGain.gain.linearRampToValueAtTime(velocity * 0.45, now + 0.008); // Quick pluck attack
    stringGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Body Resonance Filter (Simulates wooden acoustic guitar body)
    const bodyFilter = this.ctx.createBiquadFilter();
    bodyFilter.type = 'lowpass';
    // Thicker strings (4, 5, 6) have darker warmer tone
    const cutoff = stringNum >= 4 ? Math.min(freq * 6, 2200) : Math.min(freq * 8, 4200);
    bodyFilter.frequency.setValueAtTime(cutoff, now);
    bodyFilter.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration * 0.8);
    bodyFilter.Q.setValueAtTime(1.8, now);

    // Harmonic Overtones Synthesis (Karplus-Strong approximation via additive synthesis)
    // 1st Fundamental + 2nd, 3rd, 4th, 5th, 6th harmonics
    const harmonics = [
      { mult: 1.0, gain: 1.0, type: 'triangle' },
      { mult: 2.0, gain: 0.6, type: 'sawtooth' },
      { mult: 3.0, gain: 0.35, type: 'sine' },
      { mult: 4.0, gain: 0.2, type: 'sine' },
      { mult: 5.0, gain: 0.1, type: 'sine' }
    ];

    harmonics.forEach(h => {
      const osc = this.ctx.createOscillator();
      const hGain = this.ctx.createGain();

      osc.type = h.type;
      osc.frequency.setValueAtTime(freq * h.mult, now);

      // Higher harmonics decay much faster than fundamental (natural string physics)
      const hDecay = duration / (h.mult * 0.8);
      hGain.gain.setValueAtTime(h.gain * 0.3, now);
      hGain.gain.exponentialRampToValueAtTime(0.00001, now + Math.min(duration, hDecay));

      osc.connect(hGain);
      hGain.connect(bodyFilter);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    });

    // Pluck pick noise transient (creates realistic crisp string attack)
    this.createPickNoise(now, bodyFilter, stringNum);

    bodyFilter.connect(stringGain);
    stringGain.connect(this.masterGain);
  }

  /**
   * Generates a tiny burst of bandpass-filtered noise for the plectrum/finger attack
   */
  createPickNoise(time, destination, stringNum) {
    if (!this.ctx) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.025); // 25ms burst
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(stringNum >= 4 ? 1200 : 2500, time);
    noiseFilter.Q.setValueAtTime(3.0, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(destination);

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.03);
  }

  /**
   * Strum a chord defined as an array of fret positions for strings [6, 5, 4, 3, 2, 1]
   * e.g., Am = [-1, 0, 2, 2, 1, 0] (-1 is muted)
   */
  strumChord(fretArray, downstroke = true, strumSpeedMs = 35) {
    if (this.isMuted) return;
    this.initContext();

    // fretArray order: index 0 is String 6, index 5 is String 1
    const order = downstroke ? [6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6];
    
    order.forEach((strNum, idx) => {
      const fret = fretArray[6 - strNum];
      if (fret !== undefined && fret >= 0) {
        setTimeout(() => {
          this.playString(strNum, fret, 2.5, 0.85);
        }, idx * strumSpeedMs);
      }
    });
  }

  /**
   * Predefined standard open chord voicings
   */
  getChordVoicing(chordName) {
    // Strings 6 to 1: [E2, A2, D3, G3, B3, E4]
    const chords = {
      'Am': [-1, 0, 2, 2, 1, 0], // x 0 2 2 1 0
      'Em': [0, 2, 2, 0, 0, 0],  // 0 2 2 0 0 0
      'E':  [0, 2, 2, 1, 0, 0],  // 0 2 2 1 0 0
      'C':  [-1, 3, 2, 0, 1, 0], // x 3 2 0 1 0
      'G':  [3, 2, 0, 0, 0, 3],  // 3 2 0 0 0 3
      'D':  [-1, -1, 0, 2, 3, 2], // x x 0 2 3 2
      'A':  [-1, 0, 2, 2, 2, 0], // x 0 2 2 2 0
    };
    return chords[chordName] || null;
  }

  /**
   * Toggle mute status
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}

export const guitarAudio = new GuitarAudioEngine();
