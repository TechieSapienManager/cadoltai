import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Support: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const quickAmounts = [50, 100, 200];

  // UPI ID for receiving payments
  const UPI_ID = 'techiesapienmanager@oksbi';
  const PAYEE_NAME = 'Cadolt AI';

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handlePayWithUPI = () => {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      return;
    }

    // Create UPI deep link - works with all UPI apps
    const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Support Cadolt AI')}`;
    
    // Open UPI app
    window.location.href = upiUrl;
  };

  const handleBack = () => {
    window.history.back();
  };

  const currentAmount = selectedAmount || Number(customAmount) || 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
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
              {quickAmounts.map(amount => (
                <Button 
                  key={amount} 
                  variant={selectedAmount === amount ? "default" : "outline"} 
                  onClick={() => handleAmountSelect(amount)} 
                  className="py-3 rounded-xl font-medium"
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Custom amount</h3>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400">
                ₹
              </span>
              <Input 
                type="number" 
                placeholder="Enter amount" 
                value={customAmount} 
                onChange={handleCustomAmountChange} 
                min="1" 
                className="pl-8 py-3 rounded-xl" 
              />
            </div>
          </div>

          {/* Pay Button */}
          <Button 
            onClick={handlePayWithUPI} 
            className="w-full py-3 rounded-xl font-medium" 
            disabled={!currentAmount}
          >
            <Heart className="w-4 h-4 mr-2 fill-current" />
            Pay ₹{currentAmount || '0'} with UPI
          </Button>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-6">
            Your support helps us keep Cadolt AI free and accessible for everyone.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Support;
