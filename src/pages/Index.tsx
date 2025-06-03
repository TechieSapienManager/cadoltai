
import React, { useState } from 'react';
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

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
