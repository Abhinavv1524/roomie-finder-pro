
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import AuthWrapper from '@/components/AuthWrapper';
import ProfileCreation from '@/components/ProfileCreation';
import { useAppStore } from '@/lib/store';

const Index = () => {
  const { isSignedIn, user } = useUser();
  const { userProfile, isProfileCreationOpen } = useAppStore();
  
  // If user is not signed in, show auth wrapper
  if (!isSignedIn) {
    return (
      <AuthWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <h2 className="text-2xl text-center">Sign in to continue</h2>
        </div>
      </AuthWrapper>
    );
  }
  
  // If the user is signed in and has completed their profile
  if (userProfile && !userProfile.isNewUser && !isProfileCreationOpen) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is signed in but hasn't completed profile creation
  return (
    <ProfileCreation />
  );
};

export default Index;
