
import AuthWrapper from '@/components/AuthWrapper';
import ExploreSection from '@/components/ExploreSection';
import ProfileCreation from '@/components/ProfileCreation';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton } from '@/components/ui/animated-button';
import { motion } from 'framer-motion';

const ExplorePage = () => {
  const navigate = useNavigate();

  return (
    <AuthWrapper>
      <ProfileCreation />
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <header className="glass-panel sticky top-0 z-10 backdrop-blur-md border-b border-border/40">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Logo />
            
            <div className="flex gap-4">
              <AnimatedButton
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </AnimatedButton>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-medium mb-2">Explore</h1>
            <p className="text-muted-foreground">
              Find your perfect roommate or ideal living space
            </p>
          </motion.div>

          <ExploreSection />
        </main>
      </div>
    </AuthWrapper>
  );
};

export default ExplorePage;
