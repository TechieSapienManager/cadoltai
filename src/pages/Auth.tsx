import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Eye, EyeOff, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import logo from '/lovable-uploads/071cd9aa-9dde-4a6b-a6c5-d568b389a986.png';
const Auth = () => {
  const {
    signIn,
    signUp,
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      console.log('User is logged in, redirecting to dashboard');
      navigate('/');
    }
  }, [user, loading, navigate]);
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    console.log('Starting sign in process...');
    setError('');
    setIsSubmitting(true);
    try {
      console.log('Attempting sign in with email:', email);
      const result = await signIn(email, password);
      console.log('Sign in result:', result);
      if (result.error) {
        console.error('Sign in error:', result.error);
        setError(result.error.message || 'Failed to sign in');
      } else {
        console.log('Sign in successful, should redirect automatically');
        // Don't manually navigate here, let the useEffect handle it
      }
    } catch (err) {
      console.error('Sign in exception:', err);
      setError('An unexpected error occurred during sign in');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    console.log('Starting sign up process...');
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setIsSubmitting(true);
    try {
      console.log('Attempting sign up with email:', email);
      const result = await signUp(email, password, displayName || undefined);
      console.log('Sign up result:', result);
      if (!result.error && displayName) {
        localStorage.setItem('userProfile', JSON.stringify({
          displayName,
          profileImage
        }));
      }
      if (result.error) {
        console.error('Sign up error:', result.error);
        setError(result.error.message || 'Failed to create account');
      } else {
        console.log('Sign up successful, should redirect automatically');
        // Don't manually navigate here, let the useEffect handle it
      }
    } catch (err) {
      console.error('Sign up exception:', err);
      setError('An unexpected error occurred during sign up');
    } finally {
      setIsSubmitting(false);
    }
  };
  const termsContent = `**TERMS OF SERVICE**

**Effective Date:** ${new Date().toLocaleDateString()}

**1. ACCEPTANCE OF TERMS**
By accessing and using Cadolt AI ("Service"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.

**2. DESCRIPTION OF SERVICE**
Cadolt AI provides a comprehensive productivity platform featuring:
- Intelligent calendar and event management
- Advanced task and todo organization
- Secure note storage and file vault
- Focus timer and productivity enhancement tools
- AI-powered assistance and automation
- Alarm and notification systems

**3. USER ACCOUNTS**
- You must provide accurate and complete information during registration
- You are responsible for maintaining the confidentiality of your account credentials
- You must notify us immediately of any unauthorized access to your account
- One person may not maintain more than one account

**4. ACCEPTABLE USE POLICY**
You agree NOT to:
- Use the Service for any unlawful purpose or in violation of applicable laws
- Upload malicious content, viruses, or harmful code
- Attempt to gain unauthorized access to other users' accounts or data
- Reverse engineer, modify, or create derivative works of the Service
- Use the Service to spam, harass, or abuse other users
- Violate any intellectual property rights

**5. SUBSCRIPTION AND PAYMENTS**
- Premium features require a paid subscription
- Subscription fees are charged in advance on a recurring basis
- All fees are non-refundable except as required by applicable law
- We reserve the right to change subscription prices with 30 days' notice
- Payment processing is handled securely through Razorpay

**6. PRIVACY AND DATA PROTECTION**
- Your privacy is important to us. Please review our Privacy Policy
- We implement industry-standard security measures to protect your data
- We do not sell your personal information to third parties
- You retain ownership of content you upload to the Service

**7. INTELLECTUAL PROPERTY**
- The Service and its content are owned by Cadolt AI and protected by copyright
- You grant us a license to use your content solely to provide the Service
- You retain ownership of your uploaded content and data

**8. SERVICE AVAILABILITY**
- We strive to maintain high uptime but cannot guarantee uninterrupted service
- We may perform maintenance that temporarily affects service availability
- We are not liable for data loss due to service interruptions

**9. LIMITATION OF LIABILITY**
- Our liability is limited to the amount you paid for the Service in the past 12 months
- We are not liable for indirect, incidental, or consequential damages
- Some jurisdictions may not allow these limitations

**10. TERMINATION**
- Either party may terminate this agreement at any time
- We may suspend accounts that violate these Terms
- Upon termination, your right to use the Service ceases immediately
- You may export your data before termination

**11. MODIFICATIONS TO TERMS**
- We may modify these Terms at any time
- Changes will be posted with an updated effective date
- Continued use after changes constitutes acceptance of new Terms

**12. GOVERNING LAW**
These Terms are governed by applicable laws without regard to conflict of law principles.

**13. CONTACT INFORMATION**
For questions about these Terms, contact us at: techiesapienmanager@gmail.com

By using Cadolt AI, you acknowledge that you have read and agree to these Terms of Service.`;
  const privacyContent = `**PRIVACY POLICY**

**Effective Date:** ${new Date().toLocaleDateString()}

**1. INFORMATION WE COLLECT**

**Personal Information:**
- Name and email address (required for account creation)
- Phone number (optional, for SMS notifications)
- Profile picture and display preferences
- Payment information (processed securely through Razorpay)

**Usage Data:**
- Features used and frequency of access
- Device information (browser type, operating system, IP address)
- Log data (access times, pages viewed, errors encountered)
- Performance metrics and analytics

**User-Generated Content:**
- Calendar events and scheduling data
- Tasks, todos, and productivity information
- Notes and documents stored in your vault
- Custom settings and preferences
- Uploaded files and attachments

**2. HOW WE USE YOUR INFORMATION**

We use collected information to:
- Provide, maintain, and improve our services
- Process transactions and manage subscriptions
- Send notifications, reminders, and important updates
- Provide customer support and technical assistance
- Analyze usage patterns to enhance user experience
- Ensure security and prevent fraud
- Comply with legal obligations

**3. DATA STORAGE AND SECURITY**

**Security Measures:**
- All data is encrypted in transit using TLS 1.3
- Sensitive data is encrypted at rest using AES-256 encryption
- Vault content is protected with user-defined PINs
- Regular security audits and vulnerability assessments
- Multi-factor authentication support

**Data Location:**
- Data is stored on secure servers provided by Supabase
- Servers are located in secure, SOC 2 Type II compliant data centers
- Regular automated backups ensure data integrity
- Redundant storage systems prevent data loss

**4. DATA SHARING AND DISCLOSURE**

We do NOT sell, trade, or rent your personal information. We may share data only in these circumstances:
- With your explicit consent
- To comply with legal obligations, court orders, or regulatory requirements
- To protect our rights, property, or safety, or that of our users
- With trusted service providers under strict confidentiality agreements
- In connection with a business merger, acquisition, or sale (with user notification)

**5. YOUR PRIVACY RIGHTS**

You have the right to:
- Access your personal data and download your information
- Correct inaccurate or incomplete information
- Delete your account and associated data
- Export your data in a portable format
- Opt-out of non-essential communications
- Withdraw consent for data processing (where applicable)

**6. COOKIES AND TRACKING TECHNOLOGIES**

We use essential cookies and similar technologies to:
- Maintain your logged-in session
- Remember your preferences and settings
- Analyze usage patterns for service improvement
- Provide personalized content and features

You can control cookie settings through your browser, though this may affect functionality.

**7. THIRD-PARTY SERVICES**

Our Service integrates with:
- **Supabase:** Database, authentication, and storage services
- **Razorpay:** Secure payment processing (PCI DSS compliant)
- **Email Services:** For notifications and communications

Each service operates under its own privacy policy governing data handling.

**8. DATA RETENTION**

We retain your data as follows:
- Account information: Until account deletion or as required by law
- Usage logs: 90 days for security monitoring and analytics
- Backup data: 30 days after account deletion
- Financial records: 7 years as required by applicable regulations
- Anonymized analytics: May be retained indefinitely

**9. CHILDREN'S PRIVACY**

Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover such collection, we will delete it immediately.

**10. INTERNATIONAL DATA TRANSFERS**

If you access our Service from outside our primary jurisdiction, your data may be transferred internationally. We ensure adequate protection through:
- Standard contractual clauses
- Adequacy decisions where applicable
- Appropriate safeguards for cross-border data protection

**11. PRIVACY POLICY CHANGES**

We may update this Privacy Policy to reflect:
- Changes in our data practices
- New legal or regulatory requirements
- Introduction of new features or services
- User feedback and best practices

We will notify you of significant changes via email or prominent in-app notification.

**12. CONTACT US**

For privacy-related questions, requests, or concerns:
- **Email:** techiesapienmanager@gmail.com
- **Subject Line:** "Privacy Policy Inquiry"
- **Response Time:** We aim to respond within 72 hours

**13. COMPLAINT RESOLUTION**

If you believe we have not complied with this Privacy Policy:
- Contact us directly using the information above
- File a complaint with your local data protection authority
- Seek resolution through applicable legal mechanisms

By using Cadolt AI, you acknowledge that you have read and understand this Privacy Policy.`;
  return <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src={logo} alt="Cadolt AI Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg shadow-md" />
            <h1 className="text-2xl font-bold text-foreground">
              Cadolt AI
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Your intelligent productivity companion
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{error}</p>
              </div>}
            
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required disabled={isSubmitting} className="pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isSubmitting} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full shadow-lg">
                    {isSubmitting ? <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </> : 'Sign In'}
                  </Button>
                </form>

                {Capacitor.isNativePlatform() && <div className="mt-6 p-4 rounded-lg border">
                    <h3 className="text-sm font-semibold mb-3 text-foreground">Profile (optional)</h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                        {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Photo</div>}
                      </div>
                      <Button type="button" variant="outline" onClick={async () => {
                    const photo = await Camera.getPhoto({
                      resultType: CameraResultType.DataUrl,
                      source: CameraSource.Photos,
                      quality: 80
                    });
                    setProfileImage(photo.dataUrl || null);
                    localStorage.setItem('userProfile', JSON.stringify({
                      displayName,
                      profileImage: photo.dataUrl
                    }));
                  }}>
                        Choose Photo
                      </Button>
                    </div>
                  </div>}
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Display Name
                    </label>
                    <Input type="text" placeholder="Your name" value={displayName} onChange={e => setDisplayName(e.target.value)} disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required disabled={isSubmitting} className="pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isSubmitting} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required disabled={isSubmitting} className="pr-10" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isSubmitting} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {Capacitor.isNativePlatform() && <div className="space-y-3 p-4 rounded-lg border">
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Profile Photo (optional)
                        </label>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                            {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Photo</div>}
                          </div>
                          <Button type="button" variant="outline" onClick={async () => {
                        const photo = await Camera.getPhoto({
                          resultType: CameraResultType.DataUrl,
                          source: CameraSource.Photos,
                          quality: 80
                        });
                        setProfileImage(photo.dataUrl || null);
                        localStorage.setItem('userProfile', JSON.stringify({
                          displayName,
                          profileImage: photo.dataUrl
                        }));
                      }}>
                            Choose from Gallery
                          </Button>
                        </div>
                      </div>
                    </div>}

                  <Button type="submit" disabled={isSubmitting} className="w-full shadow-lg">
                    {isSubmitting ? <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </> : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                By continuing, you agree to our{' '}
                <button onClick={() => setShowTerms(true)} className="text-primary hover:text-primary/80 underline font-medium">
                  Terms of Service
                </button>
                {' '}and{' '}
                <button onClick={() => setShowPrivacy(true)} className="text-primary hover:text-primary/80 underline font-medium">
                  Privacy Policy
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms of Service Modal */}
        <Dialog open={showTerms} onOpenChange={setShowTerms}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Terms of Service
                <button onClick={() => setShowTerms(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </DialogTitle>
            </DialogHeader>
            <div className="text-sm text-muted-foreground text-center leading-relaxed whitespace-pre-line">
              {termsContent}
            </div>
          </DialogContent>
        </Dialog>

        {/* Privacy Policy Modal */}
        <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Privacy Policy
                <button onClick={() => setShowPrivacy(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </DialogTitle>
            </DialogHeader>
            <div className="text-sm text-muted-foreground text-center leading-relaxed whitespace-pre-line">
              {privacyContent}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>;
};
export default Auth;