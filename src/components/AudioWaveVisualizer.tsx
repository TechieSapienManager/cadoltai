
import React from 'react';

interface AudioWaveVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({ 
  isPlaying, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-300 ${
            isPlaying 
              ? 'animate-pulse h-6' 
              : 'h-2'
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isPlaying ? `${Math.random() * 20 + 10}px` : '8px'
          }}
        />
      ))}
    </div>
  );
};
