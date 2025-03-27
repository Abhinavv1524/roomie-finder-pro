
import AuthWrapper from '@/components/AuthWrapper';
import Dashboard from '@/components/Dashboard';
import ProfileCreation from '@/components/ProfileCreation';

const DashboardPage = () => {
  return (
    <AuthWrapper>
      <ProfileCreation />
      <Dashboard />
    </AuthWrapper>
  );
};

export default DashboardPage;
