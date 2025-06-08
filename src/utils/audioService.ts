export interface AmbientSound {
  id: string;
  name: string;
  url: string;
}

export interface AlarmSound {
  id: string;
  name: string;
  frequency: number;
}

export const ambientSounds: AmbientSound[] = [
  { id: 'ocean', name: '🌊 Ocean Waves', url: 'https://www.soundjay.com/misc/sounds/ocean-wave-1.wav' },
  { id: 'rain', name: '🌧️ Rain', url: 'https://www.soundjay.com/misc/sounds/rain-01.wav' },
  { id: 'forest', name: '🌲 Forest', url: 'https://www.soundjay.com/misc/sounds/forest-1.wav' },
  { id: 'cafe', name: '☕ Coffee Shop', url: 'https://www.soundjay.com/misc/sounds/coffee-shop-1.wav' },
  { id: 'white-noise', name: '📻 White Noise', url: 'https://www.soundjay.com/misc/sounds/white-noise-1.wav' }
];

export const alarmSounds: AlarmSound[] = [
  { id: 'default', name: 'Default Alarm', frequency: 800 },
  { id: 'gentle', name: 'Gentle Wake', frequency: 400 },
  { id: 'nature', name: 'Nature Sounds', frequency: 600 },
  { id: 'electronic', name: 'Electronic', frequency: 1000 },
  { id: 'classic', name: 'Classic Bell', frequency: 500 }
];

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private isLooping = false;

  async playSound(sound: AmbientSound, loop = false, duration?: number) {
    try {
      // Stop any currently playing audio
      this.stopSound();

      // Create audio context if needed
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // For focus mode, we'll generate audio instead of using external URLs
      // This ensures consistent playback without network dependencies
      if (loop) {
        this.generateAmbientAudio(sound.id);
        this.isLooping = true;
        return;
      }

      // For preview (short duration)
      if (duration) {
        this.generateAmbientAudio(sound.id, duration);
        return;
      }

    } catch (error) {
      console.error('Error playing sound:', error);
      throw error;
    }
  }

  async playAlarmSound(sound: AlarmSound, duration?: number) {
    try {
      // Stop any currently playing audio
      this.stopSound();

      // Create audio context if needed
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.generateAlarmAudio(sound.frequency, duration);

    } catch (error) {
      console.error('Error playing alarm sound:', error);
      throw error;
    }
  }

  private generateAlarmAudio(frequency: number, duration?: number) {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.value = 0.3;
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    
    if (duration) {
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration / 1000 - 0.1);
      oscillator.stop(ctx.currentTime + duration / 1000);
    }

    this.currentAudio = oscillator as any;
  }

  private generateAmbientAudio(soundType: string, duration?: number) {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    
    // Create different ambient sounds using Web Audio API
    switch (soundType) {
      case 'ocean':
        this.createOceanSound(ctx, duration);
        break;
      case 'rain':
        this.createRainSound(ctx, duration);
        break;
      case 'forest':
        this.createForestSound(ctx, duration);
        break;
      case 'cafe':
        this.createCafeSound(ctx, duration);
        break;
      case 'white-noise':
        this.createWhiteNoiseSound(ctx, duration);
        break;
      default:
        this.createWhiteNoiseSound(ctx, duration);
    }
  }

  private createOceanSound(ctx: AudioContext, duration?: number) {
    const bufferSize = ctx.sampleRate * (duration ? duration / 1000 : 2);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate ocean-like sound using filtered noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1 * Math.sin(i * 0.001);
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    filter.type = 'lowpass';
    filter.frequency.value = 800;
    gainNode.gain.value = 0.3;

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (this.isLooping && !duration) {
      source.loop = true;
    }

    source.start();
    
    if (duration) {
      source.stop(ctx.currentTime + duration / 1000);
    }

    // Store reference to stop later
    this.currentAudio = source as any;
  }

  private createRainSound(ctx: AudioContext, duration?: number) {
    const bufferSize = ctx.sampleRate * (duration ? duration / 1000 : 2);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate rain-like sound using filtered noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    filter.type = 'highpass';
    filter.frequency.value = 1000;
    gainNode.gain.value = 0.2;

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (this.isLooping && !duration) {
      source.loop = true;
    }

    source.start();
    
    if (duration) {
      source.stop(ctx.currentTime + duration / 1000);
    }

    this.currentAudio = source as any;
  }

  private createForestSound(ctx: AudioContext, duration?: number) {
    const bufferSize = ctx.sampleRate * (duration ? duration / 1000 : 2);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate forest-like sound with chirping
    for (let i = 0; i < bufferSize; i++) {
      const noise = (Math.random() * 2 - 1) * 0.05;
      const chirp = Math.sin(i * 0.01) * 0.1 * (Math.random() > 0.999 ? 1 : 0);
      data[i] = noise + chirp;
    }

    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();

    gainNode.gain.value = 0.3;

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (this.isLooping && !duration) {
      source.loop = true;
    }

    source.start();
    
    if (duration) {
      source.stop(ctx.currentTime + duration / 1000);
    }

    this.currentAudio = source as any;
  }

  private createCafeSound(ctx: AudioContext, duration?: number) {
    const bufferSize = ctx.sampleRate * (duration ? duration / 1000 : 2);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate cafe ambience
    for (let i = 0; i < bufferSize; i++) {
      const chatter = (Math.random() * 2 - 1) * 0.1 * Math.sin(i * 0.0001);
      const clinking = Math.random() > 0.9999 ? (Math.random() * 2 - 1) * 0.2 : 0;
      data[i] = chatter + clinking;
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    gainNode.gain.value = 0.25;

    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (this.isLooping && !duration) {
      source.loop = true;
    }

    source.start();
    
    if (duration) {
      source.stop(ctx.currentTime + duration / 1000);
    }

    this.currentAudio = source as any;
  }

  private createWhiteNoiseSound(ctx: AudioContext, duration?: number) {
    const bufferSize = ctx.sampleRate * (duration ? duration / 1000 : 2);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }

    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();

    gainNode.gain.value = 0.2;

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (this.isLooping && !duration) {
      source.loop = true;
    }

    source.start();
    
    if (duration) {
      source.stop(ctx.currentTime + duration / 1000);
    }

    this.currentAudio = source as any;
  }

  stopSound() {
    if (this.currentAudio) {
      try {
        if (this.currentAudio instanceof AudioBufferSourceNode || this.currentAudio instanceof OscillatorNode) {
          this.currentAudio.stop();
        } else if (this.currentAudio.pause) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        }
      } catch (error) {
        console.log('Audio already stopped');
      }
      this.currentAudio = null;
    }
    this.isLooping = false;
  }
}

export const audioService = new AudioService();
