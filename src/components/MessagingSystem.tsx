
import { useState, useEffect, useRef } from 'react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Send, User, VideoIcon, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isFromCurrentUser: boolean;
};

type Contact = {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  online?: boolean;
};

// Sample conversation data - in a real app, this would come from a database
const generateSampleMessages = (contactId: string): Message[] => {
  const baseMessages = [
    { text: "Hi there, I'm interested in the property/profile", isFromCurrentUser: false },
    { text: "Hello! Thank you for reaching out. I'm happy to answer any questions", isFromCurrentUser: true },
    { text: "What's the availability like?", isFromCurrentUser: false },
    { text: "It's available from next month onwards", isFromCurrentUser: true },
    { text: "That sounds perfect. Could we schedule a viewing?", isFromCurrentUser: false },
    { text: "Sure, how about this weekend?", isFromCurrentUser: true },
    { text: "Saturday afternoon works for me", isFromCurrentUser: false },
    { text: "Great! I'll set it up and send you the details", isFromCurrentUser: true }
  ];

  return baseMessages.map((msg, index) => ({
    id: `${contactId}-msg-${index}`,
    sender: msg.isFromCurrentUser ? 'You' : contactId,
    text: msg.text,
    timestamp: new Date(Date.now() - (baseMessages.length - index) * 3600000),
    isFromCurrentUser: msg.isFromCurrentUser
  }));
};

interface MessagingSystemProps {
  isOpen: boolean;
  onClose: () => void;
  initialContactId?: string;
}

const MessagingSystem = ({ isOpen, onClose, initialContactId }: MessagingSystemProps) => {
  const { savedContacts } = useAppStore();
  const [activeContactId, setActiveContactId] = useState<string | null>(initialContactId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showContacts, setShowContacts] = useState(!initialContactId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // For demo purposes, creating sample contacts if none exist
  const [contacts, setContacts] = useState<Contact[]>(
    savedContacts.length > 0 
      ? savedContacts 
      : [
          {
            id: "demo-contact-1",
            name: "Rahul Sharma",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            lastMessage: "Saturday afternoon works for me",
            lastMessageTime: new Date(Date.now() - 1 * 3600000),
            unreadCount: 0,
            online: true
          },
          {
            id: "demo-contact-2",
            name: "Priya Patel",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            lastMessage: "Is the room still available?",
            lastMessageTime: new Date(Date.now() - 5 * 3600000),
            unreadCount: 2,
            online: false
          }
        ]
  );

  useEffect(() => {
    if (activeContactId) {
      setMessages(generateSampleMessages(activeContactId));
    }
  }, [activeContactId]);

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
    
    // Simulate reply after 1-3 seconds for demo purposes
    const replyDelay = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(() => {
      const replyMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: activeContactId,
        text: "Thanks for your message! I'll get back to you soon.",
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
                  {contacts.map(contact => (
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
                  ))}
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
                  {messages.map(message => (
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
                  ))}
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
