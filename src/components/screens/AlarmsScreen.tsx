
import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';

interface AlarmsScreenProps {
  onBack: () => void;
}

export const AlarmsScreen: React.FC<AlarmsScreenProps> = ({ onBack }) => {
  const [alarms, setAlarms] = useState([
    {
      id: 1,
      time: '6:30 AM',
      label: 'Morning Workout',
      enabled: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    {
      id: 2,
      time: '8:00 AM',
      label: 'Work Start',
      enabled: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    },
    {
      id: 3,
      time: '10:00 PM',
      label: 'Sleep Time',
      enabled: false,
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  ]);

  const toggleAlarm = (id: number) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
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
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
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
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleAlarm(alarm.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      alarm.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
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
            ))}
          </div>
        )}
      </div>

      {/* Add Alarm FAB */}
      <button className="fixed bottom-20 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};
