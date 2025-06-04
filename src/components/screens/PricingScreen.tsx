
import React from 'react';
import { ArrowLeft, Check, Crown, Star } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center p-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Unlock the full potential of your productivity with our feature-rich plans
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 ${
                plan.popular ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.price !== "$0" && (
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">
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
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Can I switch plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we offer a 14-day free trial for all paid plans. No credit card required.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Is my data secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Absolutely. We use enterprise-grade encryption and security measures to protect your data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
