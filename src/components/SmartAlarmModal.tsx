import React, { useState, useEffect } from 'react';
import { Brain, Clock, TrendingUp, Calendar, Cloud, Volume2, X } from 'lucide-react';
import { smartAlarmService, SmartAlarmSettings } from '@/utils/smartAlarmService';
import { useAuth } from '@/hooks/useAuth';

interface SmartAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  alarmTime: string;
  onOptimize: (optimizedTime: string) => void;
}

export const SmartAlarmModal: React.FC<SmartAlarmModalProps> = ({
  isOpen,
  onClose,
  alarmTime,
  onOptimize
}) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SmartAlarmSettings>({
    enableSmartWakeup: true,
    wakeupWindowMinutes: 30,
    considerSleepCycle: true,
    adaptiveVolume: true,
    weatherIntegration: false,
    calendarIntegration: true
  });
  
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [optimalTime, setOptimalTime] = useState<string>('');
  const [weatherSuggestion, setWeatherSuggestion] = useState<string>('');
  const [calendarSuggestion, setCalendarSuggestion] = useState<string>('');
  const [sleepInsights, setSleepInsights] = useState<{ avgSleepDuration: number; avgQuality: number; suggestions: string[] }>({
    avgSleepDuration: 0,
    avgQuality: 0,
    suggestions: []
  });

  useEffect(() => {
    if (isOpen && user) {
      loadSmartData();
    }
  }, [isOpen, user, alarmTime]);

  const loadSmartData = async () => {
    if (!user) return;

    try {
      // Load recommendations
      const recs = await smartAlarmService.generateSmartRecommendations(user.id);
      setRecommendations(recs);

      // Calculate optimal time
      if (settings.considerSleepCycle) {
        const optimal = smartAlarmService.calculateOptimalWakeupTime(alarmTime, settings.wakeupWindowMinutes);
        setOptimalTime(optimal);
      }

      // Check weather
      if (settings.weatherIntegration) {
        const weatherData = await smartAlarmService.checkWeatherConditions();
        if (weatherData.shouldAdjust) {
          setWeatherSuggestion(weatherData.reason);
        }
      }

      // Check calendar
      if (settings.calendarIntegration) {
        const calendarData = await smartAlarmService.checkCalendarIntegration(user.id, alarmTime);
        if (calendarData.suggestion) {
          setCalendarSuggestion(calendarData.suggestion);
        }
      }

      // Get sleep insights
      const insights = smartAlarmService.getSleepInsights(user.id);
      setSleepInsights(insights);
    } catch (error) {
      console.error('Error loading smart alarm data:', error);
    }
  };

  const handleOptimize = async () => {
    if (!user) return;
    
    let finalTime = alarmTime;
    
    if (settings.enableSmartWakeup && optimalTime) {
      finalTime = optimalTime;
    } else if (settings.considerSleepCycle) {
      finalTime = await smartAlarmService.getAdaptiveAlarmTime(user.id, alarmTime);
    }
    
    onOptimize(finalTime);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Smart Alarm Assistant
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Current vs Optimal Time */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Time</span>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{alarmTime}</span>
          </div>
          {optimalTime && optimalTime !== alarmTime && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Optimal Time</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{optimalTime}</span>
            </div>
          )}
        </div>

        {/* Smart Settings */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Smart Features</h3>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Smart Wake-up Window</span>
                  <p className="text-xs text-gray-500">Find optimal time within sleep cycles</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableSmartWakeup}
                onChange={(e) => setSettings({...settings, enableSmartWakeup: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Adaptive Volume</span>
                  <p className="text-xs text-gray-500">Gradually increase alarm volume</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.adaptiveVolume}
                onChange={(e) => setSettings({...settings, adaptiveVolume: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Calendar Integration</span>
                  <p className="text-xs text-gray-500">Adjust for upcoming events</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.calendarIntegration}
                onChange={(e) => setSettings({...settings, calendarIntegration: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Cloud className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Weather Adaptation</span>
                  <p className="text-xs text-gray-500">Adjust for weather conditions</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.weatherIntegration}
                onChange={(e) => setSettings({...settings, weatherIntegration: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Suggestions */}
        {(weatherSuggestion || calendarSuggestion || recommendations.length > 0) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">AI Suggestions</h3>
            <div className="space-y-2">
              {weatherSuggestion && (
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Cloud className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">{weatherSuggestion}</p>
                </div>
              )}
              
              {calendarSuggestion && (
                <div className="flex items-start space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Calendar className="w-4 h-4 text-green-600 mt-0.5" />
                  <p className="text-sm text-green-800 dark:text-green-200">{calendarSuggestion}</p>
                </div>
              )}
              
              {recommendations.slice(0, 2).map((rec, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Brain className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sleep Insights */}
        {sleepInsights.suggestions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Sleep Insights</h3>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-4 mb-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Sleep Quality Tracking</span>
                  {sleepInsights.avgSleepDuration > 0 && (
                    <p className="text-xs text-gray-500">Avg: {sleepInsights.avgSleepDuration.toFixed(1)}h, Quality: {sleepInsights.avgQuality.toFixed(1)}/10</p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                {sleepInsights.suggestions.slice(0, 2).map((suggestion, index) => (
                  <p key={index} className="text-sm text-purple-800 dark:text-purple-200">• {suggestion}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Keep Original
          </button>
          <button
            onClick={handleOptimize}
            className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Optimize Alarm
          </button>
        </div>
      </div>
    </div>
  );
};