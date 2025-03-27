import { useState } from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import ProfileCreation from '@/components/ProfileCreation';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search as SearchIcon, MapPin, Home, Wifi, Coffee, Train, School, Building, X, Users } from 'lucide-react';
import { sampleProperties } from '@/lib/data';
import { CardMotion, CardMotionContent, CardMotionDescription, CardMotionHeader, CardMotionTitle, CardMotionFooter } from '@/components/ui/card-motion';

const SearchPage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState<[number, number]>([500, 2000]);
  const [roomType, setRoomType] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [nearbyFacilities, setNearbyFacilities] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState(sampleProperties);

  const handleSearch = () => {
    const filteredResults = sampleProperties.filter((property) => {
      const locationMatch = location === '' || property.location.toLowerCase().includes(location.toLowerCase());
      const budgetMatch = property.price >= budget[0] && property.price <= budget[1];
      const roomTypeMatch = roomType === null || property.roomType === roomType;
      const amenitiesMatch = amenities.length === 0 || amenities.every((amenity) => property.amenities.includes(amenity));
      const facilitiesMatch = nearbyFacilities.length === 0 || nearbyFacilities.some((facility) => property.nearbyFacilities.includes(facility));
      
      return locationMatch && budgetMatch && roomTypeMatch && amenitiesMatch && facilitiesMatch;
    });
    
    setSearchResults(filteredResults);
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((current) => 
      current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity]
    );
  };

  const toggleFacility = (facility: string) => {
    setNearbyFacilities((current) => 
      current.includes(facility)
        ? current.filter((f) => f !== facility)
        : [...current, facility]
    );
  };

  const handleClearFilters = () => {
    setLocation('');
    setBudget([500, 2000]);
    setRoomType(null);
    setAmenities([]);
    setNearbyFacilities([]);
    setSearchResults(sampleProperties);
  };

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
            <h1 className="text-3xl font-medium mb-2">Search Properties</h1>
            <p className="text-muted-foreground">
              Find the perfect rental based on your criteria
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <GlassCard className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium">Filters</h2>
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="City, neighborhood"
                        className="pl-9"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Price Range</Label>
                      <span className="text-sm text-muted-foreground">
                        ${budget[0]} - ${budget[1]}
                      </span>
                    </div>
                    <Slider
                      defaultValue={budget}
                      min={500}
                      max={2000}
                      step={100}
                      onValueChange={(value) => setBudget(value as [number, number])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Room Type</Label>
                    <div className="flex gap-4">
                      <div 
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md border cursor-pointer transition-colors ${
                          roomType === 'private' ? 'bg-primary/10 border-primary/50' : 'border-border hover:border-primary/30'
                        }`}
                        onClick={() => setRoomType(roomType === 'private' ? null : 'private')}
                      >
                        <Home className="h-4 w-4" />
                        <span className="text-sm">Private</span>
                      </div>
                      <div 
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md border cursor-pointer transition-colors ${
                          roomType === 'shared' ? 'bg-primary/10 border-primary/50' : 'border-border hover:border-primary/30'
                        }`}
                        onClick={() => setRoomType(roomType === 'shared' ? null : 'shared')}
                      >
                        <Users className="h-4 w-4" />
                        <span className="text-sm">Shared</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Amenities</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="wifi" 
                          checked={amenities.includes('WiFi')} 
                          onCheckedChange={() => toggleAmenity('WiFi')}
                        />
                        <Label htmlFor="wifi" className="text-sm cursor-pointer">WiFi</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="gym" 
                          checked={amenities.includes('Gym')} 
                          onCheckedChange={() => toggleAmenity('Gym')}
                        />
                        <Label htmlFor="gym" className="text-sm cursor-pointer">Gym</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="laundry" 
                          checked={amenities.includes('Laundry')} 
                          onCheckedChange={() => toggleAmenity('Laundry')}
                        />
                        <Label htmlFor="laundry" className="text-sm cursor-pointer">Laundry</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="security" 
                          checked={amenities.includes('Security')} 
                          onCheckedChange={() => toggleAmenity('Security')}
                        />
                        <Label htmlFor="security" className="text-sm cursor-pointer">Security</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nearby Facilities</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="metro" 
                          checked={nearbyFacilities.includes('Metro Station')} 
                          onCheckedChange={() => toggleFacility('Metro Station')}
                        />
                        <Label htmlFor="metro" className="text-sm cursor-pointer">Metro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="university" 
                          checked={nearbyFacilities.includes('University')} 
                          onCheckedChange={() => toggleFacility('University')}
                        />
                        <Label htmlFor="university" className="text-sm cursor-pointer">University</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="office" 
                          checked={nearbyFacilities.includes('Office Hub')} 
                          onCheckedChange={() => toggleFacility('Office Hub')}
                        />
                        <Label htmlFor="office" className="text-sm cursor-pointer">Office Hub</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="mall" 
                          checked={nearbyFacilities.includes('Shopping Mall')} 
                          onCheckedChange={() => toggleFacility('Shopping Mall')}
                        />
                        <Label htmlFor="mall" className="text-sm cursor-pointer">Shopping Mall</Label>
                      </div>
                    </div>
                  </div>
                  
                  <AnimatedButton
                    className="w-full"
                    onClick={handleSearch}
                  >
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Search
                  </AnimatedButton>
                </div>
              </GlassCard>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Results ({searchResults.length})</h2>
                <div className="flex items-center gap-2">
                  {location && (
                    <div className="flex items-center gap-1 bg-primary/10 text-primary text-sm py-1 px-3 rounded-full">
                      <MapPin className="h-3 w-3" />
                      <span>{location}</span>
                      <button 
                        className="ml-1"
                        onClick={() => setLocation('')}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {roomType && (
                    <div className="flex items-center gap-1 bg-primary/10 text-primary text-sm py-1 px-3 rounded-full">
                      <Home className="h-3 w-3" />
                      <span>{roomType === 'private' ? 'Private Room' : 'Shared Room'}</span>
                      <button 
                        className="ml-1"
                        onClick={() => setRoomType(null)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchResults.map((property, index) => (
                    <CardMotion
                      key={property.id}
                      delay={0.1 * (index % 4)}
                      className="overflow-hidden"
                    >
                      <div className="h-48 overflow-hidden rounded-t-xl">
                        <img 
                          src={property.imageUrl} 
                          alt={property.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <CardMotionHeader className="pt-4">
                        <div className="flex justify-between items-start">
                          <CardMotionTitle>{property.title}</CardMotionTitle>
                          <div className="flex items-center text-sm font-medium">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              ${property.price}/mo
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          <CardMotionDescription className="mt-0">
                            {property.location}
                          </CardMotionDescription>
                        </div>
                      </CardMotionHeader>
                      <CardMotionContent>
                        <div className="line-clamp-2 text-sm mb-4">
                          {property.description}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                            {property.roomType === 'private' ? 'Private Room' : 'Shared Room'}
                          </div>
                          {property.amenities.slice(0, 3).map((amenity) => (
                            <div key={amenity} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                              {amenity}
                            </div>
                          ))}
                          {property.amenities.length > 3 && (
                            <div className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                              +{property.amenities.length - 3} more
                            </div>
                          )}
                        </div>
                      </CardMotionContent>
                      <CardMotionFooter className="pt-2">
                        <AnimatedButton className="w-full" size="sm">
                          View Details
                        </AnimatedButton>
                      </CardMotionFooter>
                    </CardMotion>
                  ))}
                </div>
              ) : (
                <GlassCard className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No properties found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to broaden your search
                  </p>
                  <AnimatedButton
                    variant="outline"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </AnimatedButton>
                </GlassCard>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </AuthWrapper>
  );
};

export default SearchPage;
