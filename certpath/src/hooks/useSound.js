/**
 * Brilliant-style sound feedback using Web Audio API.
 * Zero dependencies, zero audio files — pure synthesis.
 */

let ctx = null;

function getContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function playTone(frequency, duration, { type = "sine", gain = 0.12, decay = 0.8, delay = 0 } = {}) {
  const ac = getContext();
  const osc = ac.createOscillator();
  const vol = ac.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ac.currentTime + delay);

  vol.gain.setValueAtTime(gain, ac.currentTime + delay);
  vol.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration * decay);

  osc.connect(vol);
  vol.connect(ac.destination);

  osc.start(ac.currentTime + delay);
  osc.stop(ac.currentTime + delay + duration);
}

function playNoise(duration, { gain = 0.06, decay = 0.3, delay = 0 } = {}) {
  const ac = getContext();
  const bufferSize = ac.sampleRate * duration;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 4);
  }
  const source = ac.createBufferSource();
  source.buffer = buffer;

  const vol = ac.createGain();
  vol.gain.setValueAtTime(gain, ac.currentTime + delay);
  vol.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration * decay);

  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(800, ac.currentTime + delay);

  source.connect(filter);
  filter.connect(vol);
  vol.connect(ac.destination);
  source.start(ac.currentTime + delay);
}

const sounds = {
  /** Ascending two-note chime — correct answer, successful drop */
  correct() {
    playTone(523.25, 0.15, { type: "sine", gain: 0.10, decay: 0.9 });
    playTone(659.25, 0.22, { type: "sine", gain: 0.12, decay: 0.9, delay: 0.08 });
  },

  /** Low soft thud — wrong answer, failed attempt */
  wrong() {
    playTone(180, 0.18, { type: "triangle", gain: 0.10, decay: 0.5 });
    playNoise(0.08, { gain: 0.04, decay: 0.5, delay: 0.02 });
  },

  /** Subtle pop — placing an item, clicking a selection */
  pop() {
    playTone(880, 0.06, { type: "sine", gain: 0.07, decay: 0.5 });
  },

  /** Step complete — short rising tone */
  stepComplete() {
    playTone(440, 0.12, { type: "sine", gain: 0.08, decay: 0.8 });
    playTone(554.37, 0.12, { type: "sine", gain: 0.09, decay: 0.8, delay: 0.06 });
    playTone(659.25, 0.18, { type: "sine", gain: 0.10, decay: 0.9, delay: 0.12 });
  },

  /** Lesson complete — triumphant ascending arpeggio */
  lessonComplete() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      playTone(freq, 0.25, { type: "sine", gain: 0.10, decay: 0.95, delay: i * 0.1 });
      playTone(freq * 1.005, 0.25, { type: "sine", gain: 0.06, decay: 0.95, delay: i * 0.1 });
    });
  },

  /** Soft snap — drag item landing in a zone */
  snap() {
    playTone(600, 0.05, { type: "square", gain: 0.04, decay: 0.3 });
    playTone(900, 0.04, { type: "sine", gain: 0.05, decay: 0.3, delay: 0.02 });
  },
};

export default function useSound() {
  return sounds;
}

export { sounds };
