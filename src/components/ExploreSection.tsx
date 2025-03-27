
import { useState } from 'react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Home, Users, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const ExploreSection = () => {
  const { exploreMode, setExploreMode, roomPreference, setRoomPreference } = useAppStore();
  const [animate, setAnimate] = useState(false);

  const handleSelectMode = (mode: 'roommate' | 'room') => {
    setAnimate(true);
    setTimeout(() => {
      setExploreMode(mode);
      setAnimate(false);
    }, 300);
  };

  const handleSelectRoomType = (type: 'shared' | 'private') => {
    setRoomPreference(type);
    toast.success(`You've selected a ${type} room. We'll show you available listings.`);
  };

  const handleReset = () => {
    setAnimate(true);
    setTimeout(() => {
      setExploreMode(null);
      setRoomPreference(null);
      setAnimate(false);
    }, 300);
  };

  return (
    <AnimatePresence mode="wait">
      {!exploreMode ? (
        <motion.div
          key="mode-selection"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          <GlassCard className="text-center">
            <h2 className="text-2xl md:text-3xl font-medium mb-6">What are you looking for?</h2>
            <p className="text-muted-foreground mb-8">
              Choose what you need and we'll find the perfect match for you
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => handleSelectMode('roommate')}
              >
                <div className="rounded-xl border border-border p-6 h-full flex flex-col items-center text-center hover:border-primary/50 hover:shadow-md transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Find a Roommate</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect with people who match your lifestyle and preferences
                  </p>
                  <div className="mt-auto flex items-center text-primary font-medium">
                    <span>Find roommates</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => handleSelectMode('room')}
              >
                <div className="rounded-xl border border-border p-6 h-full flex flex-col items-center text-center hover:border-primary/50 hover:shadow-md transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Home className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Find a Room</h3>
                  <p className="text-muted-foreground mb-4">
                    Discover available rooms and apartments that match your needs
                  </p>
                  <div className="mt-auto flex items-center text-primary font-medium">
                    <span>Browse rooms</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      ) : exploreMode === 'room' && !roomPreference ? (
        <motion.div
          key="room-type-selection"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          <GlassCard className="text-center">
            <h2 className="text-2xl md:text-3xl font-medium mb-6">What type of room do you prefer?</h2>
            <p className="text-muted-foreground mb-8">
              Choose your preferred living arrangement
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => handleSelectRoomType('shared')}
              >
                <div className="rounded-xl border border-border p-6 h-full flex flex-col items-center text-center hover:border-primary/50 hover:shadow-md transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Shared Room</h3>
                  <p className="text-muted-foreground mb-4">
                    More affordable option with shared living spaces and roommates
                  </p>
                  <div className="mt-auto flex items-center text-primary font-medium">
                    <span>View shared rooms</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => handleSelectRoomType('private')}
              >
                <div className="rounded-xl border border-border p-6 h-full flex flex-col items-center text-center hover:border-primary/50 hover:shadow-md transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Home className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Private Room</h3>
                  <p className="text-muted-foreground mb-4">
                    Your own private space with optional shared common areas
                  </p>
                  <div className="mt-auto flex items-center text-primary font-medium">
                    <span>View private rooms</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-8">
              <AnimatedButton
                variant="outline"
                onClick={handleReset}
              >
                Go Back
              </AnimatedButton>
            </div>
          </GlassCard>
        </motion.div>
      ) : exploreMode === 'room' && roomPreference ? (
        <motion.div
          key="room-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium">Available {roomPreference} Rooms</h2>
              <AnimatedButton
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                Start Over
              </AnimatedButton>
            </div>
            
            <p className="text-muted-foreground mb-6">
              These are rooms matching your preferences. Swipe left to dismiss or right to save.
            </p>
            
            <div className="text-center py-12 text-muted-foreground">
              <p>Room listings will appear here</p>
              <p className="mt-2 text-sm">We're working on loading properties that match your needs</p>
            </div>
          </GlassCard>
        </motion.div>
      ) : exploreMode === 'roommate' ? (
        <motion.div
          key="roommate-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium">Potential Roommates</h2>
              <AnimatedButton
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                Start Over
              </AnimatedButton>
            </div>
            
            <p className="text-muted-foreground mb-6">
              These are people who match your compatibility preferences. Swipe left to pass or right to connect.
            </p>
            
            <div className="text-center py-12 text-muted-foreground">
              <p>Roommate profiles will appear here</p>
              <p className="mt-2 text-sm">We're working on finding compatible matches for you</p>
            </div>
          </GlassCard>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default ExploreSection;
