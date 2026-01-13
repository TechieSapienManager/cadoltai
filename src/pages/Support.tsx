import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Loader2, QrCode, Copy, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import upiQrCode from '@/assets/cadolt-ai-upi-qr.jpeg';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const UPI_ID = '7042920103@ptaxis';

const Support: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUpiDialog, setShowUpiDialog] = useState(false);
  const quickAmounts = [50, 100, 200, 500];

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Load Razorpay script
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
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handlePay = async () => {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount < 1) {
      toast.error('Minimum amount is ₹1');
      return;
    }

    setIsLoading(true);

    try {
      // Create Razorpay order via edge function
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount }
      });

      if (error || !data?.order_id) {
        console.error('Error creating order:', error);
        toast.error('Failed to initiate payment. Please try again.');
        setIsLoading(false);
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: data.key_id,
        amount: amount * 100,
        currency: 'INR',
        name: 'Cadolt AI',
        description: 'Support Cadolt AI',
        order_id: data.order_id,
        handler: function (response: any) {
          toast.success('Thank you for your support! 💙', { duration: 5000 });
          console.log('Payment successful:', response);
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function () {
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        toast.error('Payment failed. Please try again.');
      });
      razorpay.open();
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast.success('UPI ID copied!');
  };

  const openUpiApp = () => {
    const amount = selectedAmount || Number(customAmount) || 0;
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=Cadolt%20AI&am=${amount}&cu=INR&tn=Support%20Cadolt%20AI`;
    window.location.href = upiLink;
  };

  const currentAmount = selectedAmount || Number(customAmount) || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleBack} 
                className="p-2 rounded-lg glass-hover transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <h1 className="text-lg font-semibold text-foreground">
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
            <div className="mb-4 relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Heart className="w-10 h-10 text-primary fill-primary animate-pulse" />
              </div>
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
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map(amount => (
                <Button 
                  key={amount} 
                  variant={selectedAmount === amount ? "default" : "outline"} 
                  onClick={() => handleAmountSelect(amount)} 
                  className="py-3 rounded-xl font-medium text-sm"
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
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                ₹
              </span>
              <Input 
                type="text" 
                inputMode="numeric"
                placeholder="Enter amount" 
                value={customAmount} 
                onChange={handleCustomAmountChange} 
                className="pl-8 py-3 rounded-xl text-lg" 
              />
            </div>
          </div>

          {/* Pay Button */}
          <Button 
            onClick={handlePay} 
            className="w-full py-4 rounded-xl font-medium text-lg futuristic-button" 
            disabled={!currentAmount || isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 mr-2 fill-current" />
                Pay ₹{currentAmount || '0'}
              </>
            )}
          </Button>

          {/* Pay via UPI Button */}
          <Button 
            onClick={() => setShowUpiDialog(true)} 
            variant="outline"
            className="w-full py-4 rounded-xl font-medium text-lg mt-3" 
            disabled={!currentAmount}
            size="lg"
          >
            <QrCode className="w-5 h-5 mr-2" />
            Pay via UPI / QR
          </Button>

          {/* Footer Note */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            Your support helps us keep Cadolt AI free and accessible for everyone. 💙
          </p>
        </div>
      </main>

      {/* UPI Payment Dialog */}
      <Dialog open={showUpiDialog} onOpenChange={setShowUpiDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Pay via UPI</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4">
            {/* QR Code */}
            <div className="bg-white p-3 rounded-xl">
              <img 
                src={upiQrCode} 
                alt="Cadolt AI UPI QR Code" 
                className="w-56 h-auto rounded-lg"
              />
            </div>

            {/* Amount Display */}
            {currentAmount > 0 && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Amount to pay</p>
                <p className="text-2xl font-bold text-primary">₹{currentAmount}</p>
              </div>
            )}

            {/* UPI ID with Copy */}
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg w-full">
              <span className="text-sm font-mono flex-1 text-center">{UPI_ID}</span>
              <button 
                onClick={copyUpiId}
                className="p-1.5 hover:bg-background rounded transition-colors"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Open in UPI App Button */}
            <Button 
              onClick={openUpiApp}
              className="w-full"
              disabled={!currentAmount}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in UPI App
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Scan the QR code or tap the button to pay via any UPI app
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Support;
