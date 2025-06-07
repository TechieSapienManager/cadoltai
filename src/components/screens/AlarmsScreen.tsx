
import React, { useState, useEffect } from 'react';
import { Plus, Clock, Volume2, Trash2, Edit2, Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { audioService, alarmSounds } from '@/utils/audioService';

interface AlarmsScreenProps {
  onBack: () => void;
}

interface Alarm {
  id: string;
  title: string;
  time: string;
  days: string[];
  is_active: boolean;
  sound_type: string;
  created_at: string;
}

export const AlarmsScreen: React.FC<AlarmsScreenProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [newAlarm, setNewAlarm] = useState({
    title: '',
    time: '',
    days: [] as string[],
    sound_type: 'default'
  });

  const daysOfWeek = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  const loadAlarms = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alarms')
        .select('*')
        .eq('user_id', user.id)
        .order('time', { ascending: true });

      if (error) throw error;
      setAlarms(data || []);
    } catch (error) {
      console.error('Error loading alarms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlarms();
  }, [user]);

  const handleCreateAlarm = async () => {
    if (!newAlarm.title.trim() || !newAlarm.time || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('alarms')
        .insert({
          user_id: user.id,
          title: newAlarm.title,
          time: newAlarm.time,
          days: newAlarm.days,
          sound_type: newAlarm.sound_type,
          is_active: true
        });

      if (error) throw error;

      setShowCreateModal(false);
      setNewAlarm({ title: '', time: '', days: [], sound_type: 'default' });
      loadAlarms();
    } catch (error) {
      console.error('Error creating alarm:', error);
      alert('Failed to create alarm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAlarm = async () => {
    if (!editingAlarm || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('alarms')
        .update({
          title: editingAlarm.title,
          time: editingAlarm.time,
          days: editingAlarm.days,
          sound_type: editingAlarm.sound_type,
          is_active: editingAlarm.is_active
        })
        .eq('id', editingAlarm.id);

      if (error) throw error;

      setEditingAlarm(null);
      loadAlarms();
    } catch (error) {
      console.error('Error updating alarm:', error);
      alert('Failed to update alarm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlarm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alarm?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('alarms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadAlarms();
    } catch (error) {
      console.error('Error deleting alarm:', error);
      alert('Failed to delete alarm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAlarmActive = async (alarm: Alarm) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('alarms')
        .update({ is_active: !alarm.is_active })
        .eq('id', alarm.id);

      if (error) throw error;
      loadAlarms();
    } catch (error) {
      console.error('Error toggling alarm:', error);
      alert('Failed to update alarm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day: string, isEditing = false) => {
    if (isEditing && editingAlarm) {
      const updatedDays = editingAlarm.days.includes(day)
        ? editingAlarm.days.filter(d => d !== day)
        : [...editingAlarm.days, day];
      setEditingAlarm({ ...editingAlarm, days: updatedDays });
    } else {
      const updatedDays = newAlarm.days.includes(day)
        ? newAlarm.days.filter(d => d !== day)
        : [...newAlarm.days, day];
      setNewAlarm({ ...newAlarm, days: updatedDays });
    }
  };

  const previewSound = async (soundType: string) => {
    try {
      if (playingSound === soundType) {
        audioService.stopSound();
        setPlayingSound(null);
      } else {
        const sound = alarmSounds.find(s => s.id === soundType);
        if (sound) {
          console.log('Playing alarm sound preview:', sound.name);
          await audioService.playSound(sound, false, 2000); // 2 second preview
          setPlayingSound(soundType);
          setTimeout(() => {
            setPlayingSound(null);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error playing sound preview:', error);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDays = (days: string[]) => {
    if (days.length === 0) return 'One time';
    if (days.length === 7) return 'Every day';
    return days.map(day => day.slice(0, 3)).join(', ');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="p-4">
        {loading && alarms.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading alarms...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-2 transition-all ${
                  alarm.is_active 
                    ? 'border-blue-500 dark:border-blue-400' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                          {alarm.title}
                        </h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatTime(alarm.time)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDays(alarm.days)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Sound: {alarmSounds.find(s => s.id === alarm.sound_type)?.name || 'Default'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => previewSound(alarm.sound_type)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Preview sound"
                    >
                      {playingSound === alarm.sound_type ? (
                        <Pause className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setEditingAlarm(alarm)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteAlarm(alarm.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                    
                    <button
                      onClick={() => toggleAlarmActive(alarm)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        alarm.is_active 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        alarm.is_active ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {alarms.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No alarms set. Create your first alarm to get started.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Alarm FAB */}
      <button 
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Create Alarm Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Create New Alarm
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newAlarm.title}
                  onChange={(e) => setNewAlarm({ ...newAlarm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Alarm title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={newAlarm.time}
                  onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Repeat Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.key}
                      onClick={() => handleDayToggle(day.key)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        newAlarm.days.includes(day.key)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alarm Sound
                </label>
                <div className="space-y-2">
                  {alarmSounds.map((sound) => (
                    <div
                      key={sound.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        newAlarm.sound_type === sound.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                      }`}
                      onClick={() => setNewAlarm({ ...newAlarm, sound_type: sound.id })}
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {sound.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          previewSound(sound.id);
                        }}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {playingSound === sound.id ? (
                          <Pause className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Play className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAlarm}
                  disabled={!newAlarm.title.trim() || !newAlarm.time || loading}
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Alarm Modal */}
      {editingAlarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Edit Alarm
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editingAlarm.title}
                  onChange={(e) => setEditingAlarm({ ...editingAlarm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Alarm title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={editingAlarm.time}
                  onChange={(e) => setEditingAlarm({ ...editingAlarm, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Repeat Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.key}
                      onClick={() => handleDayToggle(day.key, true)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        editingAlarm.days.includes(day.key)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alarm Sound
                </label>
                <div className="space-y-2">
                  {alarmSounds.map((sound) => (
                    <div
                      key={sound.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        editingAlarm.sound_type === sound.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                      }`}
                      onClick={() => setEditingAlarm({ ...editingAlarm, sound_type: sound.id })}
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {sound.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          previewSound(sound.id);
                        }}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {playingSound === sound.id ? (
                          <Pause className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Play className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setEditingAlarm(null)}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAlarm}
                  disabled={!editingAlarm.title.trim() || !editingAlarm.time || loading}
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
