
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import AuthWrapper from '@/components/AuthWrapper';
import ProfileCreation from '@/components/ProfileCreation';
import { useAppStore } from '@/lib/store';
import { useEffect } from 'react';

const Index = () => {
  const { isSignedIn, user } = useUser();
  const { userProfile, isProfileCreationOpen } = useAppStore();
  
  // If the user is signed in and has completed their profile
  if (isSignedIn && userProfile && !userProfile.isNewUser && !isProfileCreationOpen) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthWrapper>
      <ProfileCreation />
      <Navigate to="/dashboard" replace />
    </AuthWrapper>
  );
};

export default Index;
