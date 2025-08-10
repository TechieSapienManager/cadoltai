
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkUpcomingEvents();
      const interval = setInterval(checkUpcomingEvents, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  const checkUpcomingEvents = async () => {
    if (!user) return;

    try {
      const now = new Date();
      const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

      // Get events starting in the next 30 minutes
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .gte('event_date', now.toISOString().split('T')[0])
        .lte('event_date', thirtyMinutesFromNow.toISOString().split('T')[0]);

      if (error) throw error;

      for (const event of events || []) {
        const eventDateTime = new Date(`${event.event_date}T${event.start_time}`);
        const timeDiff = eventDateTime.getTime() - now.getTime();
        
        // If event is within 30 minutes, show notification
        if (timeDiff > 0 && timeDiff <= 30 * 60 * 1000) {
          // Simple check to avoid duplicate notifications - use localStorage
          const notificationKey = `notification_${event.id}_${event.event_date}`;
          const alreadySent = localStorage.getItem(notificationKey);

          if (!alreadySent) {
            showEventNotification(event);
            localStorage.setItem(notificationKey, 'true');
          }
        }
      }
    } catch (error) {
      console.error('Error checking upcoming events:', error);
    }
  };

  const showEventNotification = (event: any) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Upcoming Event', {
        body: `${event.title} starts soon`,
        icon: '/favicon.ico'
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  return {
    requestNotificationPermission
  };
};
