
import { useState, useEffect, useRef } from 'react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Send, User, VideoIcon, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore, SavedContact } from '@/lib/store';
import { toast } from 'sonner';

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isFromCurrentUser: boolean;
};

interface MessagingSystemProps {
  isOpen: boolean;
  onClose: () => void;
  initialContactId?: string;
}

// Predefined message templates for different contact types
const messageTemplates = {
  roommate: [
    "Hi there! I noticed we matched as potential roommates.",
    "Hello! I'm interested in knowing more about your living preferences.",
    "Would you be interested in viewing some apartments together?",
    "What areas of the city are you looking to live in?",
    "I'm looking for a place starting next month. What's your timeline?",
    "Do you have any specific requirements for a living space?"
  ],
  propertyOwner: [
    "Is this property still available?",
    "I'm interested in scheduling a viewing. When would be a good time?",
    "What's the minimum lease duration?",
    "Are utilities included in the rent?",
    "Is the security deposit negotiable?",
    "Are pets allowed in the property?"
  ]
};

// Generate contextually relevant replies
const generateReply = (message: string, contactType: 'roommate' | 'propertyOwner'): string => {
  // Simple keyword-based response system
  const lowerMsg = message.toLowerCase();
  
  // General responses
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg.includes('hey')) {
    return "Hello! How can I help you today?";
  }
  
  if (contactType === 'roommate') {
    if (lowerMsg.includes('when') && (lowerMsg.includes('move') || lowerMsg.includes('available'))) {
      return "I'm looking to move in within the next 30 days. How about you?";
    }
    
    if (lowerMsg.includes('budget') || lowerMsg.includes('rent') || lowerMsg.includes('price')) {
      return "My budget is between ₹10,000-₹15,000 per month, including utilities. Does that work for you?";
    }
    
    if (lowerMsg.includes('prefer') || lowerMsg.includes('area') || lowerMsg.includes('location')) {
      return "I prefer areas near the city center or with good public transport. South Delhi and Gurgaon are my top choices.";
    }
    
    if (lowerMsg.includes('meet') || lowerMsg.includes('coffee') || lowerMsg.includes('chat')) {
      return "Yes, I'd be happy to meet up! How about coffee this weekend to discuss more?";
    }
    
    // Default roommate response
    return "Thanks for reaching out! I'm looking for someone clean, respectful of privacy, and reliable with rent. What are your top requirements in a roommate?";
  } else {
    // Property owner responses
    if (lowerMsg.includes('available')) {
      return "Yes, the property is still available! When would you like to schedule a viewing?";
    }
    
    if (lowerMsg.includes('viewing') || lowerMsg.includes('visit') || lowerMsg.includes('see')) {
      return "I can arrange a viewing this weekend. Would Saturday or Sunday work better for you?";
    }
    
    if (lowerMsg.includes('deposit') || lowerMsg.includes('security')) {
      return "The security deposit is equal to two months of rent. It's fully refundable at the end of your lease period.";
    }
    
    if (lowerMsg.includes('utilities') || lowerMsg.includes('bills') || lowerMsg.includes('water') || lowerMsg.includes('electricity')) {
      return "Water is included in the rent. Electricity and internet will be separate based on your usage.";
    }
    
    if (lowerMsg.includes('pet') || lowerMsg.includes('dog') || lowerMsg.includes('cat')) {
      return "Small pets are allowed with an additional deposit of ₹5,000. Please let me know what pet you have.";
    }
    
    // Default property owner response
    return "Thank you for your interest in the property! The minimum lease term is 11 months. Let me know if you have any other questions.";
  }
};

// Get saved message data for a contact (or create new messages if none exist)
const getSavedMessages = (contactId: string, savedContacts: SavedContact[]): Message[] => {
  const contact = savedContacts.find(c => c.id === contactId);
  const contactType = contact?.type || 'roommate';
  
  // If there's a last message, create a chat history
  if (contact?.lastMessage) {
    // Create a basic conversation with 2-6 messages
    const numMessages = Math.floor(Math.random() * 4) + 2;
    const messages: Message[] = [];
    
    for (let i = 0; i < numMessages; i++) {
      const isFromCurrentUser = i % 2 === 0;
      const messageText = isFromCurrentUser 
        ? messageTemplates[contactType][i % messageTemplates[contactType].length]
        : generateReply(messageTemplates[contactType][i % messageTemplates[contactType].length], contactType);
        
      messages.push({
        id: `${contactId}-msg-${i}`,
        sender: isFromCurrentUser ? 'You' : contactId,
        text: messageText,
        timestamp: new Date(Date.now() - (numMessages - i) * 3600000),
        isFromCurrentUser
      });
    }
    
    // Add the actual last message if it exists
    if (contact.lastMessage) {
      messages.push({
        id: `${contactId}-msg-last`,
        sender: 'You',
        text: contact.lastMessage,
        timestamp: contact.lastMessageTime || new Date(),
        isFromCurrentUser: true
      });
    }
    
    return messages;
  }
  
  // Return empty array if no message history
  return [];
};

