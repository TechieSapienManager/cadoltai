
import React, { useState } from 'react';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { TermsModal } from '@/components/TermsModal';

interface PricingScreenProps {
  onBack: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PricingScreen: React.FC<PricingScreenProps> = ({ onBack }) => {
  const { subscriptionPlan, updateSubscription } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      period: 'Free Forever',
      description: 'Perfect for getting started',
      icon: Star,
      features: [
        'Basic Calendar',
        'Simple Todo Lists', 
        'Basic Notes',
        'Standard Alarms',
        'Basic AI Assistant'
      ],
      limitations: [
        'Limited to 50 events per month',
        'Basic reminder notifications',
        'No file storage',
        'No focus mode',
        'Standard support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 299,
      period: 'per month',
      description: 'Unlock advanced productivity features',
      icon: Zap,
      popular: true,
      features: [
        'Advanced Calendar with recurring events',
        'Unlimited Todo Lists with priorities',
        'Rich Text Notes with formatting',
        'Custom Alarm sounds',
        'Enhanced AI Assistant',
        'Secure Vault (Password & File Storage)',
        'Focus Mode with background music',
        'Event notifications (30 min before)',
        'Data export capabilities'
      ],
      limitations: [
        'Up to 500 events per month',
        'Up to 100MB file storage',
        'Email support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 499,
      period: 'per month', 
      description: 'Complete productivity suite',
      icon: Crown,
      features: [
        'Everything in Pro',
        'Unlimited events and storage',
        'Advanced analytics and insights',
        'Team collaboration features',
        'Custom themes and layouts',
        'Advanced AI with custom prompts',
        'Priority support',
        'Early access to new features',
        'Advanced automation rules',
        'Multi-device sync',
        'Backup and restore'
      ],
      limitations: []
    }
  ];

  const handleSubscribe = async (planId: string, price: number) => {
    if (planId === 'basic') {
      const success = await updateSubscription('basic');
      if (success) {
        alert('Successfully switched to Basic plan!');
      }
      return;
    }

    setLoading(planId);

    const options = {
      key: 'rzp_live_CouMrcHdbVNAvD', // Live API key
      amount: price * 100, // Amount in paise
      currency: 'INR',
      name: 'SmartAssist',
      description: `${plans.find(p => p.id === planId)?.name} Plan Subscription`,
      handler: async function (response: any) {
        console.log('Payment successful:', response);
        
        // Update subscription in database
        const success = await updateSubscription(planId);
        if (success) {
          alert(`Successfully subscribed to ${planId} plan!`);
        } else {
          alert('Payment successful but failed to update subscription. Please contact support.');
        }
        setLoading(null);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: function() {
          setLoading(null);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      alert('Payment initialization failed. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Unlock your productivity potential with features designed for every need
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = subscriptionPlan === plan.id;
              
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${
                    plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                  } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      plan.id === 'basic' ? 'bg-gray-100 dark:bg-gray-700' :
                      plan.id === 'pro' ? 'bg-blue-100 dark:bg-blue-900' :
                      'bg-purple-100 dark:bg-purple-900'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        plan.id === 'basic' ? 'text-gray-600 dark:text-gray-400' :
                        plan.id === 'pro' ? 'text-blue-600 dark:text-blue-400' :
                        'text-purple-600 dark:text-purple-400'
                      }`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {plan.description}
                    </p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ₹{plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center space-x-3 opacity-60">
                        <div className="w-5 h-5 flex-shrink-0" />
                        <span className="text-gray-500 dark:text-gray-400 text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan.id, plan.price)}
                    disabled={loading === plan.id || isCurrentPlan}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      isCurrentPlan
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 cursor-not-allowed'
                        : plan.id === 'basic'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                    }`}
                  >
                    {loading === plan.id ? 'Processing...' : 
                     isCurrentPlan ? 'Current Plan' :
                     plan.id === 'basic' ? 'Continue with Basic' : 
                     `Subscribe to ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 dark:text-gray-400 space-y-2">
            <p>All plans include a 30-day money-back guarantee</p>
            <div className="flex justify-center space-x-6 text-sm">
              <button 
                onClick={() => setShowTerms(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => setShowPrivacy(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Load Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      <TermsModal 
        isOpen={showTerms} 
        onClose={() => setShowTerms(false)} 
        type="terms" 
      />
      
      <TermsModal 
        isOpen={showPrivacy} 
        onClose={() => setShowPrivacy(false)} 
        type="privacy" 
      />
    </div>
  );
};
