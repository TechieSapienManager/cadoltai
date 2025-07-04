import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { EventModal } from '@/components/EventModal';
import { EventDeleteModal } from '@/components/EventDeleteModal';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useFeatureLimit } from '@/hooks/useFeatureLimit';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useNotifications } from '@/hooks/useNotifications';

interface CalendarScreenProps {
  onBack: () => void;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  start_time: string;
  duration_minutes: number;
  color: string;
  location?: string;
  reminder_minutes: number;
  repeat_type: string;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { checkLimit, showUpgradeModal, setShowUpgradeModal, handleUpgrade, incrementCount, decrementCount } = useFeatureLimit('events', 'events');
  const { requestNotificationPermission } = useNotifications();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [clickedDate, setClickedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const loadEvents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true });

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
    requestNotificationPermission();
  }, [user]);

  const getEventsForDate = (day: number) => {
    const dateStr = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
      .toISOString().split('T')[0];
    return events.filter(event => event.event_date === dateStr);
  };

  const getMonthEvents = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const startOfMonth = new Date(year, month, 1).toISOString().split('T')[0];
    const endOfMonth = new Date(year, month + 1, 0).toISOString().split('T')[0];
    
    return events.filter(event => 
      event.event_date >= startOfMonth && event.event_date <= endOfMonth
    );
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    setClickedDate(clickedDate);
    setShowCreateModal(true);
  };

  const handleEventCreated = () => {
    loadEvents();
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', selectedEvent.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setShowDeleteModal(false);
      setSelectedEvent(null);
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const days = getDaysInMonth(selectedDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthEvents = getMonthEvents();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const isToday = day === new Date().getDate() && 
                            selectedDate.getMonth() === new Date().getMonth() &&
                            selectedDate.getFullYear() === new Date().getFullYear();
              
              const dayEvents = day ? getEventsForDate(day) : [];
              
              return (
                <div key={index} className="aspect-square flex flex-col items-center justify-start relative p-1">
                  {day && (
                    <>
                      <button
                        onClick={() => handleDayClick(day)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          isToday 
                            ? 'bg-blue-500 text-white' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {day}
                      </button>
                      {/* Event indicators */}
                      <div className="flex flex-wrap gap-0.5 mt-1 max-w-full">
                        {dayEvents.slice(0, 2).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: event.color }}
                            title={event.title}
                          />
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" title={`+${dayEvents.length - 2} more`} />
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Month Events with delete functionality */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Events in {monthNames[selectedDate.getMonth()]}
          </h3>
          {loading ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Loading events...</p>
            </div>
          ) : monthEvents.length > 0 ? (
            <div className="space-y-3">
              {monthEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20 flex-shrink-0">
                    {new Date(event.event_date).toLocaleDateString()}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20 flex-shrink-0">
                    {event.start_time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 dark:text-gray-200 truncate">{event.title}</div>
                    {event.location && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{event.location}</div>
                    )}
                  </div>
                  <button
                    onClick={() => handleEventClick(event)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400">No events scheduled for this month</p>
              <button
                onClick={() => {
                  setClickedDate(new Date());
                  setShowCreateModal(true);
                }}
                className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                Create your first event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Event FAB */}
      <button
        onClick={() => {
          setClickedDate(new Date());
          setShowCreateModal(true);
        }}
        className="fixed bottom-20 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Event Creation Modal */}
      <EventModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setClickedDate(null);
        }}
        selectedDate={clickedDate}
        onEventCreated={handleEventCreated}
      />

      {/* Event Delete Modal */}
      <EventDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleDeleteEvent}
        eventTitle={selectedEvent?.title || ''}
        loading={deleteLoading}
      />
    </div>
  );
};
