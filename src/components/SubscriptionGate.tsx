
import React from 'react';
import { Lock, Crown } from 'lucide-react';

interface SubscriptionGateProps {
  feature: string;
  requiredPlan: 'pro' | 'premium';
  userPlan: string;
  children: React.ReactNode;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({
  feature,
  requiredPlan,
  userPlan,
  children
}) => {
  const hasAccess = () => {
    if (requiredPlan === 'pro') {
      return userPlan === 'pro' || userPlan === 'premium';
    }
    if (requiredPlan === 'premium') {
      return userPlan === 'premium';
    }
    return true;
  };

  if (hasAccess()) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="filter blur-sm pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {requiredPlan === 'premium' ? <Crown className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {requiredPlan === 'premium' ? 'Premium' : 'Pro'} Feature
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {feature} requires a {requiredPlan} subscription
          </p>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};
