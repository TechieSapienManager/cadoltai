
import React from 'react';

interface AudioWaveVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({ 
  isPlaying, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-purple-500 rounded-full transition-all duration-300 ${
            isPlaying 
              ? 'h-4 animate-pulse' 
              : 'h-2'
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};
