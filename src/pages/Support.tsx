import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const Support: React.FC = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const quickAmounts = [50, 100, 200];
  useEffect(() => {
    // Initialize dark mode from localStorage
    const isDark = localStorage.getItem('darkMode') === 'true' || !localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };
  const handleTipNow = () => {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than ₹0",
        variant: "destructive"
      });
      return;
    }
    const options = {
      key: 'rzp_live_CouMrcHdbVNAvD',
      amount: amount * 100,
      currency: 'INR',
      name: 'Cadolt AI',
      description: 'Support Cadolt AI Development',
      handler: function (response: any) {
        toast({
          title: "Thank you! 💙",
          description: "Thanks for supporting Cadolt AI 💙 Your tip helps keep this app free for everyone!"
        });
      },
      theme: {
        color: '#6366f1'
      },
      config: {
        display: {
          hide: [{ method: 'contact' }],
          preferences: {
            show_default_blocks: true
          }
        }
      }
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };
  const handleBack = () => {
    window.history.back();
  };
  return <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={handleBack} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Support Cadolt AI
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 pb-8">
        <div className="max-w-md mx-auto">
          {/* Header Message */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <Heart className="w-16 h-16 mx-auto text-blue-500 fill-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              Support Cadolt AI
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              Cadolt AI is free for everyone 💙. If you'd like to support us, you can send a tip of any amount.
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Quick amounts</h3>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map(amount => <Button key={amount} variant={selectedAmount === amount ? "default" : "outline"} onClick={() => handleAmountSelect(amount)} className="py-3 rounded-xl font-medium">
                  ₹{amount}
                </Button>)}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Custom amount</h3>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400">
                ₹
              </span>
              <Input type="number" placeholder="Enter amount" value={customAmount} onChange={handleCustomAmountChange} min="1" className="pl-8 py-3 rounded-xl" />
            </div>
          </div>

          {/* Tip Now Button */}
          <Button onClick={handleTipNow} className="w-full py-3 rounded-xl font-medium" disabled={!selectedAmount && !customAmount}>
            <Heart className="w-4 h-4 mr-2 fill-current" />
            Tip Now
          </Button>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-6">
            Your support helps us keep Cadolt AI free and accessible for everyone.
          </p>
        </div>
      </main>
    </div>;
};
export default Support;