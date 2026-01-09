import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Smartphone, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const Support: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const quickAmounts = [50, 100, 200];

  const [upiPaymentUrl, setUpiPaymentUrl] = useState<string | null>(null);
  const [isUpiDialogOpen, setIsUpiDialogOpen] = useState(false);

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

  // Check if device is mobile
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const isInIframe = () => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  };

  const handlePay = () => {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Create UPI deep link
    const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Support Cadolt AI')}`;
    setUpiPaymentUrl(upiUrl);
    setIsUpiDialogOpen(true);
  };

  const handleOpenUpiApp = () => {
    if (upiPaymentUrl) {
      window.location.href = upiPaymentUrl;
      toast.success('Opening UPI app...', { duration: 2000 });
    }
  };

  const handleCopyUpiLink = async () => {
    if (!upiPaymentUrl) return;
    try {
      await navigator.clipboard.writeText(upiPaymentUrl);
      toast.success('UPI link copied');
    } catch {
      toast.error('Could not copy the UPI link');
    }
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
            onClick={handlePay} 
            className="w-full py-3 rounded-xl font-medium" 
            disabled={!currentAmount}
          >
            <Heart className="w-4 h-4 mr-2 fill-current" />
            Pay ₹{currentAmount || '0'}
          </Button>

          <Dialog open={isUpiDialogOpen} onOpenChange={setIsUpiDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Complete Payment</DialogTitle>
                <DialogDescription>
                  Choose your preferred payment method
                </DialogDescription>
              </DialogHeader>

              {upiPaymentUrl ? (
                <div className="flex flex-col gap-4">
                  {/* QR Code Section */}
                  <div className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
                    <h4 className="text-sm font-medium text-foreground">Scan QR Code</h4>
                    <div className="rounded-lg border border-border p-2 bg-white">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiPaymentUrl)}`}
                        alt="UPI payment QR code"
                        loading="lazy"
                        className="h-[200px] w-[200px]"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Scan with any UPI app (GPay, PhonePe, Paytm)
                    </p>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    Paying <span className="font-medium text-foreground">₹{currentAmount}</span> to{' '}
                    <span className="font-medium text-foreground">{PAYEE_NAME}</span>
                  </div>

                  {/* Payment Options */}
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      onClick={handleOpenUpiApp}
                      className="w-full"
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      Pay with UPI App
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCopyUpiLink}
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy UPI Link
                    </Button>

                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">or pay via</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div className="p-3 rounded-lg border border-border bg-muted/30 text-center">
                        <p className="text-sm font-medium text-foreground mb-1">Bank Transfer</p>
                        <p className="text-xs text-muted-foreground">UPI ID: {UPI_ID}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>

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
