
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { audioService, ambientSounds } from '@/utils/audioService';
import { AudioWaveVisualizer } from '@/components/AudioWaveVisualizer';

interface FocusScreenProps {
  onBack: () => void;
}

export const FocusScreen: React.FC<FocusScreenProps> = ({ onBack }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSound, setSelectedSound] = useState('ocean');
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewSound, setPreviewSound] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<'focus' | 'short' | 'long'>('focus');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const sessionTimes = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Session finished
      setIsRunning(false);
      audioService.stopSound();
      setIsAudioPlaying(false);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((sessionTimes[sessionType] - timeLeft) / sessionTimes[sessionType]) * 100;

  const toggleTimer = async () => {
    if (!isRunning) {
      // Start session
      const sound = ambientSounds.find(s => s.id === selectedSound);
      if (sound) {
        await audioService.playSound(sound, true);
        setIsAudioPlaying(true);
      }
    } else {
      // Pause session
      audioService.stopSound();
      setIsAudioPlaying(false);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionTimes[sessionType]);
    audioService.stopSound();
    setIsAudioPlaying(false);
  };

  const previewAudio = async (soundId: string) => {
    if (previewSound === soundId && isPreviewPlaying) {
      audioService.stopSound();
      setIsPreviewPlaying(false);
      setPreviewSound(null);
    } else {
      const sound = ambientSounds.find(s => s.id === soundId);
      if (sound) {
        await audioService.playSound(sound, false, 3000); // 3 second preview
        setIsPreviewPlaying(true);
        setPreviewSound(soundId);
        setTimeout(() => {
          setIsPreviewPlaying(false);
          setPreviewSound(null);
        }, 3000);
      }
    }
  };

  const changeSessionType = (type: 'focus' | 'short' | 'long') => {
    setSessionType(type);
    setTimeLeft(sessionTimes[type]);
    setIsRunning(false);
    audioService.stopSound();
    setIsAudioPlaying(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 transition-colors duration-200">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        
        {/* Session Type Selector */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
          {[
            { key: 'focus', label: 'Focus', time: '25m' },
            { key: 'short', label: 'Short Break', time: '5m' },
            { key: 'long', label: 'Long Break', time: '15m' }
          ].map((session) => (
            <button
              key={session.key}
              onClick={() => changeSessionType(session.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                sessionType === session.key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              <div>{session.label}</div>
              <div className="text-xs opacity-75">{session.time}</div>
            </button>
          ))}
        </div>

        {/* Timer Circle */}
        <div className="relative mb-8">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="text-blue-500 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-800 dark:text-gray-200">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={toggleTimer}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:from-blue-600 hover:to-purple-700 transition-all hover:scale-105 shadow-lg"
          >
            {isRunning ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </button>
          
          <button
            onClick={resetTimer}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Ambient Sounds */}
        <div className="w-full max-w-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center flex items-center justify-center space-x-2">
            <Volume2 className="w-5 h-5" />
            <span>Ambient Sounds</span>
            {isAudioPlaying && <AudioWaveVisualizer isPlaying={isAudioPlaying} />}
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {ambientSounds.map((sound) => (
              <div
                key={sound.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedSound === sound.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-400'
                }`}
                onClick={() => setSelectedSound(sound.id)}
              >
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {sound.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    previewAudio(sound.id);
                  }}
                  className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  {previewSound === sound.id && isPreviewPlaying ? (
                    <>
                      <AudioWaveVisualizer isPlaying={true} className="scale-75" />
                      <span className="text-xs">Playing</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span className="text-xs">Preview</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
