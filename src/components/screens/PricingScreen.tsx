
import React, { useState } from 'react';
import { Check, Sparkles, Shield, Cloud, Zap, Star } from 'lucide-react';

interface PricingScreenProps {
  onBack: () => void;
}

export const PricingScreen: React.FC<PricingScreenProps> = ({ onBack }) => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'premium'>('basic');

  const plans = [
    {
      id: 'basic' as const,
      name: 'Basic',
      price: '₹0',
      period: 'Forever Free',
      description: 'Perfect for getting started',
      features: [
        'Ad-supported experience',
        '5 Gemini AI queries/day',
        'Basic calendar & notes',
        'Local storage only',
        'Standard alarms & focus',
        'Password vault (local)'
      ],
      buttonText: 'Current Plan',
      popular: false,
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      id: 'pro' as const,
      name: 'Pro',
      price: '₹29',
      period: '/month',
      description: 'Most popular for productivity',
      features: [
        'Ad-free experience',
        '25 Gemini AI queries/day',
        'Advanced calendar features',
        'Cloud sync & backup',
        'Premium focus sounds',
        'Biometric vault security',
        'Priority customer support'
      ],
      buttonText: 'Go Pro',
      popular: true,
      gradient: 'from-purple-500 to-blue-500'
    },
    {
      id: 'premium' as const,
      name: 'Premium',
      price: '₹99',
      period: '/month',
      description: 'Ultimate productivity suite',
      features: [
        'Everything in Pro',
        'Unlimited AI queries',
        'Advanced analytics',
        'Team collaboration',
        'Custom integrations',
        'Dedicated account manager',
        'Early access to features',
        'Advanced automation'
      ],
      buttonText: 'Go Premium',
      popular: false,
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  const handleSubscribe = (planId: string) => {
    if (planId === 'basic') return;
    
    // Integrate with Razorpay here
    console.log(`Subscribing to ${planId} plan`);
    
    // For demo purposes, show alert
    alert(`Redirecting to Razorpay for ${planId} plan payment...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Unlock your productivity potential with Cadolt AI
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-purple-500 scale-105' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center`}>
                    {plan.id === 'basic' && <Sparkles className="w-8 h-8 text-white" />}
                    {plan.id === 'pro' && <Zap className="w-8 h-8 text-white" />}
                    {plan.id === 'premium' && <Shield className="w-8 h-8 text-white" />}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                      {plan.period}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={plan.id === 'basic'}
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                    plan.id === 'basic'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg hover:scale-105 active:scale-95`
                  }`}
                >
                  {plan.buttonText}
                </button>

                {/* Payment Note */}
                {plan.id !== 'basic' && (
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                    Secure payment via Razorpay
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Secure Payment Options
          </h3>
          <div className="flex justify-center items-center space-x-4 text-gray-600 dark:text-gray-400">
            <span className="text-sm">Powered by</span>
            <div className="font-semibold text-blue-600 dark:text-blue-400">Razorpay</div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            UPI, Net Banking, Cards & More
          </p>
        </div>

        {/* FAQ or Additional Info */}
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Why Choose Cadolt AI Pro?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-blue-500" />
                <span>Cloud Sync</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Enhanced Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
