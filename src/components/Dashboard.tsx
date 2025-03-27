
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CardMotion, CardMotionContent, CardMotionDescription, CardMotionFooter, CardMotionHeader, CardMotionTitle } from '@/components/ui/card-motion';
import { UserButton } from '@clerk/clerk-react';
import { useAppStore } from '@/lib/store';
import { GlassCard } from '@/components/ui/glass-card';
import { Search, Home, Users, Settings, Mail, MapPin, ArrowRight } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userProfile } = useAppStore();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleCardHover = (cardId: string) => {
    setHoveredCard(cardId);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="glass-panel sticky top-0 z-10 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo />
          
          <div className="flex items-center gap-4">
            <AnimatedButton
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => navigate('/search')}
            >
              <Search className="h-4 w-4 mr-2" />
              <span>Search</span>
            </AnimatedButton>
            
            <div className="h-8 w-8 overflow-hidden rounded-full">
              <UserButton afterSignOutUrl="/" />
            </div>
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
          <h1 className="text-3xl font-medium mb-2">
            Welcome back, {userProfile?.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            Find your perfect match or explore available properties
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardMotion 
            className="relative overflow-hidden"
            interactive={true}
            delay={0.1}
            onMouseEnter={() => handleCardHover('explore')}
            onMouseLeave={handleCardLeave}
            onClick={() => navigateTo('/explore')}
          >
            <CardMotionHeader>
              <motion.div 
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                animate={{ 
                  scale: hoveredCard === 'explore' ? 1.1 : 1,
                  backgroundColor: hoveredCard === 'explore' ? 'rgba(var(--primary), 0.2)' : 'rgba(var(--primary), 0.1)'
                }}
                transition={{ duration: 0.3 }}
              >
                <Users className="h-6 w-6 text-primary" />
              </motion.div>
              <CardMotionTitle>Find a Match</CardMotionTitle>
              <CardMotionDescription>
                Discover compatible roommates or find the perfect room
              </CardMotionDescription>
            </CardMotionHeader>
            <CardMotionContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <span className="mr-2">•</span> AI-driven roommate compatibility
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="mr-2">•</span> Filter by lifestyle preferences
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="mr-2">•</span> Connect with potential roommates
                </li>
              </ul>
            </CardMotionContent>
            <CardMotionFooter className="justify-between">
              <span className="text-sm font-medium text-primary">Explore Now</span>
              <motion.div
                animate={{ 
                  x: hoveredCard === 'explore' ? 5 : 0,
                  opacity: hoveredCard === 'explore' ? 1 : 0.7
                }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="h-5 w-5 text-primary" />
              </motion.div>
            </CardMotionFooter>
          </CardMotion>

          <CardMotion 
            className="relative overflow-hidden"
            interactive={true}
            delay={0.2}
            onMouseEnter={() => handleCardHover('search')}
            onMouseLeave={handleCardLeave}
            onClick={() => navigateTo('/search')}
          >
            <CardMotionHeader>
              <motion.div 
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                animate={{ 
                  scale: hoveredCard === 'search' ? 1.1 : 1,
                  backgroundColor: hoveredCard === 'search' ? 'rgba(var(--primary), 0.2)' : 'rgba(var(--primary), 0.1)'
                }}
                transition={{ duration: 0.3 }}
              >
                <Search className="h-6 w-6 text-primary" />
              </motion.div>
              <CardMotionTitle>Search Properties</CardMotionTitle>
              <CardMotionDescription>
                Find the perfect rental based on your criteria
              </CardMotionDescription>
            </CardMotionHeader>
            <CardMotionContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <span className="mr-2">•</span> Filter by location and budget
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="mr-2">•</span> Compare amenities and features
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="mr-2">•</span> View property details and virtual tours
                </li>
              </ul>
            </CardMotionContent>
            <CardMotionFooter className="justify-between">
              <span className="text-sm font-medium text-primary">Search Now</span>
              <motion.div
                animate={{ 
                  x: hoveredCard === 'search' ? 5 : 0,
                  opacity: hoveredCard === 'search' ? 1 : 0.7
                }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="h-5 w-5 text-primary" />
              </motion.div>
            </CardMotionFooter>
          </CardMotion>

          <CardMotion 
            className="relative overflow-hidden"
            interactive={true}
            delay={0.3}
            onMouseEnter={() => handleCardHover('profile')}
            onMouseLeave={handleCardLeave}
            onClick={() => navigateTo('/profile')}
          >
            <CardMotionHeader>
              <motion.div 
                className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                animate={{ 
                  scale: hoveredCard === 'profile' ? 1.1 : 1,
                  backgroundColor: hoveredCard === 'profile' ? 'rgba(var(--primary), 0.2)' : 'rgba(var(--primary), 0.1)'
                }}
                transition={{ duration: 0.3 }}
              >
                <Home className="h-6 w-6 text-primary" />
              </motion.div>
              <CardMotionTitle>My Profile</CardMotionTitle>
              <CardMotionDescription>
                Update your preferences and account details
              </CardMotionDescription>
            </CardMotionHeader>
            <CardMotionContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <span className="mr-2">•</span> Edit compatibility preferences
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="mr-2">•</span> Update contact information
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="mr-2">•</span> Manage saved properties and matches
                </li>
              </ul>
            </CardMotionContent>
            <CardMotionFooter className="justify-between">
              <span className="text-sm font-medium text-primary">View Profile</span>
              <motion.div
                animate={{ 
                  x: hoveredCard === 'profile' ? 5 : 0,
                  opacity: hoveredCard === 'profile' ? 1 : 0.7
                }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="h-5 w-5 text-primary" />
              </motion.div>
            </CardMotionFooter>
          </CardMotion>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <GlassCard className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-6 -mt-6" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-10 -mb-10" />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-medium mb-4">Your Location</h2>
              
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span>{userProfile?.profileData?.location || 'Location not set'}</span>
              </div>
              
              <p className="text-muted-foreground mb-4">
                We use your location preferences to find nearby properties and roommates.
              </p>
              
              <AnimatedButton
                size="sm"
                onClick={() => navigateTo('/profile')}
              >
                Update Location
              </AnimatedButton>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <GlassCard className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-6 -mt-6" />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-medium mb-4">Need Help?</h2>
              
              <div className="flex items-center text-muted-foreground mb-4">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <span>support@roomie-finder.com</span>
              </div>
              
              <p className="text-muted-foreground mb-4">
                Our support team is available to assist you with any questions or issues.
              </p>
              
              <AnimatedButton
                size="sm"
                variant="outline"
                onClick={() => navigateTo('/settings')}
              >
                Contact Support
              </AnimatedButton>
            </div>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
