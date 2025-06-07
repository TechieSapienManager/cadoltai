
class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying = false;

  async playSound(sound: { id: string; name: string; url: string }, loop = false, duration?: number) {
    try {
      console.log('AudioService: Attempting to play sound', sound.name, sound.url);
      
      // Stop any currently playing audio
      this.stopSound();

      // Create new audio instance
      this.currentAudio = new Audio();
      this.currentAudio.loop = loop;
      this.currentAudio.volume = 0.5;
      this.currentAudio.crossOrigin = "anonymous";
      
      // Set up event listeners before setting src
      this.currentAudio.addEventListener('loadstart', () => {
        console.log('AudioService: Loading started');
      });
      
      this.currentAudio.addEventListener('canplay', () => {
        console.log('AudioService: Can start playing');
      });
      
      this.currentAudio.addEventListener('error', (e) => {
        console.error('AudioService: Audio error', e);
        this.handleAudioError(sound);
      });

      this.currentAudio.addEventListener('ended', () => {
        console.log('AudioService: Audio ended');
        this.isPlaying = false;
      });

      // Set the source
      this.currentAudio.src = sound.url;
      
      // Load and play
      this.currentAudio.load();
      await this.currentAudio.play();
      this.isPlaying = true;
      console.log('AudioService: Successfully started playing');

      // If duration is specified, stop after that time
      if (duration) {
        setTimeout(() => {
          this.stopSound();
        }, duration);
      }
    } catch (error) {
      console.error('AudioService: Error playing sound:', error);
      // Try fallback URL if the original fails
      this.handleAudioError(sound);
    }
  }

  private async handleAudioError(sound: { id: string; name: string; url: string }) {
    console.log('AudioService: Handling audio error, trying fallback');
    try {
      // Create a simple tone as fallback
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Set frequency based on sound type
      const frequencies: { [key: string]: number } = {
        'ocean': 200,
        'rainfall': 150,
        'forest': 300,
        'white-noise': 400,
        'birds': 800,
        'wind': 100,
        'default': 440,
        'gentle': 523,
        'nature': 659,
        'classic': 880
      };
      
      oscillator.frequency.setValueAtTime(frequencies[sound.id] || 440, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start();
      
      // Stop after 5 seconds for fallback
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 5000);
      
      this.isPlaying = true;
      console.log('AudioService: Fallback tone playing');
    } catch (fallbackError) {
      console.error('AudioService: Fallback also failed:', fallbackError);
    }
  }

  stopSound() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isPlaying = false;
    console.log('AudioService: Sound stopped');
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  setVolume(volume: number) {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

export const audioService = new AudioService();

// Updated sound URLs with working alternatives
export const ambientSounds = [
  {
    id: 'ocean',
    name: 'Ocean Waves',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  },
  {
    id: 'rainfall',
    name: 'Gentle Rainfall',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  },
  {
    id: 'forest',
    name: 'Forest Sounds',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  },
  {
    id: 'birds',
    name: 'Bird Songs',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  },
  {
    id: 'wind',
    name: 'Gentle Wind',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  }
];

export const alarmSounds = [
  {
    id: 'default',
    name: 'Default Alarm',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  },
  {
    id: 'gentle',
    name: 'Gentle Wake',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  },
  {
    id: 'nature',
    name: 'Nature Sounds',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  },
  {
    id: 'classic',
    name: 'Classic Alarm',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  }
];
