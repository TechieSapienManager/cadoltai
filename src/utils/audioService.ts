
export interface Sound {
  id: string;
  name: string;
  type: 'ambient' | 'alarm';
}

export const ambientSounds: Sound[] = [
  { id: 'rainfall', name: 'Rainfall', type: 'ambient' },
  { id: 'lofi', name: 'Lo-Fi Beats', type: 'ambient' },
  { id: 'ocean', name: 'Ocean Waves', type: 'ambient' },
  { id: 'birds', name: 'Forest Birds', type: 'ambient' },
  { id: 'fireplace', name: 'Fireplace Crackle', type: 'ambient' },
  { id: 'crickets', name: 'Night Crickets', type: 'ambient' },
  { id: 'whitenoise', name: 'White Noise', type: 'ambient' },
  { id: 'bowls', name: 'Tibetan Bowls', type: 'ambient' },
  { id: 'cafe', name: 'Café Background', type: 'ambient' },
  { id: 'wind', name: 'Wind in Trees', type: 'ambient' }
];

export const alarmSounds: Sound[] = [
  { id: 'beep', name: 'Digital Beep', type: 'alarm' },
  { id: 'classic', name: 'Classic Ring', type: 'alarm' },
  { id: 'piano', name: 'Gentle Piano', type: 'alarm' },
  { id: 'nature', name: 'Nature Wake', type: 'alarm' },
  { id: 'bell', name: 'Church Bell', type: 'alarm' },
  { id: 'space', name: 'Space Ambience', type: 'alarm' },
  { id: 'chime', name: 'Chime Melody', type: 'alarm' },
  { id: 'morning', name: 'Morning Birds', type: 'alarm' }
];

class AudioService {
  private audioContext: AudioContext | null = null;
  private currentOscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentSound: string | null = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  async playSound(sound: Sound, loop: boolean = false, duration?: number) {
    if (!this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.stopSound();

    this.currentOscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();

    // Configure based on sound type
    const frequency = this.getFrequencyForSound(sound.id);
    const waveType = this.getWaveTypeForSound(sound.id);

    this.currentOscillator.type = waveType;
    this.currentOscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    this.gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);

    this.currentOscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.currentOscillator.start();
    this.isPlaying = true;
    this.currentSound = sound.id;

    // Handle duration
    if (duration && !loop) {
      setTimeout(() => this.stopSound(), duration);
    }

    // For ambient sounds that should loop, restart when ended
    if (loop && sound.type === 'ambient') {
      this.currentOscillator.onended = () => {
        if (this.isPlaying && this.currentSound === sound.id) {
          setTimeout(() => this.playSound(sound, true), 100);
        }
      };
    }
  }

  private getFrequencyForSound(soundId: string): number {
    const frequencies: { [key: string]: number } = {
      rainfall: 200,
      lofi: 150,
      ocean: 180,
      birds: 800,
      fireplace: 120,
      crickets: 400,
      whitenoise: 440,
      bowls: 256,
      cafe: 300,
      wind: 160,
      beep: 1000,
      classic: 800,
      piano: 523,
      nature: 600,
      bell: 440,
      space: 220,
      chime: 880,
      morning: 750
    };
    return frequencies[soundId] || 440;
  }

  private getWaveTypeForSound(soundId: string): OscillatorType {
    const waveTypes: { [key: string]: OscillatorType } = {
      rainfall: 'sawtooth',
      lofi: 'triangle',
      ocean: 'sine',
      birds: 'sine',
      fireplace: 'sawtooth',
      crickets: 'square',
      whitenoise: 'square',
      bowls: 'sine',
      cafe: 'triangle',
      wind: 'sine',
      beep: 'square',
      classic: 'sine',
      piano: 'triangle',
      nature: 'sine',
      bell: 'sine',
      space: 'sawtooth',
      chime: 'triangle',
      morning: 'sine'
    };
    return waveTypes[soundId] || 'sine';
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
    this.currentSound = null;
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  getCurrentSound() {
    return this.currentSound;
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext?.currentTime || 0);
    }
  }
}

export const audioService = new AudioService();
