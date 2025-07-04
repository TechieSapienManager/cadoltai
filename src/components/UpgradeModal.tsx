import React from 'react';
import { X, Crown, Zap } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  onUpgrade: (plan: 'pro' | 'premium') => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  feature,
  onUpgrade
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Upgrade Required
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You've reached the limit of 5 free {feature}. Upgrade to continue using this feature.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onUpgrade('pro')}
            className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span className="font-medium">Upgrade to Pro - $9.99/month</span>
          </button>
          
          <button
            onClick={() => onUpgrade('premium')}
            className="w-full p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
          >
            <Crown className="w-5 h-5" />
            <span className="font-medium">Upgrade to Premium - $19.99/month</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};