
import React from 'react';
import { Calendar, FileText, CheckCircle, Clock, Shield, Clock as AlarmClock } from 'lucide-react';

interface BottomNavigationProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeItem,
  onItemClick
}) => {
  const navItems = [
    { key: 'calendar', icon: Calendar, label: 'Calendar', color: 'neon-blue' },
    { key: 'notes', icon: FileText, label: 'Notes', color: 'neon-green' },
    { key: 'todo', icon: CheckCircle, label: 'To-Do', color: 'neon-orange' },
    { key: 'focus', icon: Clock, label: 'Focus', color: 'neon-purple' },
    { key: 'vault', icon: Shield, label: 'Vault', color: 'neon-gray' },
    { key: 'alarms', icon: AlarmClock, label: 'Alarm', color: 'neon-pink' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-intense border-0 border-t border-primary/20 px-4 py-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-between items-center max-w-md mx-auto w-full">
        {navItems.map(({ key, icon: Icon, label, color }) => {
          const isActive = activeItem === key;
          return (
            <button
              key={key}
              onClick={() => onItemClick(key)}
              className={`flex flex-col items-center space-y-1 p-1.5 sm:p-2 rounded-lg transition-all duration-300 micro-bounce ${
                isActive 
                  ? `text-primary scale-110 ${color} animate-glow` 
                  : 'text-muted-foreground hover:text-primary hover:scale-105'
              }`}
            >
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'scale-120 text-glow-subtle' : ''} transition-transform duration-300`} />
              <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-glow-subtle' : ''}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
