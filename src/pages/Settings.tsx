
import { useState } from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import ProfileCreation from '@/components/ProfileCreation';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Bell, Mail, Shield, Trash, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [propertyAlerts, setPropertyAlerts] = useState(true);
  const [profilePrivacy, setProfilePrivacy] = useState('public');

  const handleDeleteAccount = () => {
    toast.error('Account deletion is currently disabled');
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
            <h1 className="text-3xl font-medium mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <GlassCard>
                  <div className="space-y-1">
                    <h2 className="text-xl font-medium">Settings</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your account settings and preferences
                    </p>
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <button
                      className="w-full text-left py-2 px-3 rounded-md text-sm font-medium bg-primary/10 text-primary"
                      onClick={() => {}}
                    >
                      Account
                    </button>
                    <button
                      className="w-full text-left py-2 px-3 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
                      onClick={() => {}}
                    >
                      Notifications
                    </button>
                    <button
                      className="w-full text-left py-2 px-3 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
                      onClick={() => {}}
                    >
                      Privacy & Security
                    </button>
                    <button
                      className="w-full text-left py-2 px-3 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
                      onClick={() => {}}
                    >
                      Help & Support
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
            
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassCard>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium">Notifications</h2>
                      <p className="text-sm text-muted-foreground">
                        Manage how you receive notifications
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications on your device
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="match-alerts">Roommate Match Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new roommate matches
                        </p>
                      </div>
                      <Switch
                        id="match-alerts"
                        checked={matchAlerts}
                        onCheckedChange={setMatchAlerts}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="property-alerts">Property Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new properties matching your criteria
                        </p>
                      </div>
                      <Switch
                        id="property-alerts"
                        checked={propertyAlerts}
                        onCheckedChange={setPropertyAlerts}
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6"
              >
                <GlassCard>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium">Privacy & Security</h2>
                      <p className="text-sm text-muted-foreground">
                        Manage your privacy and security settings
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profile-privacy" className="mb-2 block">Profile Privacy</Label>
                      <select
                        id="profile-privacy"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={profilePrivacy}
                        onChange={(e) => setProfilePrivacy(e.target.value)}
                      >
                        <option value="public">Public - Anyone can see your profile</option>
                        <option value="matched">Matched Only - Only matched users can see details</option>
                        <option value="private">Private - Hidden until you approve</option>
                      </select>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Control who can see your profile information
                      </p>
                    </div>

                    <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Danger Zone</AlertTitle>
                      <AlertDescription>
                        Deleting your account will permanently remove all your data and cannot be undone.
                      </AlertDescription>
                      <div className="mt-4">
                        <AnimatedButton
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteAccount}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Account
                        </AnimatedButton>
                      </div>
                    </Alert>
                  </div>
                </GlassCard>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6"
              >
                <GlassCard>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium">Help & Support</h2>
                      <p className="text-sm text-muted-foreground">
                        Get help with your account
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm">
                      Need help with your account or have questions about our services?
                      Our support team is available to assist you.
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>support@roomie-finder.com</span>
                    </div>
                    
                    <div className="mt-4">
                      <AnimatedButton
                        variant="outline"
                        onClick={() => toast.success('Support request sent! We\'ll get back to you soon.')}
                      >
                        Contact Support
                      </AnimatedButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </AuthWrapper>
  );
};

export default SettingsPage;
