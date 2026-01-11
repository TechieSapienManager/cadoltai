import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  featureName?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  featureName = 'this feature'
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return (
      <div className="min-h-screen bg-background pt-16 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="glass-enhanced rounded-3xl p-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Sign In Required
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Please sign in to access {featureName}. Your data will be securely stored and synced across devices.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full futuristic-button"
                size="lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Don't have an account? You can create one on the sign in page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
