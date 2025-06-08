
export class NotificationService {
  private static instance: NotificationService;
  private notificationTimeouts: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.requestPermission();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  private playNotificationSound() {
    try {
      // Create a gentle notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(700, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio notification not available');
    }
  }

  scheduleTaskNotification(taskId: string, title: string, scheduledTime: Date) {
    // Schedule notification 30 minutes before
    const notificationTime = new Date(scheduledTime.getTime() - 30 * 60 * 1000);
    const now = new Date();

    if (notificationTime <= now) {
      return; // Don't schedule notifications for past times
    }

    const timeUntilNotification = notificationTime.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      this.showNotification(
        '⏰ Task Reminder',
        `Don't forget: "${title}" is scheduled in 30 minutes!`,
        'task'
      );
      this.notificationTimeouts.delete(taskId);
    }, timeUntilNotification);

    // Clear any existing notification for this task
    this.clearNotification(taskId);
    this.notificationTimeouts.set(taskId, timeout);
  }

  scheduleEventNotification(eventId: string, title: string, scheduledTime: Date) {
    // Schedule notification 30 minutes before
    const notificationTime = new Date(scheduledTime.getTime() - 30 * 60 * 1000);
    const now = new Date();

    if (notificationTime <= now) {
      return; // Don't schedule notifications for past times
    }

    const timeUntilNotification = notificationTime.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      this.showNotification(
        '📅 Event Reminder',
        `Upcoming event: "${title}" starts in 30 minutes!`,
        'event'
      );
      this.notificationTimeouts.delete(eventId);
    }, timeUntilNotification);

    // Clear any existing notification for this event
    this.clearNotification(eventId);
    this.notificationTimeouts.set(eventId, timeout);
  }

  private async showNotification(title: string, body: string, type: 'task' | 'event') {
    const hasPermission = await this.requestPermission();
    
    if (hasPermission) {
      this.playNotificationSound();
      
      new Notification(title, {
        body,
        icon: type === 'task' ? '✅' : '📅',
        badge: '/favicon.ico',
        requireInteraction: false,
        silent: false
      });
    }
  }

  clearNotification(id: string) {
    const timeout = this.notificationTimeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.notificationTimeouts.delete(id);
    }
  }

  clearAllNotifications() {
    this.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
    this.notificationTimeouts.clear();
  }
}

export const notificationService = NotificationService.getInstance();
