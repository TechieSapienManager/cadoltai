
import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface PricingScreenProps {
  onBack: () => void;
}

export const PricingScreen: React.FC<PricingScreenProps> = ({ onBack }) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Choose the plan that's right for you
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Unlock premium features and enhance your productivity
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                !isYearly
                  ? 'bg-white dark:bg-gray-700 text-blue-500 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${
                isYearly
                  ? 'bg-white dark:bg-gray-700 text-blue-500 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Yearly
              {isYearly && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 20%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Basic
              </h3>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                Free
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">All 6 core features</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">Ads displayed throughout app</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">Limited AI queries (5/day)</span>
              </li>
            </ul>

            <button className="w-full py-3 border-2 border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              Continue with Ads
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-blue-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Pro
              </h3>
              <div className="text-3xl font-bold text-blue-500">
                ₹{isYearly ? '2,999' : '299'}
                <span className="text-base text-gray-600 dark:text-gray-400">
                  /{isYearly ? 'year' : 'month'}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">All Basic features +</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">No ads anywhere</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">Unlimited AI queries</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">Priority support</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">Exclusive templates</span>
              </li>
            </ul>

            <button className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mt-12">
          <button className="w-full text-center text-blue-500 hover:text-blue-600 transition-colors">
            Show detailed comparison
          </button>
        </div>
      </div>
    </div>
  );
};