const MessagingSystem = ({ isOpen, onClose, initialContactId }: MessagingSystemProps) => {
  const { savedContacts, addSavedContact } = useAppStore();
  const [activeContactId, setActiveContactId] = useState<string | null>(initialContactId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showContacts, setShowContacts] = useState(!initialContactId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [contacts, setContacts] = useState<SavedContact[]>(savedContacts);

  // Initialize with saved contacts or demo contacts if none exist
  useEffect(() => {
    if (savedContacts.length > 0) {
      setContacts(savedContacts);
    } else {
      const demoContacts: SavedContact[] = [
        {
          id: "demo-roommate-1",
          name: "Rahul Sharma",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          lastMessage: "Saturday afternoon works for me",
          lastMessageTime: new Date(Date.now() - 1 * 3600000),
          unreadCount: 0,
          online: true,
          type: 'roommate'
        },
        {
          id: "demo-owner-1",
          name: "Priya Patel",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          lastMessage: "Is the room still available?",
          lastMessageTime: new Date(Date.now() - 5 * 3600000),
          unreadCount: 2,
          online: false,
          type: 'propertyOwner'
        }
      ];
      
      // Add demo contacts to store
      demoContacts.forEach(contact => {
        addSavedContact(contact);
      });
      
      setContacts(demoContacts);
    }
  }, [savedContacts, addSavedContact]);

  // Load messages when active contact changes
  useEffect(() => {
    if (activeContactId) {
      const savedMessageHistory = getSavedMessages(activeContactId, contacts);
      setMessages(savedMessageHistory);
    }
  }, [activeContactId, contacts]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeContactId) return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      text: newMessage,
      timestamp: new Date(),
      isFromCurrentUser: true
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Find the active contact to determine type
    const activeContact = contacts.find(c => c.id === activeContactId);
    const contactType = activeContact?.type || 'roommate';
    
    // Generate reply after a delay
    const replyDelay = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(() => {
      const replyText = generateReply(newMessage, contactType);
      
      const replyMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: activeContactId,
        text: replyText,
        timestamp: new Date(),
        isFromCurrentUser: false
      };
      
      setMessages(prevMessages => [...prevMessages, replyMessage]);
    }, replyDelay);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatContactTime = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return formatTime(date);
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleContactClick = (contactId: string) => {
    setActiveContactId(contactId);
    setShowContacts(false);
    
    // Update unread count
    setContacts(prevContacts => 
      prevContacts.map(c => 
        c.id === contactId 
          ? { ...c, unreadCount: 0 } 
          : c
      )
    );
  };

  const handleBackToContacts = () => {
    setShowContacts(true);
    setActiveContactId(null);
  };

  const handleStartVideoCall = () => {
    toast.info("Video call feature will be available soon!");
  };

  const handleStartVoiceCall = () => {
    toast.info("Voice call feature will be available soon!");
  };

  const activeContact = contacts.find(c => c.id === activeContactId);

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <motion.div
        className="relative z-10 w-full max-w-md h-[80vh] sm:h-[70vh] p-1"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: isOpen ? 0 : 100, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <GlassCard className="flex flex-col h-full w-full">
          {showContacts ? (
            // Contacts List View
            <>
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-medium">Messages</h2>
                <button 
                  onClick={onClose} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <ScrollArea className="flex-1 h-0">
                <div className="divide-y divide-border">
                  {contacts.length > 0 ? (
                    contacts.map(contact => (
                      <div 
                        key={contact.id}
                        className="flex items-center p-3 gap-3 hover:bg-accent/30 cursor-pointer transition-colors"
                        onClick={() => handleContactClick(contact.id)}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                            <AvatarFallback>
                              <User className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          {contact.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <p className="font-medium truncate">{contact.name}</p>
                            {contact.lastMessageTime && (
                              <span className="text-xs text-muted-foreground">
                                {formatContactTime(contact.lastMessageTime)}
                              </span>
                            )}
                          </div>
                          {contact.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                          )}
                        </div>
                        
                        {contact.unreadCount ? (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs text-white font-medium">
                            {contact.unreadCount}
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">Save roommates or properties to start messaging</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            // Chat View
            <>
              <div className="p-4 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleBackToContacts}
                    className="text-muted-foreground hover:text-foreground mr-1 transition-colors"
                  >
                    <X size={18} />
                  </button>
                  {activeContact && (
                    <>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-none">{activeContact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {activeContact.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleStartVoiceCall}
                    className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                  >
                    <Phone size={18} />
                  </button>
                  <button 
                    onClick={handleStartVideoCall}
                    className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                  >
                    <VideoIcon size={18} />
                  </button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="flex gap-2 max-w-[80%]">
                          {!message.isFromCurrentUser && (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarImage 
                                src={activeContact?.avatar} 
                                alt={activeContact?.name || 'Contact'} 
                              />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div>
                            <div 
                              className={`px-4 py-2 rounded-2xl text-sm ${
                                message.isFromCurrentUser 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-secondary text-secondary-foreground'
                              }`}
                            >
                              {message.text}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 mx-1">
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground p-4">
                      <p>Start a conversation</p>
                      <p className="text-sm mt-1">Say hello to {activeContact?.name}</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t border-border">
                <form 
                  className="flex gap-2" 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <AnimatedButton 
                    type="submit" 
                    size="icon"
                    disabled={!newMessage.trim()}
                  >
                    <Send size={18} />
                  </AnimatedButton>
                </form>
              </div>
            </>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default MessagingSystem;
