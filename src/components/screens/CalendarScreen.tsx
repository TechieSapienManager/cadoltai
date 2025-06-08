
import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { EventModal } from '@/components/EventModal';
import { notificationService } from '@/utils/notificationService';
import 'react-day-picker/dist/style.css';

interface CalendarScreenProps {
  onBack: () => void;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  start_time: string;
  duration_minutes?: number;
  location?: string;
  color?: string;
  reminder_minutes?: number;
  repeat_type?: string;
  created_at: string;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const loadEvents = async () => {
    if (!user || !selectedDate) return;

    setLoading(true);
    try {
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(selectedDate);
      endDate.setDate(selectedDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .gte('event_date', startDate.toISOString().split('T')[0])
        .lt('event_date', endDate.toISOString().split('T')[0])
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [selectedDate, user]);

  const handleEventCreated = async () => {
    setShowEventModal(false);
    setEditingEvent(null);
    loadEvents();
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      // Clear any scheduled notification
      notificationService.clearNotification(eventId);
      
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const getEventsForDate = (date: Date) => {
    if (!date) return [];
    return events.filter(event => event.event_date === date.toISOString().split('T')[0]);
  };

  const getDaysWithEvents = () => {
    return events.map(event => new Date(event.event_date));
  };

  const handleDateSelect = (date: Date | undefined) => {
    // Ensure we always have a valid Date object
    if (date) {
      setSelectedDate(date);
    }
  };

  const modifiers = {
    highlighted: getDaysWithEvents(),
  };

  const modifiersStyles = {
    highlighted: {
      backgroundColor: 'rgba(168, 85, 247, 0.2)',
      color: '#8B5CF6',
    },
  };

  // Ensure selectedDate is never null/undefined for display
  const displayDate = selectedDate || new Date();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="container mx-auto px-4">
        {/* Calendar */}
        <div className="mb-8">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            classNames={{
              head_cell: "text-center text-gray-500 dark:text-gray-400 font-medium py-2",
              day: "py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              day_selected: "bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50",
              day_today: "font-semibold",
              nav_button: "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
              nav_button_previous: "absolute top-1/2 left-2 transform -translate-y-1/2 p-1 rounded-full",
              nav_button_next: "absolute top-1/2 right-2 transform -translate-y-1/2 p-1 rounded-full",
            }}
            components={{
              IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5" />,
              IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5" />,
            }}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
          />
        </div>

        {/* Events for Selected Date */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Events for {displayDate.toLocaleDateString()}
          </h2>
          {loading ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading events...</div>
          ) : (
            <div>
              {getEventsForDate(displayDate).length > 0 ? (
                <ul className="space-y-4">
                  {getEventsForDate(displayDate).map(event => (
                    <li
                      key={event.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          {event.color && (
                            <span
                              className="block w-2 h-2 rounded-full"
                              style={{ backgroundColor: event.color }}
                            ></span>
                          )}
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{event.title}</h3>
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.start_time}</span>
                          {event.duration_minutes && <span>({event.duration_minutes} minutes)</span>}
                        </div>
                        {event.location && (
                          <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingEvent(event);
                            setShowEventModal(true);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">No events for this date.</div>
              )}
            </div>
          )}
        </div>

        {/* Add Event Button */}
        <button
          onClick={() => setShowEventModal(true)}
          className="fixed bottom-20 right-6 w-14 h-14 bg-purple-500 rounded-full shadow-lg flex items-center justify-center hover:bg-purple-600 transition-all hover:scale-110 text-white"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Event Modal */}
        <EventModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          selectedDate={displayDate}
          onEventCreated={handleEventCreated}
        />
      </div>
    </div>
  );
};
