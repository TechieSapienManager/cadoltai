
import React, { useState, useEffect } from 'react';
import { Plus, Clock, Volume2, Play } from 'lucide-react';
import { audioService, alarmSounds } from '@/utils/audioService';
import { AudioWaveVisualizer } from '@/components/AudioWaveVisualizer';

interface Alarm {
  id: number;
  time: string;
  label: string;
  enabled: boolean;
  days: string[];
  soundId: string;
}

interface AlarmsScreenProps {
  onBack: () => void;
}

export const AlarmsScreen: React.FC<AlarmsScreenProps> = ({ onBack }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: 1,
      time: '6:30 AM',
      label: 'Morning Workout',
      enabled: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      soundId: 'classic'
    },
    {
      id: 2,
      time: '8:00 AM',
      label: 'Work Start',
      enabled: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      soundId: 'beep'
    },
    {
      id: 3,
      time: '10:00 PM',
      label: 'Sleep Time',
      enabled: false,
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      soundId: 'morning'
    }
  ]);

  const [previewSound, setPreviewSound] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [showSoundSelector, setShowSoundSelector] = useState<number | null>(null);

  useEffect(() => {
    // Check for alarms every minute
    const interval = setInterval(() => {
      checkAlarms();
    }, 60000);

    return () => clearInterval(interval);
  }, [alarms]);

  const checkAlarms = () => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' });

    alarms.forEach(alarm => {
      if (alarm.enabled && alarm.time === currentTime && alarm.days.includes(currentDay)) {
        triggerAlarm(alarm);
      }
    });
  };

  const triggerAlarm = async (alarm: Alarm) => {
    const sound = alarmSounds.find(s => s.id === alarm.soundId);
    if (sound) {
      await audioService.playSound(sound, false, 30000); // Play for 30 seconds
      // Show alarm notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Alarm: ${alarm.label}`, {
          body: `Time: ${alarm.time}`,
          icon: '/lovable-uploads/dcde5e95-fc3e-4fcf-b71a-2c7767551ce1.png'
        });
      }
    }
  };

  const toggleAlarm = (id: number) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const updateAlarmSound = (alarmId: number, soundId: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === alarmId ? { ...alarm, soundId } : alarm
    ));
    setShowSoundSelector(null);
  };

  const previewAlarmSound = async (soundId: string) => {
    if (previewSound === soundId && isPreviewPlaying) {
      audioService.stopSound();
      setIsPreviewPlaying(false);
      setPreviewSound(null);
    } else {
      const sound = alarmSounds.find(s => s.id === soundId);
      if (sound) {
        await audioService.playSound(sound, false, 2000); // 2 second preview
        setIsPreviewPlaying(true);
        setPreviewSound(soundId);
        setTimeout(() => {
          setIsPreviewPlaying(false);
          setPreviewSound(null);
        }, 2000);
      }
    }
  };

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 transition-colors duration-200">
      <div className="p-4">
        {alarms.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No alarms yet. Tap '+' to add one.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alarms.map((alarm) => {
              const selectedSound = alarmSounds.find(s => s.id === alarm.soundId);
              return (
                <div
                  key={alarm.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            {alarm.time}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {alarm.label}
                          </p>
                          <div className="flex space-x-1 mt-2">
                            {alarm.days.map((day) => (
                              <span
                                key={day}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs rounded"
                              >
                                {day}
                              </span>
                            ))}
                          </div>
                          
                          {/* Sound Selection */}
                          <div className="mt-3">
                            <button
                              onClick={() => setShowSoundSelector(showSoundSelector === alarm.id ? null : alarm.id)}
                              className="flex items-center space-x-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                            >
                              <Volume2 className="w-4 h-4" />
                              <span>{selectedSound?.name || 'Select Sound'}</span>
                            </button>
                            
                            {showSoundSelector === alarm.id && (
                              <div className="mt-2 space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                {alarmSounds.map((sound) => (
                                  <div
                                    key={sound.id}
                                    className="flex items-center justify-between"
                                  >
                                    <button
                                      onClick={() => updateAlarmSound(alarm.id, sound.id)}
                                      className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors ${
                                        alarm.soundId === sound.id
                                          ? 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300'
                                          : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                                      }`}
                                    >
                                      {sound.name}
                                    </button>
                                    <button
                                      onClick={() => previewAlarmSound(sound.id)}
                                      className="ml-2 p-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                    >
                                      {previewSound === sound.id && isPreviewPlaying ? (
                                        <AudioWaveVisualizer isPlaying={true} className="scale-75" />
                                      ) : (
                                        <Play className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        alarm.enabled ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          alarm.enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Alarm FAB */}
      <button className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all hover:scale-110">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};
