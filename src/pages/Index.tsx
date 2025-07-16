
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
const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();

  // No automatic redirect to auth - let users access the dashboard without authentication
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
        return <div className="min-h-screen transition-colors duration-200 bg-slate-50 dark:bg-gray-900">
            <AdPlaceholder />
            <WelcomeSection />
            <FeatureGrid onFeatureClick={setActiveScreen} />
            
            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16 mb-20">
              <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Product</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li><a href="#" className="hover:text-purple-500 transition-colors">Features</a></li>
                      <li><a href="#" className="hover:text-purple-500 transition-colors">Pricing</a></li>
                      <li><a href="#" className="hover:text-purple-500 transition-colors">Updates</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Company</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li><a href="#" className="hover:text-purple-500 transition-colors">About</a></li>
                      <li><a href="#" className="hover:text-purple-500 transition-colors">Careers</a></li>
                      <li><a href="#" className="hover:text-purple-500 transition-colors">Contact</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Support</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li><a href="#" className="hover:text-purple-500 transition-colors">Help Center</a></li>
                      <li><a href="#" className="hover:text-purple-500 transition-colors">Documentation</a></li>
                      <li><a href="#" className="hover:text-purple-500 transition-colors">Community</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Legal</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li><a href="#" className="hover:text-purple-500 transition-colors">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-purple-500 transition-colors">Terms of Service</a></li>
                      <li><a href="#" className="hover:text-purple-500 transition-colors">Cookie Policy</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    © 2025 CadoltAI. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>;
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300">Loading...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-white dark:bg-gray-900 w-full">
      <Header activeTab={activeTab} onTabChange={handleTabChange} onProfileClick={() => setIsProfileOpen(true)} onAskAI={() => setActiveScreen('ask-ai')} showBackButton={activeScreen !== 'dashboard' && activeScreen !== 'pricing'} onBack={() => {
      setActiveScreen('dashboard');
      setActiveTab('dashboard');
    }} screenTitle={activeScreen} />
      
      {renderScreen()}
      
      {(activeScreen === 'dashboard' || activeScreen === 'pricing') && <BottomNavigation activeItem="" onItemClick={setActiveScreen} />}
      
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>;
};
export default Index;
