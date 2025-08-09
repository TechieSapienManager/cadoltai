
import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import logo from '@/assets/logo-cadoltai.png';

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button or Logo */}
          <div className="flex items-center space-x-3">
            {showBackButton ? (
              <>
                <button
                  onClick={onBack}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {getScreenTitle()}
                </h1>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {/* App Main Logo - Using uploaded brain logo */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={logo}
                      alt="Cadolt AI logo"
                      className="w-9 h-9 rounded-xl shadow-lg"
                      loading="lazy"
                    />
                  </div>
                  <h1 className="text-xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Cadolt AI
                  </h1>
                </div>
              </div>
            )}
          </div>

          {/* Center - Navigation (only on dashboard) */}
          {!showBackButton && (
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
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
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            {/* Ask AI Button */}
            <button
              onClick={onAskAI}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white hover:from-purple-700 hover:via-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
            >
              Ask AI
            </button>
            
            {/* User Profile / Login */}
            <button
              onClick={onProfileClick}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {user ? (
                <Avatar className="w-8 h-8">
                  <AvatarImage 
                    src={getUserProfileImage() || user?.user_metadata?.avatar_url} 
                    alt={getDisplayName()}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all">
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
