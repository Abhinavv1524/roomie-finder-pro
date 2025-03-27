
import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { motion } from 'framer-motion';
import { RoommateProfile } from '@/lib/data';
import { useAppStore } from '@/lib/store';
import { Heart, X, MessageCircle, User, Home, Briefcase, DollarSign, Check } from 'lucide-react';
import { toast } from 'sonner';
import { getCompatibilityColor, getCompatibilityDescription } from '@/lib/compatibility';

interface RoommateCardProps {
  roommate: RoommateProfile;
  onAction: (action: 'like' | 'pass', roommate: RoommateProfile) => void;
}

const RoommateCard = ({ roommate, onAction }: RoommateCardProps) => {
  const { 
    userProfile, 
    savedRoommates, 
    addSavedRoommate, 
    addSavedContact, 
    setMessagingOpen,
    setActiveContactId
  } = useAppStore();
  const [flipped, setFlipped] = useState(false);
  
  const compatibilityScore = userProfile && roommate.compatibilityScores[userProfile.userId] 
    ? roommate.compatibilityScores[userProfile.userId]
    : Math.floor(Math.random() * 40) + 60; // Fallback 60-100% for demo
  
  const compatibilityColor = getCompatibilityColor(compatibilityScore);
  const compatibilityText = getCompatibilityDescription(compatibilityScore);
  const isLiked = savedRoommates.includes(roommate.id);
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isLiked) {
      addSavedRoommate(roommate.id);
      
      // Also add to contacts for messaging
      addSavedContact({
        id: roommate.id,
        name: roommate.name,
        avatar: roommate.avatar,
        lastMessage: "Hi there! I'm interested in connecting as potential roommates.",
        lastMessageTime: new Date(),
        unreadCount: 0,
        online: Math.random() > 0.5,
        type: 'roommate'
      });
      
      toast.success(`You've liked ${roommate.name}. We'll notify you if they match with you!`);
    }
    
    onAction('like', roommate);
  };
  
  const handlePass = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction('pass', roommate);
  };
  
  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Add to contacts if not already saved
    if (!savedRoommates.includes(roommate.id)) {
      addSavedRoommate(roommate.id);
      addSavedContact({
        id: roommate.id,
        name: roommate.name,
        avatar: roommate.avatar,
        lastMessage: "Hi there! I'm interested in connecting as potential roommates.",
        lastMessageTime: new Date(),
        unreadCount: 0,
        online: Math.random() > 0.5,
        type: 'roommate'
      });
    }
    
    // Open messaging with this contact
    setActiveContactId(roommate.id);
    setMessagingOpen(true);
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto cursor-pointer"
      onClick={handleFlip}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative preserve-3d w-full" style={{ perspective: "1000px" }}>
        <motion.div
          className="backface-hidden w-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ backfaceVisibility: "hidden" }}
        >
          {!flipped ? (
            // Front Card
            <GlassCard className="w-full">
              <div className="relative">
                <div className="absolute top-2 right-2 z-10">
                  <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${compatibilityColor}`}>
                    {compatibilityScore}% {compatibilityText}
                  </div>
                </div>
                
                {isLiked && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="px-3 py-1 rounded-full bg-green-500/90 text-white text-sm font-medium flex items-center gap-1">
                      <Check className="h-4 w-4" /> Matched
                    </div>
                  </div>
                )}
                
                <div className="mb-4 rounded-lg overflow-hidden h-64 bg-gray-100">
                  <img 
                    src={roommate.avatar} 
                    alt={roommate.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-2xl font-medium">{roommate.name}, {roommate.age}</h2>
                
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{roommate.gender}</span>
                  
                  <Briefcase className="h-4 w-4 ml-3" />
                  <span>{roommate.occupation}</span>
                </div>
                
                <div className="flex items-center gap-2 mt-1 mb-4 text-muted-foreground">
                  <Home className="h-4 w-4" />
                  <span>{roommate.location}</span>
                  
                  <DollarSign className="h-4 w-4 ml-3" />
                  <span>₹{roommate.budget.toLocaleString()}/month</span>
                </div>
                
                <p className="text-sm line-clamp-2 mb-4">{roommate.bio}</p>
                
                <div className="flex gap-2 mt-4">
                  <AnimatedButton
                    onClick={handlePass}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="mr-1" /> Pass
                  </AnimatedButton>
                  
                  <AnimatedButton
                    onClick={handleLike}
                    className="flex-1"
                    variant={isLiked ? "outline" : "default"}
                  >
                    <Heart className={`mr-1 ${isLiked ? "fill-primary" : ""}`} /> 
                    {isLiked ? 'Liked' : 'Like'}
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>
          ) : (
            // Show empty div when flipped
            <div className="invisible"></div>
          )}
        </motion.div>
        
        {/* Back Card */}
        <motion.div
          className="backface-hidden w-full absolute top-0 left-0"
          animate={{ rotateY: flipped ? 0 : -180 }}
          initial={{ rotateY: -180 }}
          transition={{ duration: 0.5 }}
          style={{ backfaceVisibility: "hidden" }}
        >
          {flipped && (
            <GlassCard className="w-full">
              <h2 className="text-2xl font-medium mb-4">{roommate.name}'s Preferences</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Sleeping Habits</p>
                  <p className="text-sm text-muted-foreground">{roommate.preferences.sleepingHabits}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Cleanliness</p>
                  <p className="text-sm text-muted-foreground">{roommate.preferences.cleanliness}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Social Habits</p>
                  <p className="text-sm text-muted-foreground">{roommate.preferences.socialHabits}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Smoking</p>
                  <p className="text-sm text-muted-foreground">{roommate.preferences.smoking}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Drinking</p>
                  <p className="text-sm text-muted-foreground">{roommate.preferences.drinking}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Schedule</p>
                  <p className="text-sm text-muted-foreground">{roommate.preferences.schedule}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Noise Tolerance</p>
                  <p className="text-sm text-muted-foreground">{roommate.preferences.noiseTolerance}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Dietary Preferences</p>
                  <p className="text-sm text-muted-foreground">{roommate.preferences.diet}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Pets</p>
                  <p className="text-sm text-muted-foreground">{roommate.preferences.pets}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Security Concerns</p>
                  <p className="text-sm text-muted-foreground">{roommate.preferences.security}</p>
                </div>
              </div>
              
              <p className="text-sm mb-6">{roommate.bio}</p>
              
              <div className="flex gap-2">
                <AnimatedButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setFlipped(false);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </AnimatedButton>
                
                <AnimatedButton
                  onClick={handleMessage}
                  className="flex-1"
                >
                  <MessageCircle className="mr-1" /> Message
                </AnimatedButton>
              </div>
            </GlassCard>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RoommateCard;
