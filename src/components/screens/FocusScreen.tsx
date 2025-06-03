
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface FocusScreenProps {
  onBack: () => void;
}

export const FocusScreen: React.FC<FocusScreenProps> = ({ onBack }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSound, setSelectedSound] = useState('none');

  const sounds = [
    { id: 'none', name: 'Silent', icon: '🔇' },
    { id: 'rain', name: 'Rain', icon: '🌧️' },
    { id: 'forest', name: 'Forest', icon: '🌲' },
    { id: 'ocean', name: 'Ocean', icon: '🌊' },
    { id: 'whitenoise', name: 'White Noise', icon: '📻' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  const adjustTime = (minutes: number) => {
    if (!isRunning) {
      setTimeLeft(Math.max(0, timeLeft + minutes * 60));
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        
        {/* Timer Circle */}
        <div className="relative mb-8">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
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
          
          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-800 dark:text-gray-200">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => adjustTime(-5)}
            disabled={isRunning}
            className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -5
          </button>
          
          <button
            onClick={toggleTimer}
            className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-all hover:scale-105 shadow-lg"
          >
            {isRunning ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </button>
          
          <button
            onClick={() => adjustTime(5)}
            disabled={isRunning}
            className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +5
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetTimer}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all mb-8"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        {/* Ambient Sounds */}
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
            Ambient Sounds
          </h3>
          <div className="flex justify-center space-x-4 overflow-x-auto pb-2">
            {sounds.map((sound) => (
              <button
                key={sound.id}
                onClick={() => setSelectedSound(sound.id)}
                className={`flex-shrink-0 w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all ${
                  selectedSound === sound.id
                    ? 'bg-blue-500 text-white border-2 border-blue-600 shadow-lg scale-110'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500'
                }`}
              >
                <span className="text-xl">{sound.icon}</span>
                <span className="text-xs mt-1">{sound.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Focus Tasks */}
        <div className="w-full max-w-md mt-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Focus Tasks</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="w-4 h-4 text-blue-500 rounded border-gray-300" />
              <span className="text-gray-600 dark:text-gray-400">Review project proposal</span>
            </div>
            <div className="flex items-center space-x-3">
              <input type="checkbox" className="w-4 h-4 text-blue-500 rounded border-gray-300" />
              <span className="text-gray-600 dark:text-gray-400">Update presentation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
