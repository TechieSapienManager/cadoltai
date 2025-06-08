
import React, { useState, useEffect } from 'react';
import { X, User, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, signOut, updateTheme } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check current theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    setIsDarkMode(currentTheme === 'dark');
  }, []);

  const handleThemeToggle = async () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    await updateTheme(newTheme);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Profile Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center space-x-3">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
              <span className="text-gray-900 dark:text-gray-100">
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <button
              onClick={handleThemeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
