
import React from 'react';
import { Brain, ArrowLeft, Sparkles } from 'lucide-react';

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
  const getDisplayTitle = () => {
    if (screenTitle === 'dashboard') return '';
    if (screenTitle === 'ask-ai') return 'Ask AI';
    return screenTitle.charAt(0).toUpperCase() + screenTitle.slice(1);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 h-16">
      <div className="flex items-center justify-between px-4 h-full">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {showBackButton ? (
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Cadolt AI
              </span>
            </div>
          )}
          
          {getDisplayTitle() && (
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {getDisplayTitle()}
            </h1>
          )}
        </div>

        {/* Center Section - Tabs (only show on dashboard) */}
        {!showBackButton && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onTabChange('pricing')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'pricing'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Pricing
            </button>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {!showBackButton && (
            <button
              onClick={onAskAI}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 border-2 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-102"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Ask AI</span>
            </button>
          )}
          
          <button
            onClick={onProfileClick}
            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm hover:bg-blue-600 transition-colors duration-200 hover:scale-105"
          >
            SA
          </button>
        </div>
      </div>
    </header>
  );
};
