
import React from 'react';
import { ArrowLeft, User } from 'lucide-react';
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
      case 'pricing':
        return 'Pricing Plans';
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
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
                      src="/lovable-uploads/0979893b-0c4d-40b7-a3d1-e69a16dc5c50.png" 
                      alt="Cadolt AI Logo" 
                      className="w-10 h-10 rounded-xl shadow-lg"
                    />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
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
              <button
                onClick={() => onTabChange('pricing')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'pricing'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Pricing
              </button>
            </div>
          )}

          {/* Right side - Ask AI and Profile */}
          <div className="flex items-center space-x-2">
            {/* Ask AI Button */}
            <button
              onClick={onAskAI}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white hover:from-purple-700 hover:via-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
            >
              Ask AI
            </button>
            
            {/* User Profile */}
            <button
              onClick={onProfileClick}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage 
                  src={getUserProfileImage() || user?.user_metadata?.avatar_url} 
                  alt={getDisplayName()}
                />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
