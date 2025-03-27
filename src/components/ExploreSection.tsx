
import { useState, useEffect } from 'react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Home, Users, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { sampleRoommates, sampleProperties, RoommateProfile, Property } from '@/lib/data';
import RoommateQuestionnaire from './RoommateQuestionnaire';
import RoomQuestionnaire from './RoomQuestionnaire';
import RoommateCard from './RoommateCard';
import PropertyCard from './PropertyCard';
import { calculateCompatibility } from '@/lib/compatibility';

const ExploreSection = () => {
  const { 
    exploreMode, 
    setExploreMode, 
    roomPreference, 
    setRoomPreference,
    userProfile 
  } = useAppStore();
  
  const [animate, setAnimate] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentRoommateIndex, setCurrentRoommateIndex] = useState(0);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [filteredRoommates, setFilteredRoommates] = useState<RoommateProfile[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [roommatePreferences, setRoommatePreferences] = useState<Record<string, string>>({});
  const [roomPreferences, setRoomPreferences] = useState<Record<string, any>>({});

  const handleSelectMode = (mode: 'roommate' | 'room') => {
    setAnimate(true);
    setTimeout(() => {
      setExploreMode(mode);
      setAnimate(false);
      setShowQuestionnaire(true);
    }, 300);
  };

  const handleSelectRoomType = (type: 'shared' | 'private') => {
    setRoomPreference(type);
    setShowQuestionnaire(true);
  };

  const handleReset = () => {
    setAnimate(true);
    setTimeout(() => {
      setExploreMode(null);
      setRoomPreference(null);
      setShowQuestionnaire(false);
      setAnimate(false);
      setCurrentRoommateIndex(0);
      setCurrentPropertyIndex(0);
      setFilteredRoommates([]);
      setFilteredProperties([]);
    }, 300);
  };

  const handleRoommateQuestionnaireComplete = (preferences: Record<string, string>) => {
    setRoommatePreferences(preferences);
    setShowQuestionnaire(false);
    
    // Filter and sort roommates based on preferences
    let filtered = [...sampleRoommates];
    
    // Filter by age if specified
    if (preferences.age_preference && preferences.age_preference !== 'any') {
      const [minAge, maxAge] = preferences.age_preference.split('-').map(Number);
      filtered = filtered.filter(roommate => 
        roommate.age >= minAge && roommate.age <= maxAge
      );
    }
    
    // Filter by gender if specified
    if (preferences.gender_preference && preferences.gender_preference !== 'any') {
      filtered = filtered.filter(roommate => 
        roommate.gender.toLowerCase() === preferences.gender_preference
      );
    }
    
    // Filter by occupation if specified
    if (preferences.occupation && preferences.occupation !== 'any') {
      filtered = filtered.filter(roommate => {
        const occupation = roommate.occupation.toLowerCase();
        if (preferences.occupation === 'student') {
          return occupation.includes('student');
        } else if (preferences.occupation === 'professional') {
          return occupation.includes('professional') || 
                 occupation.includes('manager') || 
                 occupation.includes('engineer');
        } else if (preferences.occupation === 'remote') {
          return occupation.includes('remote') || occupation.includes('freelance');
        }
        return true;
      });
    }
    
    // Calculate compatibility scores if user profile exists
    if (userProfile) {
      filtered.forEach(roommate => {
        const score = calculateCompatibility(userProfile, roommate);
        roommate.compatibilityScores[userProfile.userId] = score;
      });
      
      // Sort by compatibility score
      filtered.sort((a, b) => 
        (b.compatibilityScores[userProfile.userId] || 0) - 
        (a.compatibilityScores[userProfile.userId] || 0)
      );
    }
    
    setFilteredRoommates(filtered.length > 0 ? filtered : sampleRoommates);
    toast.success(`Found ${filtered.length} potential roommates based on your preferences!`);
  };

  const handleRoomQuestionnaireComplete = (preferences: Record<string, any>) => {
    setRoomPreferences(preferences);
    setShowQuestionnaire(false);
    
    // Filter properties based on preferences and room type
    let filtered = [...sampleProperties];
    
    // Filter by room type
    if (roomPreference) {
      filtered = filtered.filter(property => property.roomType === roomPreference);
    }
    
    // Filter by budget if specified
    if (preferences.budget) {
      const [minBudget, maxBudget] = preferences.budget.split('-').map(str => 
        parseInt(str.replace(/\D/g, ''))
      );
      filtered = filtered.filter(property => 
        property.price >= minBudget && property.price <= maxBudget
      );
    }
    
    // Filter by amenities if specified
    if (preferences.amenities && preferences.amenities.length > 0) {
      filtered = filtered.filter(property => 
        preferences.amenities.some((amenity: string) => 
          property.amenities.map(a => a.toLowerCase()).includes(amenity.toLowerCase())
        )
      );
    }
    
    // Filter by location if specified
    if (preferences.location && preferences.location.trim() !== '') {
      const locationSearch = preferences.location.toLowerCase();
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(locationSearch)
      );
    }
    
    setFilteredProperties(filtered.length > 0 ? filtered : sampleProperties.filter(p => p.roomType === roomPreference));
    toast.success(`Found ${filtered.length} available ${roomPreference} rooms matching your criteria!`);
  };

  const handleRoommateAction = (action: 'like' | 'pass', roommate: RoommateProfile) => {
    // Move to the next roommate
    if (currentRoommateIndex < filteredRoommates.length - 1) {
      setCurrentRoommateIndex(prev => prev + 1);
    } else {
      toast.info("You've gone through all potential roommates! Start over or adjust your search.");
      setCurrentRoommateIndex(0);
    }
  };

  const handlePropertyAction = (action: 'like' | 'pass', property: Property) => {
    // Move to the next property
    if (currentPropertyIndex < filteredProperties.length - 1) {
      setCurrentPropertyIndex(prev => prev + 1);
    } else {
      toast.info("You've gone through all available rooms! Start over or adjust your search.");
      setCurrentPropertyIndex(0);
    }
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
      ) : exploreMode === 'room' && roomPreference && showQuestionnaire ? (
        <motion.div
          key="room-questionnaire"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          <RoomQuestionnaire onComplete={handleRoomQuestionnaireComplete} />
        </motion.div>
      ) : exploreMode === 'room' && roomPreference && !showQuestionnaire ? (
        <motion.div
          key="room-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          <GlassCard className="mb-6">
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
            
            <p className="text-muted-foreground mb-4">
              These rooms match your preferences. Swipe or use the buttons to navigate.
            </p>
            
            {filteredProperties.length > 0 ? (
              <div className="text-sm text-muted-foreground mb-4">
                Showing {currentPropertyIndex + 1} of {filteredProperties.length} results
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No rooms found matching your criteria</p>
                <p className="mt-2 text-sm">Try adjusting your preferences</p>
              </div>
            )}
          </GlassCard>
          
          {filteredProperties.length > 0 && (
            <PropertyCard 
              property={filteredProperties[currentPropertyIndex]} 
              onAction={handlePropertyAction}
            />
          )}
        </motion.div>
      ) : exploreMode === 'roommate' && showQuestionnaire ? (
        <motion.div
          key="roommate-questionnaire"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          <RoommateQuestionnaire onComplete={handleRoommateQuestionnaireComplete} />
        </motion.div>
      ) : exploreMode === 'roommate' && !showQuestionnaire ? (
        <motion.div
          key="roommate-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          <GlassCard className="mb-6">
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
            
            <p className="text-muted-foreground mb-4">
              These people match your compatibility preferences. Swipe or use the buttons to navigate.
            </p>
            
            {filteredRoommates.length > 0 ? (
              <div className="text-sm text-muted-foreground mb-4">
                Showing {currentRoommateIndex + 1} of {filteredRoommates.length} results
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No roommates found matching your criteria</p>
                <p className="mt-2 text-sm">Try adjusting your preferences</p>
              </div>
            )}
          </GlassCard>
          
          {filteredRoommates.length > 0 && (
            <RoommateCard 
              roommate={filteredRoommates[currentRoommateIndex]} 
              onAction={handleRoommateAction}
            />
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default ExploreSection;
