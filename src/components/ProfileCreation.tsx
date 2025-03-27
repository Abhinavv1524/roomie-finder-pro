
import { useState } from 'react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import CompatibilityQuestionnaire from '@/components/CompatibilityQuestionnaire';

const ProfileCreation = () => {
  const { userProfile, updateUserProfile, isProfileCreationOpen, setProfileCreationOpen } = useAppStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    occupation: '',
    phone: '',
    budget: '',
    location: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the user profile with the form data
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
    
    // Move to the compatibility questionnaire
    setStep(2);
  };

  const handleCancel = () => {
    setProfileCreationOpen(false);
  };

  if (!isProfileCreationOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg mx-auto"
      >
        {step === 1 ? (
          <GlassCard className="w-full">
            <h2 className="text-2xl font-medium mb-6">Complete Your Profile</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
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
                    required
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
                    required
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
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Budget ($)</Label>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    placeholder="Your monthly budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                    min="100"
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
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8">
                <AnimatedButton
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </AnimatedButton>
                
                <AnimatedButton type="submit">
                  Next: Compatibility Questions
                </AnimatedButton>
              </div>
            </form>
          </GlassCard>
        ) : (
          <CompatibilityQuestionnaire />
        )}
      </motion.div>
    </div>
  );
};

export default ProfileCreation;
