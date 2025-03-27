
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
import { Search as SearchIcon, MapPin, Home, X, Users, IndianRupee, Calendar, Phone, Mail, Star } from 'lucide-react';
import { sampleProperties } from '@/lib/data';
import { CardMotion, CardMotionContent, CardMotionDescription, CardMotionHeader, CardMotionTitle, CardMotionFooter } from '@/components/ui/card-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';

// List of Indian locations
const indianLocations = [
  "Mumbai, Maharashtra", 
  "Delhi, NCR", 
  "Bangalore, Karnataka", 
  "Hyderabad, Telangana", 
  "Chennai, Tamil Nadu", 
  "Kolkata, West Bengal", 
  "Pune, Maharashtra", 
  "Ahmedabad, Gujarat", 
  "Jaipur, Rajasthan", 
  "Lucknow, Uttar Pradesh",
  "Chandigarh", 
  "Kochi, Kerala", 
  "Goa", 
  "Indore, Madhya Pradesh", 
  "Bhubaneswar, Odisha",
  "Dehradun, Uttarakhand",
  "Guwahati, Assam",
  "Noida, Uttar Pradesh",
  "Gurgaon, Haryana",
  "Mysore, Karnataka",
  "Nagpur, Maharashtra",
  "Surat, Gujarat",
  "Vadodara, Gujarat",
  "Visakhapatnam, Andhra Pradesh"
];

