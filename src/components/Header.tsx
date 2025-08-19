
import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Moon, Sun, Brain } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onProfileClick: () => void;
  onAskAI: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  screenTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onProfileClick,
  onAskAI,
  showBackButton = false,
  onBack,
  screenTitle
}) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                  (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getScreenTitle = () => {
    switch (screenTitle) {
      case 'calendar':
        return 'Calendar';
      case 'notes':
        return 'Smart Notes';
      case 'todo':
        return 'AI To-Do Lists';
      case 'focus':
        return 'Focus Mode+';
      case 'vault':
        return 'Advanced Vault';
      case 'alarms':
        return 'Smart Alarms';
      case 'ask-ai':
        return 'Ask AI';
      default:
        return 'Dashboard';
    }
  };

  // Get user's uploaded profile picture from localStorage
  const getUserProfileImage = () => {
    try {
      const profileData = localStorage.getItem('userProfile');
      if (profileData) {
        const parsed = JSON.parse(profileData);
        return parsed.profileImage || null;
      }
      return localStorage.getItem('userProfileImage');
    } catch {
      return null;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-intense border-0 border-b border-primary/20">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button or Logo */}
          <div className="flex items-center space-x-3">
            {showBackButton ? (
              <>
                <button
                  onClick={onBack}
                  className="p-2 rounded-xl glass-card hover:scale-105 transition-all duration-300 neon-purple micro-bounce"
                >
                  <ArrowLeft className="w-5 h-5 text-primary" />
                </button>
                <h1 className="text-lg font-semibold text-glow text-primary animate-glow">
                  {getScreenTitle()}
                </h1>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="relative p-2 rounded-xl glass-card animate-float neon-purple">
                    <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-glow" />
                    <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse" />
                  </div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-glow-subtle text-primary animate-holographic bg-clip-text">
                    Cadolt AI
                  </h1>
                </div>
              </div>
            )}
          </div>

          {/* Center - Navigation (only on dashboard) */}
          {!showBackButton && (
            <div className="hidden md:flex items-center space-x-1 glass-card rounded-xl p-1">
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'dashboard'
                    ? 'glass-intense text-primary shadow-lg neon-purple scale-105'
                    : 'text-muted-foreground hover:text-primary hover:scale-105'
                }`}
              >
                Dashboard
              </button>
            </div>
          )}

          {/* Right side - Dark Mode, Ask AI and Profile */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl glass-card hover:scale-105 transition-all duration-300 micro-bounce"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-warning neon-orange animate-glow" />
              ) : (
                <Moon className="w-5 h-5 text-secondary neon-blue animate-glow" />
              )}
            </button>
            
            {/* Ask AI Button */}
            <button
              onClick={onAskAI}
              className="btn-holographic px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-white text-xs sm:text-sm font-medium shadow-lg micro-bounce animate-glow"
            >
              <span className="relative z-10">Ask AI</span>
            </button>
            
            {/* User Profile / Login */}
            <button
              onClick={onProfileClick}
              className="p-1 rounded-full glass-card hover:scale-105 transition-all duration-300 micro-bounce"
            >
              {user ? (
                <Avatar className="w-8 h-8 neon-purple">
                  <AvatarImage 
                    src={getUserProfileImage() || user?.user_metadata?.avatar_url} 
                    alt={getDisplayName()}
                  />
                  <AvatarFallback className="btn-holographic text-white text-sm font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex items-center space-x-2 px-3 py-2 rounded-xl btn-holographic text-white shadow-lg micro-bounce">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Login</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
