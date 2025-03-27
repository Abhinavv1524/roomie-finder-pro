
import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { motion } from 'framer-motion';
import { Property } from '@/lib/data';
import { Home, MapPin, DollarSign, Check, X, Heart, CalendarDays, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface PropertyCardProps {
  property: Property;
  onAction: (action: 'like' | 'pass', property: Property) => void;
}

const PropertyCard = ({ property, onAction }: PropertyCardProps) => {
  const [flipped, setFlipped] = useState(false);
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction('like', property);
    toast.success(`You've saved ${property.title} to your favorites!`);
  };
  
  const handlePass = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction('pass', property);
  };
  
  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Contacting owner at ${property.ownerContact}`);
  };
  
  const handleVirtualTour = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (property.virtualTourUrl) {
      toast.info('Opening virtual tour in a new tab...');
      window.open(property.virtualTourUrl, '_blank');
    } else {
      toast.error('Virtual tour not available for this property');
    }
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
                  <Badge variant={property.roomType === 'private' ? 'default' : 'secondary'}>
                    {property.roomType === 'private' ? 'Private Room' : 'Shared Room'}
                  </Badge>
                </div>
                
                <div className="mb-4 rounded-lg overflow-hidden h-48 bg-gray-100">
                  <img 
                    src={property.imageUrl} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-xl font-medium line-clamp-1">{property.title}</h2>
                
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{property.location}</span>
                </div>
                
                <div className="flex items-center gap-2 mt-1 mb-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">${property.price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{property.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {property.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {property.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{property.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
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
                  >
                    <Heart className="mr-1" /> Save
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
              <h2 className="text-xl font-medium mb-3">{property.title}</h2>
              
              <p className="text-sm mb-4">{property.description}</p>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Nearby</h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.nearbyFacilities.map((facility) => (
                    <div key={facility} className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <AnimatedButton
                  onClick={handleVirtualTour}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={!property.virtualTourUrl}
                >
                  <ExternalLink className="mr-2" /> 
                  Virtual Tour
                </AnimatedButton>
                
                <AnimatedButton
                  onClick={handleContact}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <CalendarDays className="mr-2" /> 
                  Schedule Viewing
                </AnimatedButton>
              </div>
              
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
                  onClick={handleContact}
                  className="flex-1"
                >
                  Contact Owner
                </AnimatedButton>
              </div>
            </GlassCard>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
