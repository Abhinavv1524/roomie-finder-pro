
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search, Users, Coffee, IndianRupee, MessageCircle } from 'lucide-react';
import Logo from '@/components/Logo';
import { AnimatedButton } from '@/components/ui/animated-button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="glass-panel sticky top-0 z-10 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo size="lg" />
          
          <div className="flex items-center gap-4">
            <AnimatedButton
              variant="outline"
              size="sm"
              asChild
            >
              <Link to="/auth">Login / Sign Up</Link>
            </AnimatedButton>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-xl"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Find Your Perfect <span className="text-primary">Home</span> and <span className="text-primary">Roommate</span> in India
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  FindMyNest helps you discover compatible roommates and ideal accommodations, all tailored to your preferences and budget.
                </p>
                <div className="flex flex-wrap gap-4">
                  <AnimatedButton size="lg" asChild>
                    <Link to="/auth">Get Started</Link>
                  </AnimatedButton>
                  <AnimatedButton size="lg" variant="outline" asChild>
                    <Link to="#how-it-works">Learn More</Link>
                  </AnimatedButton>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full md:w-1/2 relative"
              >
                <div className="relative bg-card rounded-2xl overflow-hidden shadow-xl">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5">
                    <img 
                      src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="Modern apartment" 
                      className="w-full h-full object-cover mix-blend-overlay opacity-90"
                    />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 bg-card/80 backdrop-blur-md rounded-lg p-4 shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Modern 2BHK in Indiranagar</h3>
                      <div className="flex items-center text-primary font-medium">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        <span>18,000/mo</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Bangalore, Karnataka</p>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 bg-primary text-white rounded-full p-4 shadow-lg">
                  <div className="text-center">
                    <span className="block text-sm">Matches</span>
                    <span className="block text-2xl font-bold">95%</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section id="how-it-works" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">How FindMyNest Works</h2>
              <p className="text-muted-foreground">
                Our AI-powered platform makes finding the perfect roommate and accommodation simple and stress-free.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="w-10 h-10 text-primary" />,
                  title: "Find Compatible Roommates",
                  description: "Our AI matching algorithm finds roommates who share your lifestyle and preferences."
                },
                {
                  icon: <Home className="w-10 h-10 text-primary" />,
                  title: "Discover Ideal Properties",
                  description: "Browse verified properties that fit your budget and location preferences across India."
                },
                {
                  icon: <MessageCircle className="w-10 h-10 text-primary" />,
                  title: "Connect Securely",
                  description: "Chat with potential roommates and property owners directly through our secure platform."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="bg-card rounded-xl p-6 shadow-md"
                >
                  <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">{item.title}</h3>
                  <p className="text-muted-foreground text-center">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Match?</h2>
                <p className="text-lg mb-8">
                  Join thousands of users who have found their ideal living situation with FindMyNest.
                </p>
                <AnimatedButton size="lg" asChild>
                  <Link to="/auth">Get Started Now</Link>
                </AnimatedButton>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Logo size="lg" />
              <p className="text-muted-foreground mt-2">
                Finding your perfect home and roommate in India
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-medium mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Roommate Guide</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Rental Tips</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} FindMyNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
