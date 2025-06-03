
import React, { useState } from 'react';
import { Check, X, Sparkles, Zap, Shield, Clock } from 'lucide-react';

interface PricingScreenProps {
  onBack: () => void;
}

export const PricingScreen: React.FC<PricingScreenProps> = ({ onBack }) => {
  const [isYearly, setIsYearly] = useState(false);

  const basicFeatures = [
    { text: "Advanced Calendar with scheduling", included: true },
    { text: "Smart Notes with templates", included: true },
    { text: "AI To-Do Lists with insights", included: true },
    { text: "Focus Mode with timers", included: true },
    { text: "Secure Vault for passwords", included: true },
    { text: "Smart Alarms with custom sounds", included: true },
    { text: "AI Assistant (5 questions/day)", included: true, highlight: true },
    { text: "Ads displayed throughout app", included: true, isNegative: true },
    { text: "Basic support", included: true },
    { text: "Cloud sync", included: true }
  ];

  const proFeatures = [
    { text: "All Basic features included", included: true },
    { text: "No ads anywhere in the app", included: true, highlight: true },
    { text: "AI Assistant (25 questions/day)", included: true, highlight: true },
    { text: "Advanced AI features & templates", included: true },
    { text: "Priority customer support", included: true },
    { text: "Advanced analytics & insights", included: true },
    { text: "Unlimited cloud storage", included: true },
    { text: "Export data in multiple formats", included: true },
    { text: "Custom themes & personalization", included: true },
    { text: "Early access to new features", included: true }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8">
      <div className="p-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            Choose Your Perfect Plan
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Unlock the full potential of Cadolt AI with premium features
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1.5">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                !isYearly
                  ? 'bg-white dark:bg-gray-700 text-blue-500 shadow-lg scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative ${
                isYearly
                  ? 'bg-white dark:bg-gray-700 text-blue-500 shadow-lg scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Yearly
              <span className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold animate-pulse">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 animate-fade-in hover:shadow-2xl transition-all duration-300" style={{ animationDelay: '0.2s' }}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Basic Plan
              </h3>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                Free
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Perfect for getting started
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {basicFeatures.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  {feature.included ? (
                    <Check className={`w-5 h-5 ${feature.isNegative ? 'text-orange-500' : 'text-green-500'} flex-shrink-0`} />
                  ) : (
                    <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${feature.highlight ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'} ${feature.isNegative ? 'text-orange-600 dark:text-orange-400' : ''}`}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <button className="w-full py-4 border-2 border-green-500 text-green-600 dark:text-green-400 rounded-xl font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 hover:scale-105">
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-blue-500 relative animate-fade-in hover:shadow-2xl transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-8 pt-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
                <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Pro Plan
              </h3>
              <div className="text-4xl font-bold text-blue-500 mb-2">
                ₹{isYearly ? '2,999' : '299'}
                <span className="text-lg text-gray-600 dark:text-gray-400 font-normal">
                  /{isYearly ? 'year' : 'month'}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                For power users who want it all
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className={`text-sm ${feature.highlight ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg">
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors duration-200 font-medium">
            <span>Compare all features in detail</span>
            <svg className="w-4 h-4 transform transition-transform duration-200 hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex justify-center items-center space-x-6 text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Cancel Anytime</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            30-day money-back guarantee • No hidden fees
          </p>
        </div>
      </div>
    </div>
  );
};
