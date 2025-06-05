
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isPhoneAuth, setIsPhoneAuth] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp, signIn, signInWithGoogle, signInWithPhone, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto theme detection
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password, fullName);

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: isLogin ? "Signed in successfully!" : "Account created! Please check your email.",
        });
        if (isLogin) {
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Google Sign-in Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isOtpStep) {
      try {
        const { error } = await signInWithPhone(phone);
        if (error) {
          toast({
            title: "Phone Authentication Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setIsOtpStep(true);
          toast({
            title: "OTP Sent",
            description: "Please check your phone for the verification code",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send OTP",
          variant: "destructive",
        });
      }
    } else {
      try {
        const { error } = await verifyOtp(phone, otp);
        if (error) {
          toast({
            title: "OTP Verification Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Phone verified successfully!",
          });
          navigate('/');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to verify OTP",
          variant: "destructive",
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-purple-800 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo Section - Single horizontal line with smaller logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <img 
                src="/lovable-uploads/dcde5e95-fc3e-4fcf-b71a-2c7767551ce1.png" 
                alt="Cadolt AI Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cadolt AI
            </h1>
          </div>
          <p className="text-sm text-white/80 dark:text-gray-300">
            AI-Powered Productivity Suite
          </p>
        </div>

        {/* Compact Login Card */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          {/* Get Started Section */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">
              Get Started
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Join thousands boosting productivity
            </p>
          </div>

          {/* Tabs with subtle animation */}
          <div className="flex mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-center font-medium rounded-lg transition-all duration-300 transform ${
                isLogin 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105' 
                  : 'text-gray-600 dark:text-gray-300 hover:scale-105'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-center font-medium rounded-lg transition-all duration-300 transform ${
                !isLogin 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105' 
                  : 'text-gray-600 dark:text-gray-300 hover:scale-105'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Email/Password Form */}
          {!isPhoneAuth && (
            <form onSubmit={handleEmailAuth} className="space-y-3 mb-4">
              {!isLogin && (
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-10 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Full name"
                />
              )}
              
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Email address"
              />

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 pr-10 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full h-10 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg" 
                disabled={loading}
              >
                {loading ? "Loading..." : `${isLogin ? 'Sign In' : 'Sign Up'}`}
              </Button>
            </form>
          )}

          {/* Phone Auth Form */}
          {isPhoneAuth && (
            <form onSubmit={handlePhoneAuth} className="space-y-3 mb-4">
              {!isOtpStep ? (
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  required
                  className="h-10 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                  className="h-10 border-gray-200 dark:border-gray-600 rounded-xl text-center text-lg tracking-widest bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              )}

              <Button 
                type="submit" 
                className="w-full h-10 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-xl transition-all duration-300" 
                disabled={loading}
              >
                {loading ? 'Loading...' : (isOtpStep ? 'Verify Code' : 'Send Code')}
              </Button>
            </form>
          )}

          {/* OR Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-2 mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full h-10 border-gray-200 dark:border-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <Mail className="w-4 h-4 mr-2 text-red-500" />
              <span className="font-medium">Continue with Gmail</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsPhoneAuth(!isPhoneAuth);
                setIsOtpStep(false);
              }}
              className="w-full h-10 border-gray-200 dark:border-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <Phone className="w-4 h-4 mr-2 text-green-500" />
              <span className="font-medium">Continue with Phone</span>
            </Button>
          </div>

          {/* Bottom Text */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
