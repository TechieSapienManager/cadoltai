import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Heart, RefreshCw, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface QRData {
  qr_id: string;
  image_url: string;
  amount: number;
}

const Support: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const quickAmounts = [50, 100, 200];

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
    setQrData(null);
    setPaymentSuccess(false);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
    setQrData(null);
    setPaymentSuccess(false);
  };

  const generateQRCode = useCallback(async () => {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than ₹0",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingQR(true);
    setPaymentSuccess(false);

    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-qr', {
        body: { amount }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setQrData(data);
    } catch (error: any) {
      console.error('QR generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate QR code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingQR(false);
    }
  }, [selectedAmount, customAmount, toast]);

  const refreshQRCode = useCallback(async () => {
    setQrData(null);
    await generateQRCode();
  }, [generateQRCode]);

  const checkPaymentStatus = useCallback(async () => {
    if (!qrData?.qr_id) return;

    setIsCheckingPayment(true);

    try {
      const { data, error } = await supabase.functions.invoke('check-qr-payment', {
        body: { qr_id: qrData.qr_id }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.paid) {
        setPaymentSuccess(true);
        toast({
          title: "Thank you! 💙",
          description: "Thanks for supporting Cadolt AI 💙 Your tip helps keep this app free for everyone!"
        });
      } else {
        toast({
          title: "Payment Pending",
          description: "Payment not received yet. Please complete the payment using the QR code.",
        });
      }
    } catch (error: any) {
      console.error('Payment check error:', error);
      toast({
        title: "Error",
        description: "Failed to check payment status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingPayment(false);
    }
  }, [qrData, toast]);

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

          {/* Payment Success State */}
          {paymentSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Thank You! 💙
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your support of ₹{qrData?.amount} has been received. You're awesome!
              </p>
              <Button 
                onClick={() => {
                  setPaymentSuccess(false);
                  setQrData(null);
                  setSelectedAmount(null);
                  setCustomAmount('');
                }}
                variant="outline"
                className="rounded-xl"
              >
                Make Another Tip
              </Button>
            </div>
          ) : qrData ? (
            /* QR Code Display */
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Scan with any UPI app to pay ₹{qrData.amount}
                </p>
                <div className="bg-white p-4 rounded-xl inline-block mb-4">
                  <img 
                    src={qrData.image_url} 
                    alt="UPI QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={refreshQRCode}
                    variant="outline"
                    className="rounded-xl"
                    disabled={isLoadingQR}
                  >
                    {isLoadingQR ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Refresh QR
                  </Button>
                  <Button
                    onClick={checkPaymentStatus}
                    className="rounded-xl"
                    disabled={isCheckingPayment}
                  >
                    {isCheckingPayment ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    I've Paid
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => {
                  setQrData(null);
                }}
                variant="ghost"
                className="text-gray-500"
              >
                ← Change Amount
              </Button>
            </div>
          ) : (
            /* Amount Selection */
            <>
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

              {/* Generate QR Button */}
              <Button 
                onClick={generateQRCode} 
                className="w-full py-3 rounded-xl font-medium" 
                disabled={!currentAmount || isLoadingQR}
              >
                {isLoadingQR ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Heart className="w-4 h-4 mr-2 fill-current" />
                )}
                {isLoadingQR ? 'Generating QR...' : 'Pay with UPI'}
              </Button>

              {/* Footer Note */}
              <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-6">
                Your support helps us keep Cadolt AI free and accessible for everyone.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Support;
