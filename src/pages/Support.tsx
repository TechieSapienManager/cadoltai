import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Heart, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Razorpay?: any;
    __razorpayScriptPromise?: Promise<void>;
  }
}

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if (window.Razorpay) return Promise.resolve();
  if (window.__razorpayScriptPromise) return window.__razorpayScriptPromise;

  window.__razorpayScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`) as HTMLScriptElement | null;
    if (existing) {
      // If the script tag exists, wait until Razorpay becomes available.
      const start = Date.now();
      const t = window.setInterval(() => {
        if (window.Razorpay) {
          window.clearInterval(t);
          resolve();
        } else if (Date.now() - start > 8000) {
          window.clearInterval(t);
          reject(new Error('Razorpay script loaded but window.Razorpay is not available'));
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout script'));
    document.body.appendChild(script);
  });

  return window.__razorpayScriptPromise;
}

const Support: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);

  const quickAmounts = useMemo(() => [50, 100, 200, 500], []);

  useEffect(() => {
    const isDark =
      localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    loadRazorpayScript()
      .then(() => setIsRazorpayReady(true))
      .catch((e) => {
        console.error(e);
        setIsRazorpayReady(false);
      });
  }, []);

  const currentAmount = selectedAmount || Number(customAmount) || 0;

  const startCheckout = useCallback(async (amount: number) => {
    setIsLoading(true);

    try {
      await loadRazorpayScript();

      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount },
      });

      if (error || !data?.order_id) {
        console.error('Error creating order:', error);
        toast.error('Failed to initiate payment. Please try again.');
        return;
      }

      if (!window.Razorpay) {
        toast.error('Payment system not ready. Please try again.');
        return;
      }

      const options = {
        key: data.key_id,
        currency: 'INR',
        name: 'Cadolt AI',
        description: 'Support Cadolt AI',
        order_id: data.order_id,
        handler: function (response: any) {
          toast.success('Thank you for your support! 💙', { duration: 5000 });
          console.log('Payment successful:', response);
        },
        theme: {
          // Use design token (HSL) rather than a hardcoded hex.
          color: 'hsl(var(--primary))',
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
  }, []);

  // If we opened /support in a new tab from the preview iframe, auto-start payment.
  useEffect(() => {
    if (!isRazorpayReady || isLoading) return;

    const url = new URL(window.location.href);
    const autopay = url.searchParams.get('autopay') === '1';
    const amountStr = url.searchParams.get('amount');

    if (!autopay || !amountStr) return;

    const amount = Number(amountStr);
    if (!amount || Number.isNaN(amount) || amount <= 0) return;

    url.searchParams.delete('autopay');
    url.searchParams.delete('amount');
    window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : ''));

    startCheckout(amount);
  }, [isRazorpayReady, isLoading, startCheckout]);

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

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount < 1) {
      toast.error('Minimum amount is ₹1');
      return;
    }

    // Razorpay UPI QR refresh can fail inside nested iframes (Lovable preview).
    // Open the payment flow in a top-level tab in that case.
    if (isInIframe()) {
      const url = new URL(window.location.href);
      url.searchParams.set('autopay', '1');
      url.searchParams.set('amount', String(amount));
      window.open(url.toString(), '_blank', 'noopener,noreferrer');
      toast.info('Opening payment in a new tab for reliable UPI QR.', { duration: 3000 });
      return;
    }

    if (!isRazorpayReady) {
      toast.error('Payment system is still loading. Please try again in a moment.');
      return;
    }

    await startCheckout(amount);
  };

  const handleBack = () => {
    window.history.back();
  };

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
              <h1 className="text-lg font-semibold text-foreground">Support Cadolt AI</h1>
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
            <h2 className="text-2xl font-bold text-foreground mb-3">Support Cadolt AI</h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Cadolt AI is free for everyone 💙. If you'd like to support us, you can send a tip of any amount.
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Quick amounts</h3>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? 'default' : 'outline'}
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

          {!isRazorpayReady ? (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Loading payments… (if it doesn’t load, refresh once and try again)
            </p>
          ) : null}

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

