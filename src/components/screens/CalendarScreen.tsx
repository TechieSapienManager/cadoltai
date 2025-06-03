
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarScreenProps {
  onBack: () => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const events = [
    { time: '09:00 AM', title: 'Team Meeting', location: 'Conference Room A' },
    { time: '02:00 PM', title: 'Client Call', location: 'Zoom' },
    { time: '04:30 PM', title: 'Project Review', location: 'Office' }
  ];

  const days = getDaysInMonth(selectedDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
              
              return (
                <div key={index} className="aspect-square flex flex-col items-center justify-center relative">
                  {day && (
                    <button
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                        isToday 
                          ? 'bg-blue-500 text-white' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  )}
                  {day && Math.random() > 0.8 && (
                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Today's Events</h3>
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">
                  {event.time}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-gray-200">{event.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{event.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Event FAB */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};
