
import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Moon, Sun, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import logo from '/lovable-uploads/071cd9aa-9dde-4a6b-a6c5-d568b389a986.png';

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
  const { toast } = useToast();

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

  const handleTipClick = () => {
    const amount = prompt("Enter tip amount (in ₹):");
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return;
    }

    const options = {
      key: 'rzp_live_CouMrcHdbVNAvD',
      amount: Number(amount) * 100, // Amount in paise
      currency: 'INR',
      name: 'Cadolt AI',
      description: 'Support Cadolt AI Development',
      handler: function (response: any) {
        toast({
          title: "Thank you! 💙",
          description: "Thanks for supporting Cadolt AI 💙 Your tip helps keep this app free for everyone!",
        });
      },
      prefill: {
        name: user?.user_metadata?.full_name || 'Supporter',
        email: user?.email || '',
      },
      theme: {
        color: '#6366f1'
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/20">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button or Logo */}
          <div className="flex items-center space-x-3">
            {showBackButton ? (
              <>
                <button
                  onClick={onBack}
                  className="p-2 rounded-lg glass-hover transition-all duration-200 will-change-transform hover:animate-micro-bounce"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <h1 className="text-lg font-semibold text-foreground subtle-glow">
                  {getScreenTitle()}
                </h1>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={logo}
                      alt="Cadolt AI"
                      className="w-8 h-8 sm:w-10 sm:h-10"
                    />
                  </div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-primary subtle-glow">
                    Cadolt AI
                  </h1>
                </div>
              </div>
            )}
          </div>

          {/* Center - Navigation (only on dashboard) */}
          {!showBackButton && (
            <div className="hidden md:flex items-center space-x-1 glass-enhanced rounded-2xl p-1">
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 will-change-transform ${
                  activeTab === 'dashboard'
                    ? 'futuristic-button text-primary-foreground subtle-glow'
                    : 'text-muted-foreground hover:text-foreground glass-hover'
                }`}
              >
                Dashboard
              </button>
            </div>
          )}

          {/* Right side - Tip, Dark Mode, Ask AI and Profile */}
          <div className="flex items-center space-x-2">
            {/* Tip Button - Always visible */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleTipClick}
                    className="p-2 rounded-xl glass-hover transition-all duration-200 will-change-transform hover:animate-micro-bounce"
                  >
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 fill-blue-500 hover:fill-blue-600 transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Support Cadolt AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl glass-hover transition-all duration-200 will-change-transform hover:animate-micro-bounce"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400 cosmic-glow" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground subtle-glow" />
              )}
            </button>
            
            {/* Ask AI Button */}
            <button
              onClick={onAskAI}
              className="futuristic-button px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-primary-foreground subtle-glow will-change-transform"
            >
              Ask AI
            </button>
            
            {/* User Profile / Login */}
            <button
              onClick={onProfileClick}
              className="p-1 rounded-full glass-hover transition-all duration-200 will-change-transform hover:animate-micro-bounce"
            >
              {user ? (
                <Avatar className="w-8 h-8 subtle-glow">
                  <AvatarImage 
                    src={getUserProfileImage() || user?.user_metadata?.avatar_url} 
                    alt={getDisplayName()}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="futuristic-button flex items-center space-x-2 px-3 py-2 rounded-xl text-primary-foreground">
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
