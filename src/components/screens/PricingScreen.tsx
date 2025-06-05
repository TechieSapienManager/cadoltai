
import React from 'react';
import { Check, Crown, Star } from 'lucide-react';

interface PricingScreenProps {
  onBack: () => void;
}

export const PricingScreen: React.FC<PricingScreenProps> = ({ onBack }) => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Basic Calendar",
        "5 Notes",
        "Simple To-Do Lists",
        "Basic Alarms",
        "Community Support"
      ],
      buttonText: "Get Started",
      buttonStyle: "bg-gray-600 hover:bg-gray-700",
      popular: false
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "month",
      description: "Everything you need to stay productive",
      features: [
        "Advanced Calendar with Weather",
        "Unlimited Smart Notes",
        "AI-Powered To-Do Lists",
        "Focus Mode+",
        "Basic Vault (50 passwords)",
        "Smart Alarms",
        "Priority Support",
        "Productivity Analytics"
      ],
      buttonText: "Start Free Trial",
      buttonStyle: "bg-blue-600 hover:bg-blue-700",
      popular: true
    },
    {
      name: "Premium",
      price: "$19.99",
      period: "month",
      description: "For power users and teams",
      features: [
        "Everything in Pro",
        "Unlimited Vault Storage",
        "Team Collaboration",
        "Advanced AI Features",
        "Custom Integrations",
        "White-label Options",
        "24/7 Premium Support",
        "Advanced Analytics",
        "API Access"
      ],
      buttonText: "Go Premium",
      buttonStyle: "bg-purple-600 hover:bg-purple-700",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="px-4 md:px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg md:text-xl text-purple-600 dark:text-purple-300 max-w-2xl mx-auto">
            Unlock the full potential of your productivity with our feature-rich plans
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 transform hover:scale-105 transition-all duration-300 border ${
                plan.popular ? 'border-purple-500/50 ring-2 ring-purple-500/20' : 'border-gray-300 dark:border-gray-700/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center shadow-lg">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.price !== "$0" && (
                    <span className="text-purple-600 dark:text-purple-300 ml-2">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className="text-purple-600 dark:text-purple-300 text-sm md:text-base">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-3 md:space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className="w-4 md:w-5 h-4 md:h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-purple-200 text-sm md:text-base">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 px-6 rounded-xl text-white font-semibold transition-all duration-300 ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16 md:mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8 md:mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-300 dark:border-gray-700/50">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Can I switch plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-purple-300 text-sm md:text-base">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-300 dark:border-gray-700/50">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-purple-300 text-sm md:text-base">
                Yes, we offer a 14-day free trial for all paid plans. No credit card required.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-300 dark:border-gray-700/50">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-purple-300 text-sm md:text-base">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-300 dark:border-gray-700/50">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Is my data secure?
              </h3>
              <p className="text-gray-600 dark:text-purple-300 text-sm md:text-base">
                Absolutely. We use enterprise-grade encryption and security measures to protect your data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
