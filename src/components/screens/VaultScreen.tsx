
import React, { useState } from 'react';
import { Lock, Plus, Eye, EyeOff, FileText } from 'lucide-react';

interface VaultScreenProps {
  onBack: () => void;
}

export const VaultScreen: React.FC<VaultScreenProps> = ({ onBack }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [visibleItems, setVisibleItems] = useState<{[key: number]: boolean}>({});

  const vaultItems = [
    {
      id: 1,
      title: 'Gmail Account',
      type: 'password',
      content: 'secretpassword123',
      timestamp: '2 days ago'
    },
    {
      id: 2,
      title: 'Banking Login',
      type: 'password',
      content: 'mybank@2024',
      timestamp: '1 week ago'
    },
    {
      id: 3,
      title: 'Important Notes',
      type: 'note',
      content: 'Remember to backup all important files before system update...',
      timestamp: '3 days ago'
    },
    {
      id: 4,
      title: 'SSH Key',
      type: 'file',
      content: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQAB...',
      timestamp: '1 month ago'
    }
  ];

  const handlePinSubmit = () => {
    if (pin === '1234') {
      setIsUnlocked(true);
    } else {
      // Shake animation for wrong PIN
      setPin('');
    }
  };

  const toggleVisibility = (id: number) => {
    setVisibleItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-sm mx-4">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Unlock Vault
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Enter your PIN to access secure items
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={4}
              />
              
              <button
                onClick={handlePinSubmit}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Unlock
              </button>
              
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Hint: Try 1234
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="p-4">
        <div className="space-y-4">
          {vaultItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-4">
                {/* Icon */}
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  {item.type === 'password' ? (
                    <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    {item.title}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                    {visibleItems[item.id] ? item.content : '••••••••••••'}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {item.timestamp}
                  </p>
                </div>

                {/* Toggle Visibility */}
                <button
                  onClick={() => toggleVisibility(item.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {visibleItems[item.id] ? (
                    <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {vaultItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Your vault is empty. Add your first secure item.
            </p>
          </div>
        )}
      </div>

      {/* Add Item FAB */}
      <button className="fixed bottom-20 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};
