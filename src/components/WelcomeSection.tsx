
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const WelcomeSection: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { label: "Focus Time Today", value: "0h 0m", color: "text-purple-500" },
    { label: "Tasks Done", value: "0/0", color: "text-blue-500" },
    { label: "Upcoming Events", value: "0", color: "text-green-500" },
    { label: "Notes Count", value: "0", color: "text-orange-500" }
  ]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Fetch todos
      const { data: todos } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id);

      // Fetch events for today and upcoming
      const today = new Date().toISOString().split('T')[0];
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .gte('event_date', today);

      // Fetch notes
      const { data: notes } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id);

      // Calculate completed todos
      const completedTodos = todos?.filter(todo => todo.completed).length || 0;
      const totalTodos = todos?.length || 0;

      // Calculate upcoming events
      const upcomingEvents = events?.length || 0;

      // Calculate notes count
      const notesCount = notes?.length || 0;

      // For focus time, we'll simulate based on completed todos (can be enhanced later)
      const focusMinutes = completedTodos * 25; // Assuming 25min per completed task
      const focusHours = Math.floor(focusMinutes / 60);
      const remainingMinutes = focusMinutes % 60;

      setStats([
        { 
          label: "Focus Time Today", 
          value: `${focusHours}h ${remainingMinutes}m`, 
          color: "text-purple-500" 
        },
        { 
          label: "Tasks Done", 
          value: `${completedTodos}/${totalTodos}`, 
          color: "text-blue-500" 
        },
        { 
          label: "Upcoming Events", 
          value: upcomingEvents.toString(), 
          color: "text-green-500" 
        },
        { 
          label: "Notes Count", 
          value: notesCount.toString(), 
          color: "text-orange-500" 
        }
      ]);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <div className="px-4 md:px-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome back, {getUserName()}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your productivity overview for today
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-xl md:text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
