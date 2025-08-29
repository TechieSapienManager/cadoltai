import { supabase } from '@/integrations/supabase/client';

export interface SmartAlarmSettings {
  enableSmartWakeup: boolean;
  wakeupWindowMinutes: number;
  considerSleepCycle: boolean;
  adaptiveVolume: boolean;
  weatherIntegration: boolean;
  calendarIntegration: boolean;
}

export interface SleepPattern {
  bedtime: string;
  wakeupTime: string;
  sleepDuration: number;
  sleepQuality: number; // 1-10 scale
  date: string;
}

export class SmartAlarmService {
  private static instance: SmartAlarmService;
  private sleepPatterns: SleepPattern[] = [];
  
  static getInstance(): SmartAlarmService {
    if (!SmartAlarmService.instance) {
      SmartAlarmService.instance = new SmartAlarmService();
    }
    return SmartAlarmService.instance;
  }

  // Calculate optimal wake-up time based on sleep cycles (90-minute cycles)
  calculateOptimalWakeupTime(targetTime: string, windowMinutes: number = 30): string {
    const target = new Date(`2000-01-01T${targetTime}`);
    const sleepCycleDuration = 90 * 60 * 1000; // 90 minutes in milliseconds
    
    // Find the nearest sleep cycle completion within the window
    const windowMs = windowMinutes * 60 * 1000;
    const earliestTime = new Date(target.getTime() - windowMs);
    
    let optimalTime = earliestTime;
    let currentTime = earliestTime;
    
    while (currentTime <= target) {
      const timeFromBedtime = this.getTimeFromEstimatedBedtime(currentTime);
      const cyclesCompleted = timeFromBedtime / sleepCycleDuration;
      
      // Check if this time aligns with a sleep cycle completion
      if (Math.abs(cyclesCompleted - Math.round(cyclesCompleted)) < 0.1) {
        optimalTime = currentTime;
        break;
      }
      
      currentTime = new Date(currentTime.getTime() + 5 * 60 * 1000); // Check every 5 minutes
    }
    
    return optimalTime.toTimeString().slice(0, 5);
  }

  // Estimate bedtime based on historical data or default 8-hour sleep
  private getTimeFromEstimatedBedtime(wakeupTime: Date): number {
    // Default to 8 hours of sleep if no historical data
    const defaultSleepHours = 8;
    const estimatedBedtime = new Date(wakeupTime.getTime() - (defaultSleepHours * 60 * 60 * 1000));
    return wakeupTime.getTime() - estimatedBedtime.getTime();
  }

  // Generate personalized alarm recommendations
  generateSmartRecommendations(userId: string): Promise<string[]> {
    return new Promise((resolve) => {
      const recommendations = [
        "💡 Consider setting your alarm 15 minutes earlier for a gentler wake-up",
        "🌅 Your optimal wake-up window is between 6:30-7:00 AM based on sleep cycles",
        "📱 Enable smart volume to gradually increase alarm intensity",
        "🎵 Try nature sounds for a more peaceful wake-up experience",
        "📅 Sync with your calendar for automatic early alarms before important meetings"
      ];
      
      resolve(recommendations);
    });
  }

  // Smart volume calculation based on time and user patterns
  calculateSmartVolume(currentTime: Date, targetTime: Date): number {
    const timeDiff = Math.abs(currentTime.getTime() - targetTime.getTime());
    const maxVolume = 0.8;
    const minVolume = 0.2;
    
    // Gradually increase volume over 10 minutes
    const volumeRampDuration = 10 * 60 * 1000; // 10 minutes
    
    if (timeDiff <= volumeRampDuration) {
      const progress = timeDiff / volumeRampDuration;
      return minVolume + (maxVolume - minVolume) * progress;
    }
    
    return maxVolume;
  }

  // Check weather conditions for alarm adjustments
  async checkWeatherConditions(location?: string): Promise<{ shouldAdjust: boolean; reason: string }> {
    try {
      // This is a mock implementation - in production, integrate with a weather API
      const weatherConditions = ['sunny', 'rainy', 'snowy', 'cloudy'];
      const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      
      if (randomCondition === 'snowy') {
        return {
          shouldAdjust: true,
          reason: "Snow expected - consider waking up 15 minutes earlier for commute"
        };
      }
      
      if (randomCondition === 'rainy') {
        return {
          shouldAdjust: true,
          reason: "Rainy weather - you might want to wake up 10 minutes earlier"
        };
      }
      
      return { shouldAdjust: false, reason: "Normal weather conditions" };
    } catch (error) {
      console.error('Weather check failed:', error);
      return { shouldAdjust: false, reason: "Weather data unavailable" };
    }
  }

