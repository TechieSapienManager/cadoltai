
export interface Sound {
  id: string;
  name: string;
  type: 'ambient' | 'alarm';
  frequency?: number; // For generating audio
  waveType?: OscillatorType;
}

export const ambientSounds: Sound[] = [
  { id: 'ocean', name: 'Calm Ocean', type: 'ambient', frequency: 200, waveType: 'sine' },
  { id: 'rain', name: 'Rainfall', type: 'ambient', frequency: 300, waveType: 'sawtooth' },
  { id: 'lofi', name: 'Lo-fi Beats', type: 'ambient', frequency: 150, waveType: 'triangle' },
  { id: 'birds', name: 'Forest Birds', type: 'ambient', frequency: 800, waveType: 'sine' },
  { id: 'whitenoise', name: 'White Noise', type: 'ambient', frequency: 440, waveType: 'square' }
];

export const alarmSounds: Sound[] = [
  { id: 'classic', name: 'Classic Ring', type: 'alarm', frequency: 800, waveType: 'sine' },
  { id: 'beep', name: 'Digital Beep', type: 'alarm', frequency: 1000, waveType: 'square' },
  { id: 'morning', name: 'Morning Light', type: 'alarm', frequency: 600, waveType: 'triangle' }
];

class AudioService {
  private audioContext: AudioContext | null = null;
  private currentOscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Audio context not supported', error);
    }
  }

  async playSound(sound: Sound, loop: boolean = false, duration?: number) {
    if (!this.audioContext) return;

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.stopSound();

    // Create oscillator and gain nodes
    this.currentOscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();

    // Configure oscillator
    this.currentOscillator.type = sound.waveType || 'sine';
    this.currentOscillator.frequency.setValueAtTime(sound.frequency || 440, this.audioContext.currentTime);

    // Configure gain (volume)
    this.gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);

    // Connect nodes
    this.currentOscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    // Add some variation for ambient sounds
    if (sound.type === 'ambient') {
      this.addAmbientVariation(sound);
    }

    // Start playing
    this.currentOscillator.start();
    this.isPlaying = true;

    // Handle loop
    if (loop && sound.type === 'ambient') {
      this.currentOscillator.loop = true;
    }

    // Stop after duration if specified
    if (duration && !loop) {
      setTimeout(() => this.stopSound(), duration);
    }

    return this.currentOscillator;
  }

  private addAmbientVariation(sound: Sound) {
    if (!this.audioContext || !this.currentOscillator) return;

    // Add subtle frequency modulation for more realistic ambient sounds
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.5, this.audioContext.currentTime);
    lfoGain.gain.setValueAtTime(5, this.audioContext.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(this.currentOscillator.frequency);
    lfo.start();
  }

  stopSound() {
    if (this.currentOscillator) {
      try {
        this.currentOscillator.stop();
      } catch (error) {
        // Oscillator might already be stopped
      }
      this.currentOscillator = null;
    }
    this.isPlaying = false;
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext?.currentTime || 0);
    }
  }
}

export const audioService = new AudioService();
