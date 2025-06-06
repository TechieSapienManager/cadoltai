
class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying = false;

  async playSound(sound: { id: string; name: string; url: string }, loop = false, duration?: number) {
    try {
      // Stop any currently playing audio
      this.stopSound();

      this.currentAudio = new Audio(sound.url);
      this.currentAudio.loop = loop;
      this.currentAudio.volume = 0.5;
      
      await this.currentAudio.play();
      this.isPlaying = true;

      // If duration is specified, stop after that time
      if (duration) {
        setTimeout(() => {
          this.stopSound();
        }, duration);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      throw error;
    }
  }

  stopSound() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      this.isPlaying = false;
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const audioService = new AudioService();

export const ambientSounds = [
  {
    id: 'ocean',
    name: 'Ocean Waves',
    url: 'https://www.soundjay.com/misc/sounds/ocean-1.wav'
  },
  {
    id: 'rainfall',
    name: 'Gentle Rainfall',
    url: 'https://www.soundjay.com/misc/sounds/rain-1.wav'
  },
  {
    id: 'forest',
    name: 'Forest Sounds',
    url: 'https://www.soundjay.com/misc/sounds/forest-1.wav'
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    url: 'https://www.soundjay.com/misc/sounds/white-noise-1.wav'
  },
  {
    id: 'birds',
    name: 'Bird Songs',
    url: 'https://www.soundjay.com/misc/sounds/birds-1.wav'
  },
  {
    id: 'wind',
    name: 'Gentle Wind',
    url: 'https://www.soundjay.com/misc/sounds/wind-1.wav'
  }
];
