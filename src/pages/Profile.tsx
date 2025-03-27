
import { useUser } from '@clerk/clerk-react';
import AuthWrapper from '@/components/AuthWrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useAppStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { userProfile, updateUserProfile } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isPreferencesDialogOpen, setIsPreferencesDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    age: userProfile?.profileData?.age?.toString() || '',
    gender: userProfile?.profileData?.gender || '',
    occupation: userProfile?.profileData?.occupation || '',
    budget: userProfile?.profileData?.budget?.toString() || '',
    location: userProfile?.profileData?.location || '',
    phone: userProfile?.profileData?.phone || '',
  });
  
  const [preferences, setPreferences] = useState({
    sleepingHabits: userProfile?.preferences?.sleepingHabits || '',
    cleanliness: userProfile?.preferences?.cleanliness || '',
    socialHabits: userProfile?.preferences?.socialHabits || '',
    smoking: userProfile?.preferences?.smoking || '',
    drinking: userProfile?.preferences?.drinking || '',
    schedule: userProfile?.preferences?.schedule || '',
    noiseTolerance: userProfile?.preferences?.noiseTolerance || '',
    diet: userProfile?.preferences?.diet || '',
    pets: userProfile?.preferences?.pets || '',
    security: userProfile?.preferences?.security || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handlePreferenceChange = (name: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUserProfile({
      profileData: {
        age: parseInt(formData.age) || undefined,
        gender: formData.gender,
        occupation: formData.occupation,
        budget: parseInt(formData.budget) || undefined,
        location: formData.location,
        phone: formData.phone,
      },
    });
    
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };
  
  const handleSavePreferences = () => {
    updateUserProfile({
      preferences: preferences,
    });
    
    setIsPreferencesDialogOpen(false);
    toast.success('Preferences updated successfully!');
  };

  return (
    <AuthWrapper>
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
            <h1 className="text-3xl font-medium mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              View and update your personal information
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GlassCard className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary mb-4">
                  <img
                    src={user?.imageUrl || 'https://i.pravatar.cc/150?img=11'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-xl font-medium mb-1">{userProfile?.name}</h2>
                <p className="text-muted-foreground mb-4">{userProfile?.profileData?.occupation || 'No occupation set'}</p>
                
                <div className="text-sm text-left w-full">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Email</span>
                    <span>{userProfile?.email}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{userProfile?.profileData?.phone || 'Not set'}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Location</span>
                    <span>{userProfile?.profileData?.location || 'Not set'}</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Budget</span>
                    <span>₹{userProfile?.profileData?.budget || 'Not set'}</span>
                  </div>
                </div>
                
                <div className="mt-6 w-full">
                  <AnimatedButton
                    className="w-full"
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                  </AnimatedButton>
                </div>
              </GlassCard>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2"
            >
              <GlassCard>
                <h2 className="text-2xl font-medium mb-6">
                  {isEditing ? 'Edit Profile Information' : 'Profile Information'}
                </h2>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          placeholder="Your age"
                          value={formData.age}
                          onChange={handleInputChange}
                          min="18"
                          max="100"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Input
                          id="gender"
                          name="gender"
                          placeholder="Your gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input
                          id="occupation"
                          name="occupation"
                          placeholder="Your occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Your phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="budget">Monthly Budget (₹)</Label>
                        <Input
                          id="budget"
                          name="budget"
                          type="number"
                          placeholder="Your monthly budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          min="5000"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Preferred Location</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="City, neighborhood"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <AnimatedButton onClick={handleSave}>
                        Save Changes
                      </AnimatedButton>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Age</h3>
                        <p>{userProfile?.profileData?.age || 'Not set'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
                        <p>{userProfile?.profileData?.gender || 'Not set'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Occupation</h3>
                        <p>{userProfile?.profileData?.occupation || 'Not set'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                        <p>{userProfile?.profileData?.phone || 'Not set'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Budget</h3>
                        <p>₹{userProfile?.profileData?.budget || 'Not set'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                        <p>{userProfile?.profileData?.location || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6"
              >
                <GlassCard>
                  <h2 className="text-2xl font-medium mb-6">Lifestyle Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Sleeping Habits</h3>
                      <p>{userProfile?.preferences?.sleepingHabits || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Cleanliness</h3>
                      <p>{userProfile?.preferences?.cleanliness || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Social Habits</h3>
                      <p>{userProfile?.preferences?.socialHabits || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Smoking</h3>
                      <p>{userProfile?.preferences?.smoking || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Drinking</h3>
                      <p>{userProfile?.preferences?.drinking || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Schedule</h3>
                      <p>{userProfile?.preferences?.schedule || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Noise Tolerance</h3>
                      <p>{userProfile?.preferences?.noiseTolerance || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Diet</h3>
                      <p>{userProfile?.preferences?.diet || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Pets</h3>
                      <p>{userProfile?.preferences?.pets || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Security</h3>
                      <p>{userProfile?.preferences?.security || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <AnimatedButton
                      variant="outline"
                      onClick={() => setIsPreferencesDialogOpen(true)}
                    >
                      Update Preferences
                    </AnimatedButton>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
      
      <Dialog open={isPreferencesDialogOpen} onOpenChange={setIsPreferencesDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Lifestyle Preferences</DialogTitle>
            <DialogDescription>
              Your preferences help us find the most compatible roommates for you.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sleepingHabits">Sleeping Habits</Label>
              <Select
                value={preferences.sleepingHabits}
                onValueChange={(value) => handlePreferenceChange('sleepingHabits', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your sleeping pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Early riser">Early riser</SelectItem>
                  <SelectItem value="Night owl">Night owl</SelectItem>
                  <SelectItem value="Regular schedule">Regular schedule</SelectItem>
                  <SelectItem value="Irregular schedule">Irregular schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cleanliness">Cleanliness</Label>
              <Select
                value={preferences.cleanliness}
                onValueChange={(value) => handlePreferenceChange('cleanliness', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cleanliness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Very neat">Very neat</SelectItem>
                  <SelectItem value="Clean">Clean</SelectItem>
                  <SelectItem value="Moderately clean">Moderately clean</SelectItem>
                  <SelectItem value="Relaxed">Relaxed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="socialHabits">Social Habits</Label>
              <Select
                value={preferences.socialHabits}
                onValueChange={(value) => handlePreferenceChange('socialHabits', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select social preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Very social">Very social</SelectItem>
                  <SelectItem value="Moderately social">Moderately social</SelectItem>
                  <SelectItem value="Occasionally social">Occasionally social</SelectItem>
                  <SelectItem value="Private person">Private person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smoking">Smoking</Label>
              <Select
                value={preferences.smoking}
                onValueChange={(value) => handlePreferenceChange('smoking', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select smoking preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non-smoker">Non-smoker</SelectItem>
                  <SelectItem value="Outside only">Outside only</SelectItem>
                  <SelectItem value="Regular smoker">Regular smoker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="drinking">Drinking</Label>
              <Select
                value={preferences.drinking}
                onValueChange={(value) => handlePreferenceChange('drinking', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select drinking preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non-drinker">Non-drinker</SelectItem>
                  <SelectItem value="Occasional drinker">Occasional drinker</SelectItem>
                  <SelectItem value="Regular drinker">Regular drinker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Select
                value={preferences.schedule}
                onValueChange={(value) => handlePreferenceChange('schedule', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your daily schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9-5 worker">9-5 worker</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Work from home">Work from home</SelectItem>
                  <SelectItem value="Night shift">Night shift</SelectItem>
                  <SelectItem value="Irregular hours">Irregular hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="noiseTolerance">Noise Tolerance</Label>
              <Select
                value={preferences.noiseTolerance}
                onValueChange={(value) => handlePreferenceChange('noiseTolerance', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select noise tolerance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Need silence">Need silence</SelectItem>
                  <SelectItem value="Moderate noise OK">Moderate noise OK</SelectItem>
                  <SelectItem value="Don't mind noise">Don't mind noise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="diet">Diet</Label>
              <Select
                value={preferences.diet}
                onValueChange={(value) => handlePreferenceChange('diet', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select diet preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="Vegan">Vegan</SelectItem>
                  <SelectItem value="Non-vegetarian">Non-vegetarian</SelectItem>
                  <SelectItem value="No preference">No preference</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pets">Pets</Label>
              <Select
                value={preferences.pets}
                onValueChange={(value) => handlePreferenceChange('pets', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pet preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Have pets">Have pets</SelectItem>
                  <SelectItem value="Love pets">Love pets</SelectItem>
                  <SelectItem value="No pets">No pets</SelectItem>
                  <SelectItem value="Allergic to pets">Allergic to pets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="security">Security</Label>
              <Select
                value={preferences.security}
                onValueChange={(value) => handlePreferenceChange('security', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select security importance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High priority">High priority</SelectItem>
                  <SelectItem value="Moderate priority">Moderate priority</SelectItem>
                  <SelectItem value="Low priority">Low priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <AnimatedButton variant="outline" onClick={() => setIsPreferencesDialogOpen(false)}>
              Cancel
            </AnimatedButton>
            <AnimatedButton onClick={handleSavePreferences}>
              Save Preferences
            </AnimatedButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthWrapper>
  );
};

export default Profile;
