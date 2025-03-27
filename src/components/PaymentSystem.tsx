
import { useState } from 'react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { X, CreditCard, Wallet, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Property } from '@/lib/data';
import { toast } from 'sonner';

interface PaymentSystemProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property;
}

const PaymentSystem = ({ isOpen, onClose, property }: PaymentSystemProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [saveDetails, setSaveDetails] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    upiId: '',
  });

  const securityDeposit = property ? property.price : 15000; // Default if no property

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would process the payment through a payment gateway
    toast.success("Payment processing started! You'll receive a confirmation shortly.");
    
    // Simulate payment processing
    setTimeout(() => {
      toast.success("Security deposit payment successful!");
      onClose();
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <motion.div
        className="relative z-10 w-full max-w-md p-1"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: isOpen ? 0 : 20, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <GlassCard className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Payment - Security Deposit</h2>
            <button 
              onClick={onClose} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {property && (
            <div className="mb-6">
              <h3 className="font-medium">{property.title}</h3>
              <p className="text-sm text-muted-foreground">{property.location}</p>
            </div>
          )}
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <div>
                <p className="font-medium">Security Deposit</p>
                <p className="text-sm text-muted-foreground">Refundable after tenancy ends</p>
              </div>
              <p className="text-lg font-medium">₹{securityDeposit.toLocaleString()}</p>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <div>
                <p className="font-medium">Processing Fee</p>
                <p className="text-sm text-muted-foreground">Non-refundable</p>
              </div>
              <p className="text-lg font-medium">₹499</p>
            </div>
            
            <div className="flex justify-between items-center pb-2 text-lg font-medium">
              <p>Total Amount</p>
              <p>₹{(securityDeposit + 499).toLocaleString()}</p>
            </div>
          </div>
          
          <form onSubmit={handlePaymentSubmit}>
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Select Payment Method</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 rounded-md border border-border p-3 cursor-pointer hover:bg-accent/30 transition-colors">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-primary" />
                        <span>UPI / Net Banking</span>
                      </div>
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1280px-UPI-Logo-vector.svg.png" 
                        alt="UPI" 
                        className="h-6"
                      />
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border border-border p-3 cursor-pointer hover:bg-accent/30 transition-colors">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span>Credit / Debit Card</span>
                      </div>
                      <div className="flex gap-1">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
                          alt="Visa" 
                          className="h-4"
                        />
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" 
                          alt="Mastercard" 
                          className="h-4"
                        />
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {paymentMethod === 'upi' && (
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="upiId">Enter UPI ID</Label>
                  <Input
                    id="upiId"
                    name="upiId"
                    placeholder="yourid@upi"
                    value={paymentDetails.upiId}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: name@okicici or name@ybl
                  </p>
                </div>
              </div>
            )}
            
            {paymentMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="XXXX XXXX XXXX XXXX"
                    value={paymentDetails.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="John Doe"
                    value={paymentDetails.cardName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                    <Input
                      id="cardExpiry"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={paymentDetails.cardExpiry}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardCVV">CVV</Label>
                    <Input
                      id="cardCVV"
                      name="cardCVV"
                      type="password"
                      placeholder="XXX"
                      maxLength={3}
                      value={paymentDetails.cardCVV}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2 mb-6">
              <Switch
                id="save-details"
                checked={saveDetails}
                onCheckedChange={setSaveDetails}
              />
              <Label htmlFor="save-details">Save payment details for future</Label>
            </div>
            
            <div className="rounded-md bg-secondary/50 p-3 mb-6 flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Your payment is secure and encrypted. The security deposit is fully refundable 
                at the end of your tenancy, subject to the terms and conditions.
              </p>
            </div>
            
            <div className="flex justify-end gap-4">
              <AnimatedButton
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </AnimatedButton>
              
              <AnimatedButton type="submit">
                Pay ₹{(securityDeposit + 499).toLocaleString()}
              </AnimatedButton>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default PaymentSystem;
