
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface FocusScreenProps {
  onBack: () => void;
}

export const FocusScreen: React.FC<FocusScreenProps> = ({ onBack }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(25);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsMusicPlaying(false);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }
  }, []);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    
    // Start music when timer starts
    if (!isRunning && !isMusicPlaying && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(error => console.error('Error playing audio:', error));
    }
    
    // Pause music when timer pauses
    if (isRunning && isMusicPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsMusicPlaying(true))
          .catch(error => console.error('Error playing audio:', error));
      }
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedTime * 60);
    setIsMusicPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleTimeSelect = (minutes: number) => {
    setSelectedTime(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
    setIsMusicPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedTime * 60 - timeLeft) / (selectedTime * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/80 to-accent/80 pt-16">
      <div className="p-6">
        <div className="max-w-md mx-auto">
          {/* Timer Display */}
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-center mb-8">
            <div className="relative w-64 h-64 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl font-bold text-white">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={toggleTimer}
                className="w-16 h-16 bg-white text-purple-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
              >
                {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>
              
              <button
                onClick={resetTimer}
                className="w-16 h-16 bg-white/30 text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              <button
                onClick={toggleMusic}
                className="w-16 h-16 bg-white/30 text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                {isMusicPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </button>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-3 gap-3">
              {[5, 15, 25].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => handleTimeSelect(minutes)}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    selectedTime === minutes
                      ? 'bg-white text-purple-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {minutes}m
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="text-center text-white/80">
            <p className="text-lg">
              {isRunning ? 'Focus time in progress...' : 'Ready to start focusing?'}
            </p>
            {isMusicPlaying && (
              <p className="text-sm mt-2">🎵 Background music playing</p>
            )}
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={() => setIsMusicPlaying(false)}
      >
        <source src="https://www.soundjay.com/misc/sounds/rain-01.mp3" type="audio/mpeg" />
        <source src="https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Podington_Bear/Solo_Piano/Podington_Bear_-_Lament.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
