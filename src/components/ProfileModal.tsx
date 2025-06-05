
import React, { useState } from 'react';
import { X, Sun, Moon, Bell, Lock, Settings, LogOut, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [notifications, setNotifications] = useState({
    calendar: true,
    todo: true,
    focus: true,
    alarms: true
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { user, signOut } = useAuth();

  if (!isOpen) return null;

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-md mx-4 h-4/5 overflow-hidden animate-slide-in-right transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Profile & Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-full pb-6">
          {/* Profile Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(user?.email || 'SA')
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                  <Camera className="w-3 h-3 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <input
                  type="text"
                  defaultValue={user?.user_metadata?.full_name || "User"}
                  className="text-lg font-semibold bg-transparent border-none outline-none text-gray-800 dark:text-gray-200"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="p-6 space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-800 dark:text-gray-200">App Theme</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  isDarkMode ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${
                  isDarkMode ? 'translate-x-8' : 'translate-x-1'
                }`}>
                  {isDarkMode ? (
                    <Moon className="w-3 h-3 text-blue-500" />
                  ) : (
                    <Sun className="w-3 h-3 text-yellow-500" />
                  )}
                </div>
              </button>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </h3>
              
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 capitalize">
                    {key === 'todo' ? 'To-Do' : key} Reminders
                  </span>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      value ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      value ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>

            {/* Security */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Security & Privacy</span>
              </h3>
              
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="text-gray-800 dark:text-gray-200">Change Password</span>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="text-gray-800 dark:text-gray-200">Enable Biometric Login</span>
              </button>
            </div>

            {/* App Info */}
            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="text-gray-800 dark:text-gray-200">Help & Feedback</span>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="text-gray-800 dark:text-gray-200">Privacy Policy</span>
              </button>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 p-3">Version 1.0.0</p>
            </div>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="w-full p-3 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <span className="text-red-600 dark:text-red-400 font-medium flex items-center justify-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
