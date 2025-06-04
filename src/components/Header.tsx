
import React from 'react';
import { Brain, ArrowLeft, Sparkles, Settings } from 'lucide-react';

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-purple-500/20 h-16">
      <div className="flex items-center justify-between px-4 md:px-6 h-full max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {showBackButton ? (
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-purple-500/20 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-purple-300" />
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-4 md:w-6 h-4 md:h-6 text-white" />
              </div>
              <div>
                <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Cadolt AI
                </span>
                <p className="text-xs text-purple-300 -mt-1 hidden md:block">
                  AI-Powered Productivity Suite
                </p>
              </div>
            </div>
          )}
          
          {getDisplayTitle() && (
            <h1 className="text-lg md:text-xl font-semibold text-purple-200">
              {getDisplayTitle()}
            </h1>
          )}
        </div>

        {/* Center Section - Tabs (only show on dashboard) */}
        {!showBackButton && (
          <div className="flex items-center bg-gray-800/50 rounded-xl p-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'bg-purple-600 text-white shadow-sm transform scale-105'
                  : 'text-purple-300 hover:text-purple-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </button>
            <button
              onClick={() => onTabChange('pricing')}
              className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'pricing'
                  ? 'bg-purple-600 text-white shadow-sm transform scale-105'
                  : 'text-purple-300 hover:text-purple-100'
              }`}
            >
              <span>💲</span>
              <span className="hidden md:inline">Pricing</span>
            </button>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {!showBackButton && (
            <button
              onClick={onAskAI}
              className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium hidden md:inline">Ask AI</span>
            </button>
          )}
          
          <button
            onClick={onProfileClick}
            className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            SA
          </button>
        </div>
      </div>
    </header>
  );
};
