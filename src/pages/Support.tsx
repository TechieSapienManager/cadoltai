import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Smartphone, Copy, Check, QrCode, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const Support: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const quickAmounts = [50, 100, 200, 500];

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
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handlePay = () => {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount < 1) {
      toast.error('Minimum amount is ₹1');
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

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      toast.success('UPI ID copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy UPI ID');
    }
  };

  const handleBack = () => {
    window.history.back();
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
            disabled={!currentAmount}
            size="lg"
          >
            <Heart className="w-5 h-5 mr-2 fill-current" />
            Pay ₹{currentAmount || '0'}
          </Button>

          <Dialog open={isUpiDialogOpen} onOpenChange={setIsUpiDialogOpen}>
            <DialogContent className="sm:max-w-md glass-enhanced border-border/30">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-foreground">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Complete Payment
                </DialogTitle>
                <DialogDescription>
                  Choose your preferred payment method
                </DialogDescription>
              </DialogHeader>

              {upiPaymentUrl ? (
                <div className="flex flex-col gap-5">
                  {/* Amount Display */}
                  <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">You're supporting with</p>
                    <p className="text-3xl font-bold text-primary">₹{currentAmount}</p>
                  </div>

                  {/* QR Code Section */}
                  <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-primary" />
                      <h4 className="text-sm font-medium text-foreground">Scan QR Code</h4>
                    </div>
                    <div className="rounded-xl border-2 border-border p-2 bg-white">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiPaymentUrl)}`}
                        alt="UPI payment QR code"
                        loading="lazy"
                        className="h-[180px] w-[180px]"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Scan with GPay, PhonePe, Paytm or any UPI app
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-3 text-muted-foreground">or</span>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="flex flex-col gap-3">
                    <Button
                      type="button"
                      onClick={handleOpenUpiApp}
                      className="w-full futuristic-button"
                      size="lg"
                    >
                      <Smartphone className="w-5 h-5 mr-2" />
                      Open UPI App
                    </Button>

                    {/* UPI ID Copy */}
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <p className="text-xs text-muted-foreground mb-2 text-center">Pay manually to</p>
                      <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-secondary">
                        <code className="text-sm font-mono text-foreground truncate flex-1">
                          {UPI_ID}
                        </code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyUpiId}
                          className="flex-shrink-0"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>

          {/* Footer Note */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            Your support helps us keep Cadolt AI free and accessible for everyone. 💙
          </p>
        </div>
      </main>
    </div>
  );
};

export default Support;
