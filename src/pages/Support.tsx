import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Support: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');

  const quickAmounts = [50, 100, 200];

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
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'Cadolt AI',
      description: 'Support Cadolt AI Development',
      handler: function (response: any) {
        toast({
          title: "Thank you! 💙",
          description: "Thanks for supporting Cadolt AI 💙 Your tip helps keep this app free for everyone!"
        });
      },
      prefill: {
        name: user?.user_metadata?.full_name || 'Supporter',
        email: user?.email || ''
      },
      theme: {
        color: '#6366f1'
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleBack} 
                className="p-2 rounded-lg glass-hover transition-all duration-200 will-change-transform hover:animate-micro-bounce"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <h1 className="text-lg font-semibold text-foreground subtle-glow">
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
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Support Cadolt AI
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Cadolt AI is free for everyone 💙. If you'd like to support us, you can send a tip of any amount.
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Quick amounts</h3>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((amount) => (
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
            <h3 className="text-sm font-medium text-foreground mb-3">Custom amount</h3>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
              <Input
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="pl-8 py-3 rounded-xl"
                min="1"
              />
            </div>
          </div>

          {/* Tip Now Button */}
          <Button
            onClick={handleTipNow}
            className="w-full py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!selectedAmount && !customAmount}
          >
            <Heart className="w-4 h-4 mr-2 fill-current" />
            Tip Now
          </Button>

          {/* Footer Note */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            Your support helps us keep Cadolt AI free and accessible for everyone.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Support;