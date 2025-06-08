
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
          // Check if notification already sent
          const { data: existingNotification } = await supabase
            .from('notifications')
            .select('*')
            .eq('event_id', event.id)
            .eq('sent', true)
            .single();

          if (!existingNotification) {
            showEventNotification(event);
            
            // Mark notification as sent
            await supabase
              .from('notifications')
              .insert({
                user_id: user.id,
                event_id: event.id,
                title: 'Upcoming Event',
                message: `${event.title} starts in ${Math.round(timeDiff / 60000)} minutes`,
                scheduled_for: now.toISOString(),
                sent: true
              });
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