const SearchPage = () => {
  const navigate = useNavigate();
  const { addSavedProperty, addSavedContact, savedProperties } = useAppStore();
  
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState<[number, number]>([5000, 30000]);
  const [roomType, setRoomType] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [nearbyFacilities, setNearbyFacilities] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState(sampleProperties);
  
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  
  // Show location dropdown
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(indianLocations);
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    
    if (value.length > 0) {
      setShowLocationDropdown(true);
      setFilteredLocations(
        indianLocations.filter(loc => 
          loc.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setShowLocationDropdown(false);
    }
  };
  
  const selectLocation = (loc: string) => {
    setLocation(loc);
    setShowLocationDropdown(false);
  };

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
    setBudget([5000, 30000]);
    setRoomType(null);
    setAmenities([]);
    setNearbyFacilities([]);
    setSearchResults(sampleProperties);
  };
  
  const viewPropertyDetails = (property: any) => {
    setSelectedProperty(property);
    setIsPropertyDialogOpen(true);
  };
  
  const handleSaveProperty = (property: any) => {
    const savedProperty = {
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.price,
      imageUrl: property.imageUrl,
      savedAt: new Date(),
    };
    
    addSavedProperty(savedProperty);
    
    // Animation here (in real implementation)
    toast.success('Property saved to your favorites!', {
      description: 'You can view it in your saved properties section.'
    });
  };
  
  const handleContactOwner = () => {
    if (!selectedProperty) return;
    
    const newContact = {
      id: selectedProperty.id,
      name: selectedProperty.owner.name,
      avatar: selectedProperty.owner.avatar,
      type: 'propertyOwner' as const,
      lastMessageTime: new Date(),
    };
    
    addSavedContact(newContact);
    
    toast.success('Contact added!', {
      description: 'You can now message this property owner.'
    });
    
    setIsContactFormOpen(false);
    setTimeout(() => {
      setIsPropertyDialogOpen(false);
    }, 500);
  };
  
  const isPropertySaved = (propertyId: string) => {
    return savedProperties.some(p => p.id === propertyId);
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
                        onChange={handleLocationChange}
                        onFocus={() => setShowLocationDropdown(location.length > 0)}
                        onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                      />
                      
                      {showLocationDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-card rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredLocations.length > 0 ? (
                            <ul className="py-1">
                              {filteredLocations.map((loc, index) => (
                                <li 
                                  key={index}
                                  className="px-3 py-2 text-sm hover:bg-primary/10 cursor-pointer"
                                  onMouseDown={() => selectLocation(loc)}
                                >
                                  {loc}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="px-3 py-2 text-sm text-muted-foreground">No locations found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Price Range</Label>
                      <span className="text-sm text-muted-foreground">
                        ₹{budget[0]} - ₹{budget[1]}
                      </span>
                    </div>
                    <Slider
                      defaultValue={budget}
                      min={5000}
                      max={50000}
                      step={1000}
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
                      <div className="h-48 overflow-hidden rounded-t-xl relative">
                        <img 
                          src={property.imageUrl} 
                          alt={property.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        {property.virtualTour && (
                          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                            Virtual Tour Available
                          </div>
                        )}
                      </div>
                      <CardMotionHeader className="pt-4">
                        <div className="flex justify-between items-start">
                          <CardMotionTitle>{property.title}</CardMotionTitle>
                          <div className="flex items-center text-sm font-medium">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              ₹{property.price}/mo
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
                        <AnimatedButton 
                          className="w-full" 
                          size="sm"
                          onClick={() => viewPropertyDetails(property)}
                        >
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
      
      {/* Property Details Dialog */}
      <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProperty && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProperty.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedProperty.location}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="relative aspect-video">
                    <img 
                      src={selectedProperty.imageUrl} 
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                    
                    {selectedProperty.virtualTour && (
                      <div className="absolute bottom-4 right-4">
                        <AnimatedButton size="sm">
                          View 3D Tour
                        </AnimatedButton>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                    <div className="flex flex-col items-center bg-muted rounded-md p-3">
                      <IndianRupee className="h-5 w-5 text-primary mb-1" />
                      <span className="text-lg font-semibold">₹{selectedProperty.price}/mo</span>
                      <span className="text-xs text-muted-foreground">Rent</span>
                    </div>
                    
                    <div className="flex flex-col items-center bg-muted rounded-md p-3">
                      <Home className="h-5 w-5 text-primary mb-1" />
                      <span className="text-lg font-semibold">{selectedProperty.roomType === 'private' ? 'Private' : 'Shared'}</span>
                      <span className="text-xs text-muted-foreground">Room Type</span>
                    </div>
                    
                    <div className="flex flex-col items-center bg-muted rounded-md p-3">
                      <Calendar className="h-5 w-5 text-primary mb-1" />
                      <span className="text-lg font-semibold">Immediate</span>
                      <span className="text-xs text-muted-foreground">Availability</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedProperty.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Nearby</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.nearbyFacilities.map((facility: string) => (
                        <Badge key={facility} variant="outline">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <AnimatedButton 
                      variant={isPropertySaved(selectedProperty.id) ? "outline" : "default"}
                      onClick={() => handleSaveProperty(selectedProperty)}
                      disabled={isPropertySaved(selectedProperty.id)}
                    >
                      {isPropertySaved(selectedProperty.id) ? 'Saved to Favorites' : 'Save to Favorites'}
                    </AnimatedButton>
                    
                    <AnimatedButton onClick={() => setIsContactFormOpen(true)}>
                      Contact Owner
                    </AnimatedButton>
                  </div>
                </TabsContent>
                
                <TabsContent value="amenities" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProperty.amenities.map((amenity: string) => (
                      <div key={amenity} className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {amenity === 'WiFi' && <SearchIcon className="h-4 w-4 text-primary" />}
                          {amenity === 'Gym' && <SearchIcon className="h-4 w-4 text-primary" />}
                          {amenity === 'Laundry' && <SearchIcon className="h-4 w-4 text-primary" />}
                          {amenity === 'Security' && <SearchIcon className="h-4 w-4 text-primary" />}
                          {!['WiFi', 'Gym', 'Laundry', 'Security'].includes(amenity) && 
                            <SearchIcon className="h-4 w-4 text-primary" />
                          }
                        </div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="contact" className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
                    <div className="h-16 w-16 rounded-full overflow-hidden">
                      <img 
                        src={selectedProperty.owner?.avatar || 'https://i.pravatar.cc/150?img=68'} 
                        alt="Property Owner" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">{selectedProperty.owner?.name || 'Property Owner'}</h3>
                      <div className="flex items-center text-muted-foreground">
                        <Star className="h-4 w-4 text-primary fill-primary mr-1" />
                        <span>4.8 • 24 Properties</span>
                      </div>
                    </div>
                  </div>
                  
                  {isContactFormOpen ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Contact details will be shared once you connect with the owner.
                      </p>
                      
                      <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="message">Message (Optional)</Label>
                          <textarea 
                            id="message"
                            className="w-full min-h-[100px] p-3 rounded-md border bg-background"
                            placeholder="I'm interested in this property and would like to know more..."
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <AnimatedButton 
                          variant="outline"
                          onClick={() => setIsContactFormOpen(false)}
                        >
                          Cancel
                        </AnimatedButton>
                        <AnimatedButton onClick={handleContactOwner}>
                          Add to Contacts
                        </AnimatedButton>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <p className="text-muted-foreground">
                        Get in touch with the property owner to learn more about this listing.
                      </p>
                      
                      <AnimatedButton onClick={() => setIsContactFormOpen(true)}>
                        Contact Owner
                      </AnimatedButton>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AuthWrapper>
  );
};

export default SearchPage;
