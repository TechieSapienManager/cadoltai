
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

import { AskAIScreen } from '@/components/screens/AskAIScreen';
import { useNotifications } from '@/hooks/useNotifications';
import { LegalModal } from '@/components/modals/LegalModal';
import { SupportModal } from '@/components/modals/SupportModal';
import { ProductModal } from '@/components/modals/ProductModal';
import { CompanyModal } from '@/components/modals/CompanyModal';
import { AbstractBackground } from '@/components/AbstractBackground';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modalState, setModalState] = useState<{
    legal: { isOpen: boolean; type: 'privacy' | 'terms' | 'cookies' | null };
    support: { isOpen: boolean; type: 'help' | 'docs' | 'community' | null };
    product: { isOpen: boolean; type: 'features' | 'updates' | null };
    company: { isOpen: boolean; type: 'about' | 'careers' | 'contact' | null };
  }>({
    legal: { isOpen: false, type: null },
    support: { isOpen: false, type: null },
    product: { isOpen: false, type: null },
    company: { isOpen: false, type: null }
  });
  const {
    user,
    loading
  } = useAuth();
  const { requestNotificationPermission } = useNotifications();
  const navigate = useNavigate();

  // Request notification permission when component mounts
  useEffect(() => {
    if (user) {
      requestNotificationPermission();
    }
  }, [user, requestNotificationPermission]);

  const openModal = (category: 'legal' | 'support' | 'product' | 'company', type: string) => {
    setModalState(prev => ({
      ...prev,
      [category]: { isOpen: true, type: type as any }
    }));
  };

  const closeModal = (category: 'legal' | 'support' | 'product' | 'company') => {
    setModalState(prev => ({
      ...prev,
      [category]: { isOpen: false, type: null }
    }));
  };

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
      case 'ask-ai':
        return <AskAIScreen onBack={() => setActiveScreen('dashboard')} />;
      default:
        return <div className="relative min-h-screen transition-colors duration-200 app-gradient-bg overflow-hidden">
            <AbstractBackground />
            <div className="relative z-10 pt-20">
              <AdPlaceholder />
              <WelcomeSection />
              <FeatureGrid onFeatureClick={setActiveScreen} />
              
              {/* Footer */}
              <footer className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/40 border-t border-white/20 dark:border-white/10 mt-16 mb-20">
                <div className="max-w-6xl mx-auto px-4 py-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Product</h3>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li><button onClick={() => openModal('product', 'features')} className="hover:text-purple-500 transition-colors">Features</button></li>
                        <li><button onClick={() => openModal('product', 'updates')} className="hover:text-purple-500 transition-colors">Updates</button></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Company</h3>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li><button onClick={() => openModal('company', 'about')} className="hover:text-purple-500 transition-colors">About</button></li>
                        <li><button onClick={() => openModal('company', 'careers')} className="hover:text-purple-500 transition-colors">Careers</button></li>
                        <li><button onClick={() => openModal('company', 'contact')} className="hover:text-purple-500 transition-colors">Contact</button></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Support</h3>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li><button onClick={() => openModal('support', 'help')} className="hover:text-purple-500 transition-colors">Help Center</button></li>
                        <li><button onClick={() => openModal('support', 'docs')} className="hover:text-purple-500 transition-colors">Documentation</button></li>
                        <li><button onClick={() => openModal('support', 'community')} className="hover:text-purple-500 transition-colors">Community</button></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Legal</h3>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li><button onClick={() => openModal('legal', 'privacy')} className="hover:text-purple-500 transition-colors">Privacy Policy</button></li>
                        <li><button onClick={() => openModal('legal', 'terms')} className="hover:text-purple-500 transition-colors">Terms of Service</button></li>
                        <li><button onClick={() => openModal('legal', 'cookies')} className="hover:text-purple-500 transition-colors">Cookie Policy</button></li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-white/20 dark:border-white/10 pt-6 text-center">
                    <p className="text-sm text-gray-700/80 dark:text-gray-300/80">
                      © 2025 CadoltAI. All rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
            </div>
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
      
      {(activeScreen === 'dashboard' || activeScreen === 'pricing') && <BottomNavigation activeItem={activeScreen} onItemClick={setActiveScreen} />}
      
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      {/* Modal Components */}
      <LegalModal 
        isOpen={modalState.legal.isOpen} 
        onClose={() => closeModal('legal')} 
        type={modalState.legal.type!} 
      />
      <SupportModal 
        isOpen={modalState.support.isOpen} 
        onClose={() => closeModal('support')} 
        type={modalState.support.type!} 
      />
      <ProductModal 
        isOpen={modalState.product.isOpen} 
        onClose={() => closeModal('product')} 
        type={modalState.product.type!} 
      />
      <CompanyModal 
        isOpen={modalState.company.isOpen} 
        onClose={() => closeModal('company')} 
        type={modalState.company.type!} 
      />
    </div>;
};
export default Index;
