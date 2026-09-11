// Web Audio API Ambient Sound Synthesizer for Cozy Kissa Lab
// Pure client-side synthesis without requiring external audio files.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a resonant singing bowl / Buddhist temple chime when the tea is ready.
 */
export function playChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const fundamental = 432; // Calming 432 Hz tuning
  const harmonics = [1, 2.76, 5.4, 8.9];
  const gains = [0.4, 0.2, 0.08, 0.03];

  harmonics.forEach((harmonic, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(fundamental * harmonic, now);

    // Exponential decay for soothing sustain
    gain.gain.setValueAtTime(gains[idx], now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 3.6);
  });
}

/**
 * Plays a soft water pouring sound using shaped white noise.
 */
export function playWaterPour(durationMs: number = 2000) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const durationSec = durationMs / 1000;
  const bufferSize = ctx.sampleRate * durationSec;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Pink/brown noise generation
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99 * b0 + white * 0.05;
    b1 = 0.95 * b1 + white * 0.1;
    b2 = 0.85 * b2 + white * 0.15;
    data[i] = (b0 + b1 + b2) * 0.3;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.linearRampToValueAtTime(1400, now + durationSec * 0.7);
  filter.frequency.linearRampToValueAtTime(1000, now + durationSec);
  filter.Q.value = 1.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.3);
  gain.gain.setValueAtTime(0.18, now + durationSec - 0.4);
  gain.gain.linearRampToValueAtTime(0.001, now + durationSec);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + durationSec);
}

/**
 * Plays a soft wooden clock tick for steeping countdown.
 */
export function playSoftTick() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);

  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

/**
 * Plays a gentle, relaxing sip sound with subtle warmth.
 */
export function playSipSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Gentle breathy water suction + bell chime note
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(587.33, now); // D5 calming note
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.3); // Ramp up to A5

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.85);
}

/**
 * Plays the rustling sound of dry tea leaves scooping into a teapot.
 */
export function playLeafScoopSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Short burst of high-frequency granular noise
  const bufferSize = ctx.sampleRate * 0.25;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(3200, now);
  filter.Q.value = 3.0;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.26);

  // Soft wooden scoop tap
  const osc = ctx.createOscillator();
  const tapGain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(240, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
  tapGain.gain.setValueAtTime(0.06, now);
  tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(tapGain);
  tapGain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.09);
}

/**
 * Plays a delicate ceramic / porcelain teacup clink.
 */
export function playTeacupClink() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(2637, now); // E7 crystalline note
  osc.frequency.exponentialRampToValueAtTime(2400, now + 0.4);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.5);
}

/**
 * Plays the sound of an artisan clear ice sphere dropping into a tumbler.
 */
export function playIceDropSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  [1800, 2400].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + i * 0.06);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + i * 0.06 + 0.15);

    gain.gain.setValueAtTime(0.09, now + i * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.06);
    osc.stop(now + i * 0.06 + 0.22);
  });
}

/**
 * Plays a quick rhythmic bamboo Chasen whisk stroke sound.
 */
export function playWhiskSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const bufferSize = ctx.sampleRate * 0.12;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(1600, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.13);
}

// Procedural Ambient Sound System (Rain 🌧️ / Fireplace 🔥)
let rainNode: AudioNode | null = null;
let fireNode: AudioNode | null = null;

export function startAmbientRain(volume: number = 0.12) {
  stopAmbientRain();
  const ctx = getAudioContext();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Pink noise approximation for soothing rain
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99 * b0 + white * 0.05;
    b1 = 0.95 * b1 + white * 0.1;
    b2 = 0.85 * b2 + white * 0.15;
    data[i] = (b0 + b1 + b2) * 0.25;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1200;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
  rainNode = noise;
}

export function stopAmbientRain() {
  if (rainNode) {
    try {
      (rainNode as AudioScheduledSourceNode).stop();
      rainNode.disconnect();
    } catch {}
    rainNode = null;
  }
}

export function startFireplace(volume: number = 0.1) {
  stopFireplace();
  const ctx = getAudioContext();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Brown noise base + crackle pops
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    // Occasional crackle pop
    const isPop = Math.random() < 0.002;
    data[i] = (lastOut * 2.5 + (isPop ? (Math.random() * 2 - 1) * 0.8 : 0)) * 0.3;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 600;
  filter.Q.value = 1.0;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
  fireNode = noise;
}

export function stopFireplace() {
  if (fireNode) {
    try {
      (fireNode as AudioScheduledSourceNode).stop();
      fireNode.disconnect();
    } catch {}
    fireNode = null;
  }
}
