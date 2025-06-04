
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { WelcomeSection } from '@/components/WelcomeSection';
import { FeatureGrid } from '@/components/FeatureGrid';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ProfileModal } from '@/components/ProfileModal';
import { CalendarScreen } from '@/components/screens/CalendarScreen';
import { NotesScreen } from '@/components/screens/NotesScreen';
import { TodoScreen } from '@/components/screens/TodoScreen';
import { FocusScreen } from '@/components/screens/FocusScreen';
import { VaultScreen } from '@/components/screens/VaultScreen';
import { AlarmsScreen } from '@/components/screens/AlarmsScreen';
import { PricingScreen } from '@/components/screens/PricingScreen';
import { AskAIScreen } from '@/components/screens/AskAIScreen';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'pricing') {
      setActiveScreen('pricing');
    } else {
      setActiveScreen('dashboard');
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'calendar':
        return <CalendarScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'notes':
        return <NotesScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'todo':
        return <TodoScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'focus':
        return <FocusScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'vault':
        return <VaultScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'alarms':
        return <AlarmsScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'pricing':
        return <PricingScreen onBack={() => {
          setActiveScreen('dashboard');
          setActiveTab('dashboard');
        }} />;
      case 'ask-ai':
        return <AskAIScreen onBack={() => setActiveScreen('dashboard')} />;
      default:
        return (
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <AdPlaceholder />
            <WelcomeSection />
            <FeatureGrid onFeatureClick={setActiveScreen} />
            <div className="pb-20" />
          </div>
        );
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 w-full">
      <Header 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onProfileClick={() => setIsProfileOpen(true)}
        onAskAI={() => setActiveScreen('ask-ai')}
        showBackButton={activeScreen !== 'dashboard' && activeScreen !== 'pricing'}
        onBack={() => {
          setActiveScreen('dashboard');
          setActiveTab('dashboard');
        }}
        screenTitle={activeScreen}
      />
      
      {renderScreen()}
      
      {(activeScreen === 'dashboard' || activeScreen === 'pricing') && (
        <BottomNavigation 
          activeItem=""
          onItemClick={setActiveScreen}
        />
      )}
      
      <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default Index;
