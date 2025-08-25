
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
    { key: 'calendar', icon: Calendar, label: 'Calendar' },
    { key: 'notes', icon: FileText, label: 'Notes' },
    { key: 'todo', icon: CheckCircle, label: 'To-Do' },
    { key: 'focus', icon: Clock, label: 'Focus' },
    { key: 'vault', icon: Shield, label: 'Vault' },
    { key: 'alarms', icon: AlarmClock, label: 'Alarm' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-border/20 px-4 py-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-between items-center max-w-md mx-auto w-full">
        {navItems.map(({ key, icon: Icon, label }) => {
          const isActive = activeItem === key;
          return (
            <button
              key={key}
              onClick={() => onItemClick(key)}
              className={`flex flex-col items-center space-y-1 p-1.5 sm:p-2 rounded-xl transition-all duration-200 will-change-transform hover:animate-micro-bounce ${
                isActive 
                  ? 'text-primary scale-110 subtle-glow' 
                  : 'text-muted-foreground hover:text-foreground glass-hover'
              }`}
            >
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'scale-120 animate-glow-pulse' : ''} transition-transform duration-200`} />
              <span className="text-xs font-medium hidden sm:block">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