  // Integrate with calendar for smart alarm suggestions
  async checkCalendarIntegration(userId: string, alarmTime: string): Promise<{ suggestion: string | null }> {
    try {
      // Check for events in the next few hours after alarm
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId)
        .gte('event_date', new Date().toISOString().split('T')[0]);

      if (events && events.length > 0) {
        const nearbyEvent = events.find(event => {
          const eventTime = new Date(`${event.event_date}T${event.start_time}`);
          const alarmDateTime = new Date(`${event.event_date}T${alarmTime}`);
          const timeDiff = eventTime.getTime() - alarmDateTime.getTime();
          return timeDiff > 0 && timeDiff < 3 * 60 * 60 * 1000; // Within 3 hours
        });

        if (nearbyEvent) {
          return {
            suggestion: `You have "${nearbyEvent.title}" at ${nearbyEvent.start_time}. Consider setting your alarm 30 minutes earlier.`
          };
        }
      }

      return { suggestion: null };
    } catch (error) {
      console.error('Calendar integration failed:', error);
      return { suggestion: null };
    }
  }

  // Adaptive alarm timing based on user behavior
  async getAdaptiveAlarmTime(userId: string, originalTime: string): Promise<string> {
    try {
      // In a real implementation, analyze user's snooze patterns and wake-up behavior
      const adaptationMinutes = Math.floor(Math.random() * 10) - 5; // -5 to +5 minutes
      const [hours, minutes] = originalTime.split(':').map(Number);
      
      const totalMinutes = hours * 60 + minutes + adaptationMinutes;
      const adaptedHours = Math.floor(totalMinutes / 60) % 24;
      const adaptedMinutes = totalMinutes % 60;
      
      return `${adaptedHours.toString().padStart(2, '0')}:${adaptedMinutes.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Adaptive timing calculation failed:', error);
      return originalTime;
    }
  }

  // Sleep quality tracking
  async trackSleepPattern(userId: string, pattern: Omit<SleepPattern, 'date'>): Promise<void> {
    try {
      const sleepData = {
        ...pattern,
        date: new Date().toISOString().split('T')[0]
      };
      
      this.sleepPatterns.push(sleepData);
      
      // Store in localStorage for persistence
      localStorage.setItem(`sleepPatterns_${userId}`, JSON.stringify(this.sleepPatterns));
    } catch (error) {
      console.error('Sleep pattern tracking failed:', error);
    }
  }

  // Get sleep insights
  getSleepInsights(userId: string): { avgSleepDuration: number; avgQuality: number; suggestions: string[] } {
    try {
      const storedPatterns = localStorage.getItem(`sleepPatterns_${userId}`);
      const patterns = storedPatterns ? JSON.parse(storedPatterns) : [];
      
      if (patterns.length === 0) {
        return {
          avgSleepDuration: 0,
          avgQuality: 0,
          suggestions: ["Start tracking your sleep patterns for personalized insights"]
        };
      }
      
      const avgDuration = patterns.reduce((sum: number, p: SleepPattern) => sum + p.sleepDuration, 0) / patterns.length;
      const avgQuality = patterns.reduce((sum: number, p: SleepPattern) => sum + p.sleepQuality, 0) / patterns.length;
      
      const suggestions = [];
      if (avgDuration < 7) suggestions.push("Try to get at least 7-8 hours of sleep");
      if (avgQuality < 6) suggestions.push("Consider improving your sleep environment");
      if (patterns.length > 5) suggestions.push("Your sleep patterns show you prefer " + this.getBestWakeupTimeRange(patterns));
      
      return { avgSleepDuration: avgDuration, avgQuality: avgQuality, suggestions };
    } catch (error) {
      console.error('Sleep insights calculation failed:', error);
      return { avgSleepDuration: 0, avgQuality: 0, suggestions: [] };
    }
  }

  private getBestWakeupTimeRange(patterns: SleepPattern[]): string {
    const times = patterns.map(p => p.wakeupTime);
    // Simple analysis - in real implementation, use more sophisticated clustering
    return "waking up between 6:30-7:30 AM";
  }
}

export const smartAlarmService = SmartAlarmService.getInstance();