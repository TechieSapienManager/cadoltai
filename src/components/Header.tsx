
import React from 'react';
import { ArrowLeft, Sparkles, Settings } from 'lucide-react';

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
  screenTitle = ''
}) => {
  const getScreenTitle = () => {
    switch (screenTitle) {
      case 'calendar':
        return 'Advanced Calendar';
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
        return '';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 h-16">
      <div className="flex items-center justify-between px-4 md:px-6 h-full max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {showBackButton ? (
            <div className="flex items-center space-x-3">
              <button 
                onClick={onBack} 
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                {getScreenTitle()}
              </h1>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-8 md:w-10 h-8 md:h-10 rounded-xl flex items-center justify-center">
                <img 
                  src="/lovable-uploads/dcde5e95-fc3e-4fcf-b71a-2c7767551ce1.png" 
                  alt="Cadolt AI Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Cadolt AI
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden md:block">
                  AI-Powered Productivity Suite
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Center Section - Tabs (only show on dashboard) */}
        {!showBackButton && (
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm transform scale-105'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </button>
            <button
              onClick={() => onTabChange('pricing')}
              className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'pricing'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm transform scale-105'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              <span>💎</span>
              <span className="hidden md:inline">Pricing</span>
            </button>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {!showBackButton && (
            <button
              onClick={onAskAI}
              className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium hidden md:inline">Ask AI</span>
            </button>
          )}
          
          <button
            onClick={onProfileClick}
            className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            SA
          </button>
        </div>
      </div>
    </header>
  );
};
