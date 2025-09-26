import React, { useState, useEffect } from 'react';
import { X, Sun, Moon, Bell, Lock, Settings, LogOut, Camera, User, Palette, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [notifications, setNotifications] = useState({
    calendar: true,
    todo: true,
    focus: true,
    alarms: true
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();

  // Load saved profile data on component mount
  useEffect(() => {
    try {
      const savedProfileData = localStorage.getItem('userProfile');
      if (savedProfileData) {
        const parsed = JSON.parse(savedProfileData);
        setProfileImage(parsed.profileImage || null);
        setDisplayName(parsed.displayName || '');
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  }, []);
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
      reader.onload = e => {
        const imageUrl = e.target?.result as string;
        setProfileImage(imageUrl);

        // Save to localStorage
        const profileData = {
          profileImage: imageUrl,
          displayName: displayName
        };
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        localStorage.setItem('userProfileImage', imageUrl); // For backward compatibility
      };
      reader.readAsDataURL(file);
    }
  };
  const handleLogout = async () => {
    await signOut();
    onClose();
  };
  const handleLogin = () => {
    navigate('/auth');
    onClose();
  };
  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };
  const handleNameSave = () => {
    setIsEditingName(false);

    // Save to localStorage
    const profileData = {
      profileImage: profileImage,
      displayName: displayName
    };
    localStorage.setItem('userProfile', JSON.stringify(profileData));
  };
  return <div className="fixed inset-0 z-50 flex items-start justify-center pt-8">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-md mx-4 h-4/5 overflow-hidden animate-slide-in-right transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-blue-500">
          <h2 className="text-xl font-semibold text-white">Profile & Settings</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-full pb-6">
          {user ? <>
              {/* Profile Info */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                      {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : getInitials(user?.email || 'SA')}
                    </div>
                    <label className="absolute bottom-0 right-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                      <Camera className="w-3 h-3 text-white" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  <div className="flex-1">
                    {isEditingName ? <div className="space-y-2">
                        <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white" placeholder="Display name" />
                        <div className="flex space-x-2">
                          <button onClick={handleNameSave} className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600">
                            Save
                          </button>
                          <button onClick={() => setIsEditingName(false)} className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-400 dark:hover:bg-gray-500">
                            Cancel
                          </button>
                        </div>
                      </div> : <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-800 dark:text-white">
                            {displayName || user?.user_metadata?.full_name || "User"}
                          </span>
                          <button onClick={() => setIsEditingName(true)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <User className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>}
                  </div>
                </div>
              </div>
            </> : (/* Login/Signup Options */
        <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
                  <User className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Welcome to Cadolt AI</h3>
                <p className="text-gray-600 dark:text-gray-400">Sign in to unlock all features and sync your data</p>
              </div>
              
              <div className="space-y-3">
                <button onClick={handleLogin} className="w-full flex items-center justify-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all">
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">Sign In</span>
                </button>
                
                <button onClick={handleLogin} className="w-full flex items-center justify-center space-x-3 p-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <UserPlus className="w-5 h-5" />
                  <span className="font-medium">Create Account</span>
                </button>
              </div>
            </div>)}

          {user && <>
              {/* Quick Actions */}
              <div className="p-6 space-y-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
                
                <button onClick={() => setIsEditingName(true)} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <User className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-800 dark:text-white">Edit Name</span>
                </button>

                <label className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <Camera className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-800 dark:text-white">Upload Profile Photo</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Notifications */}
              <div className="p-6 space-y-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </h3>
                
                {Object.entries(notifications).map(([key, value]) => <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                      {key === 'todo' ? 'To-Do' : key} Reminders
                    </span>
                    <button onClick={() => setNotifications(prev => ({
                ...prev,
                [key]: !value
              }))} className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>)}
              </div>

              {/* App Settings */}
              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>App Settings</span>
                </h3>
                
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-gray-800 dark:text-white">Reset All Data</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This will delete all your data permanently</p>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-gray-800 dark:text-white">Help & Feedback</span>
                </button>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 p-3">Version 1.0.0</p>

                {/* Logout */}
                <button onClick={handleLogout} className="w-full p-3 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  <span className="text-red-600 dark:text-red-400 font-medium flex items-center justify-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </span>
                </button>
              </div>
            </>}

          {/* Theme Toggle - Always available */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            
          </div>
        </div>
      </div>
    </div>;
};