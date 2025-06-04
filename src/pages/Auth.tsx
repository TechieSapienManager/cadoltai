
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Eye, EyeOff, Brain, Zap } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-[#4B00D1] to-[#6A1FC9] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-white/80 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-scale-in">
          {/* Top Section - Branding */}
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <div className="relative">
                <Brain className="w-6 h-6 text-white" />
                <Zap className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-['Inter']">Cadolt AI</h1>
              <p className="text-sm text-gray-600 font-['Inter']">AI-Powered Productivity Suite</p>
            </div>
          </div>

          {/* Middle Section - Login Container */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-['Inter']">
              ✨ Get Started ✨
            </h2>
            <p className="text-gray-600 font-['Inter']">
              Join thousands of users boosting their productivity
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 relative">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-center font-semibold transition-all duration-300 relative ${
                isLogin ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              Sign In
              {isLogin && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-slide-in-right"></div>
              )}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-center font-semibold transition-all duration-300 relative ${
                !isLogin ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              Sign Up
              {!isLogin && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-slide-in-right"></div>
              )}
            </button>
          </div>

          {/* Email/Password Form */}
          {!isPhoneAuth && (
            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              {!isLogin && (
                <div>
                  <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="mt-1 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">📧 Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">🔒 Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  `${isLogin ? 'Sign In' : 'Sign Up'} to Cadolt AI`
                )}
              </Button>
            </form>
          )}

          {/* Phone Auth Form */}
          {isPhoneAuth && (
            <form onSubmit={handlePhoneAuth} className="space-y-4 mb-6">
              {!isOtpStep ? (
                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">📞 Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="mt-1 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="otp" className="text-gray-700 font-medium">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                    className="mt-1 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors text-center text-lg tracking-widest"
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]" 
                disabled={loading}
              >
                {loading ? 'Loading...' : (isOtpStep ? 'Verify Code' : 'Send Code')}
              </Button>
            </form>
          )}

          {/* OR Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="w-5 h-5 mr-3 text-red-500" />
              <span className="text-gray-700 font-medium">Continue with Gmail</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsPhoneAuth(!isPhoneAuth);
                setIsOtpStep(false);
              }}
              className="w-full h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="w-5 h-5 mr-3 text-green-500" />
              <span className="text-gray-700 font-medium">Continue with Phone</span>
            </Button>
          </div>

          {/* Bottom Text */}
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            By signing up, you agree to our{' '}
            <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
