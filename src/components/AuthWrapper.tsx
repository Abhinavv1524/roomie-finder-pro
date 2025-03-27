
import { useEffect } from 'react';
import { SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { userProfile, setUserProfile, setProfileCreationOpen } = useAppStore();
  
  useEffect(() => {
    if (isSignedIn && user) {
      const hasExistingProfile = userProfile && userProfile.userId === user.id;
      
      // If user is signed in but doesn't have a profile yet, create a basic one
      if (!hasExistingProfile) {
        setUserProfile({
          userId: user.id,
          name: user.fullName || '',
          email: user.primaryEmailAddress?.emailAddress || '',
          avatar: user.imageUrl || '',
          isNewUser: true,
          isProfileComplete: false,
        });
        setProfileCreationOpen(true);
      }
    }
  }, [isSignedIn, user, userProfile, setUserProfile, setProfileCreationOpen]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-accent">
        <div className="animate-pulse-subtle">
          <Logo size="lg" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-accent">
        <GlassCard className="max-w-md w-full mx-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Logo size="lg" className="mx-auto mb-6" />
            
            <motion.h1 
              className="text-3xl font-medium mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Find your perfect match
            </motion.h1>
            
            <motion.p 
              className="text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Connect with compatible roommates and discover ideal living spaces
            </motion.p>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <SignInButton mode="modal">
                <AnimatedButton 
                  className="w-full bg-primary text-white" 
                  size="lg"
                  whileHover={{ scale: 1.02 }}
                >
                  Sign In
                </AnimatedButton>
              </SignInButton>
              
              <SignUpButton mode="modal">
                <AnimatedButton 
                  className="w-full bg-white text-primary border border-primary" 
                  size="lg"
                  variant="outline"
                  whileHover={{ scale: 1.02 }}
                >
                  Create Account
                </AnimatedButton>
              </SignUpButton>
            </motion.div>
            
            <motion.p 
              className="mt-6 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              By signing up, you agree to our Terms of Service and Privacy Policy
            </motion.p>
          </motion.div>
        </GlassCard>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
