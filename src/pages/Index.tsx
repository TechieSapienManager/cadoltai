
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
        return <PricingScreen onBack={() => setActiveScreen('dashboard')} />;
      case 'ask-ai':
        return <AskAIScreen onBack={() => setActiveScreen('dashboard')} />;
      default:
        return (
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <AdPlaceholder />
            <WelcomeSection />
            <FeatureGrid onFeatureClick={setActiveScreen} />
            
            {/* Auth Section */}
            {!loading && !user && (
              <div className="px-6 py-8 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                  <p className="text-blue-100 mb-6">
                    Sign up now to unlock all features and start boosting your productivity!
                  </p>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
                  >
                    Sign Up / Login
                  </Button>
                </div>
              </div>
            )}
            
            <div className="pb-20" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 w-full">
      <Header 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onProfileClick={() => setIsProfileOpen(true)}
        onAskAI={() => setActiveScreen('ask-ai')}
        showBackButton={activeScreen !== 'dashboard'}
        onBack={() => setActiveScreen('dashboard')}
        screenTitle={activeScreen === 'dashboard' ? '' : activeScreen}
      />
      
      {renderScreen()}
      
      {activeScreen === 'dashboard' && (
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
