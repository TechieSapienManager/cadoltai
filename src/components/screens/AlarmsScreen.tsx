
import React, { useState, useEffect } from 'react';
import { Plus, Clock, Volume2, Play, X, Check } from 'lucide-react';
import { audioService, alarmSounds } from '@/utils/audioService';
import { AudioWaveVisualizer } from '@/components/AudioWaveVisualizer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Alarm {
  id: string;
  time: string;
  title: string;
  is_active: boolean;
  days: string[];
  sound_type: string;
  user_id: string;
}

interface AlarmsScreenProps {
  onBack: () => void;
}

export const AlarmsScreen: React.FC<AlarmsScreenProps> = ({ onBack }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewSound, setPreviewSound] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [showSoundSelector, setShowSoundSelector] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAlarm, setNewAlarm] = useState({
    time: '',
    title: '',
    days: [] as string[],
    sound_type: 'default'
  });

  const { user } = useAuth();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    if (user) {
      loadAlarms();
    }
  }, [user]);

  useEffect(() => {
    // Check for alarms every minute
    const interval = setInterval(() => {
      checkAlarms();
    }, 60000);

    return () => clearInterval(interval);
  }, [alarms]);

  const loadAlarms = async () => {
    try {
      const { data, error } = await supabase
        .from('alarms')
        .select('*')
        .eq('user_id', user?.id)
        .order('time', { ascending: true });

      if (error) throw error;
      setAlarms(data || []);
    } catch (error) {
      console.error('Error loading alarms:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAlarms = () => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' });

    alarms.forEach(alarm => {
      if (alarm.is_active && alarm.time === currentTime && alarm.days.includes(currentDay)) {
        triggerAlarm(alarm);
      }
    });
  };

  const triggerAlarm = async (alarm: Alarm) => {
    const sound = alarmSounds.find(s => s.id === alarm.sound_type);
    if (sound) {
      await audioService.playSound(sound, false, 30000); // Play for 30 seconds
      // Show alarm notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Alarm: ${alarm.title}`, {
          body: `Time: ${alarm.time}`,
          icon: '/lovable-uploads/0979893b-0c4d-40b7-a3d1-e69a16dc5c50.png'
        });
      }
    }
  };

  const toggleAlarm = async (id: string) => {
    try {
      const alarm = alarms.find(a => a.id === id);
      if (!alarm) return;

      const { error } = await supabase
        .from('alarms')
        .update({ is_active: !alarm.is_active })
        .eq('id', id);

      if (error) throw error;
      
      setAlarms(prev => prev.map(alarm => 
        alarm.id === id ? { ...alarm, is_active: !alarm.is_active } : alarm
      ));
    } catch (error) {
      console.error('Error toggling alarm:', error);
    }
  };

  const updateAlarmSound = async (alarmId: string, soundId: string) => {
    try {
      const { error } = await supabase
        .from('alarms')
        .update({ sound_type: soundId })
        .eq('id', alarmId);

      if (error) throw error;

      setAlarms(prev => prev.map(alarm => 
        alarm.id === alarmId ? { ...alarm, sound_type: soundId } : alarm
      ));
      setShowSoundSelector(null);
    } catch (error) {
      console.error('Error updating alarm sound:', error);
    }
  };

  const addAlarm = async () => {
    if (!newAlarm.time || !newAlarm.title || newAlarm.days.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('alarms')
        .insert({
          time: newAlarm.time,
          title: newAlarm.title,
          days: newAlarm.days,
          sound_type: newAlarm.sound_type,
          user_id: user?.id,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setAlarms(prev => [...prev, data]);
      setShowAddModal(false);
      setNewAlarm({
        time: '',
        title: '',
        days: [],
        sound_type: 'default'
      });
    } catch (error) {
      console.error('Error adding alarm:', error);
    }
  };

  const deleteAlarm = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alarms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAlarms(prev => prev.filter(alarm => alarm.id !== id));
    } catch (error) {
      console.error('Error deleting alarm:', error);
    }
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

  const toggleDay = (day: string) => {
    setNewAlarm(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 transition-colors duration-200">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

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
              const selectedSound = alarmSounds.find(s => s.id === alarm.sound_type);
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
                            {alarm.title}
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
                                        alarm.sound_type === sound.id
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

                    <div className="flex items-center space-x-2">
                      {/* Delete Button */}
                      <button
                        onClick={() => deleteAlarm(alarm.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Toggle Switch */}
                      <button
                        onClick={() => toggleAlarm(alarm.id)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          alarm.is_active ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            alarm.is_active ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Alarm FAB */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all hover:scale-110"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Add Alarm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Add New Alarm</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Time Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={newAlarm.time}
                  onChange={(e) => setNewAlarm(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={newAlarm.title}
                  onChange={(e) => setNewAlarm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Alarm label"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>

              {/* Days Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Repeat Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        newAlarm.days.includes(day)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sound
                </label>
                <select
                  value={newAlarm.sound_type}
                  onChange={(e) => setNewAlarm(prev => ({ ...prev, sound_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {alarmSounds.map((sound) => (
                    <option key={sound.id} value={sound.id}>
                      {sound.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addAlarm}
                  disabled={!newAlarm.time || !newAlarm.title || newAlarm.days.length === 0}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Add Alarm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
