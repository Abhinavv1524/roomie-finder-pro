
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserProfile = {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  isNewUser: boolean;
  isProfileComplete: boolean;
  compatibilityScore?: number;
  profileData?: {
    age?: number;
    gender?: string;
    occupation?: string;
    budget?: number;
    location?: string;
    phone?: string;
  };
  preferences?: {
    sleepingHabits?: string;
    cleanliness?: string;
    socialHabits?: string;
    smoking?: string;
    drinking?: string;
    schedule?: string;
    budget?: string;
    noiseTolerance?: string;
    diet?: string;
    pets?: string;
    security?: string;
  };
};

export type SavedContact = {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  online?: boolean;
  type: 'roommate' | 'propertyOwner';
};

export type SavedProperty = {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
  savedAt: Date;
};

interface AppState {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  clearUserProfile: () => void;
  isProfileCreationOpen: boolean;
  setProfileCreationOpen: (isOpen: boolean) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  searchFilters: {
    location: string;
    budget: [number, number];
    roomType: string;
    amenities: string[];
  };
  updateSearchFilters: (filters: Partial<AppState['searchFilters']>) => void;
  resetSearchFilters: () => void;
  exploreMode: 'roommate' | 'room' | null;
  setExploreMode: (mode: 'roommate' | 'room' | null) => void;
  roomPreference: 'shared' | 'private' | null;
  setRoomPreference: (preference: 'shared' | 'private' | null) => void;
  // New state for saved items and messaging
  savedRoommates: string[];
  savedProperties: SavedProperty[];
  savedContacts: SavedContact[];
  addSavedRoommate: (roommateId: string) => void;
  removeSavedRoommate: (roommateId: string) => void;
  addSavedProperty: (property: SavedProperty) => void;
  removeSavedProperty: (propertyId: string) => void;
  addSavedContact: (contact: SavedContact) => void;
  removeSavedContact: (contactId: string) => void;
  isMessagingOpen: boolean;
  setMessagingOpen: (isOpen: boolean) => void;
  activeContactId: string | null;
  setActiveContactId: (contactId: string | null) => void;
  isPaymentModalOpen: boolean;
  setPaymentModalOpen: (isOpen: boolean) => void;
  selectedPropertyForPayment: string | null;
  setSelectedPropertyForPayment: (propertyId: string | null) => void;
}

const initialSearchFilters = {
  location: '',
  budget: [5000, 50000] as [number, number],
  roomType: 'any',
  amenities: [] as string[],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),
      updateUserProfile: (data) =>
        set((state) => ({
          userProfile: state.userProfile
            ? { ...state.userProfile, ...data }
            : null,
        })),
      clearUserProfile: () => set({ userProfile: null }),
      isProfileCreationOpen: false,
      setProfileCreationOpen: (isOpen) => set({ isProfileCreationOpen: isOpen }),
      currentQuestionIndex: 0,
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      searchFilters: initialSearchFilters,
      updateSearchFilters: (filters) =>
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters },
        })),
      resetSearchFilters: () => set({ searchFilters: initialSearchFilters }),
      exploreMode: null,
      setExploreMode: (mode) => set({ exploreMode: mode }),
      roomPreference: null,
      setRoomPreference: (preference) => set({ roomPreference: preference }),
      // Initialize new state
      savedRoommates: [],
      savedProperties: [],
      savedContacts: [],
      addSavedRoommate: (roommateId) => 
        set((state) => ({
          savedRoommates: [...state.savedRoommates, roommateId]
        })),
      removeSavedRoommate: (roommateId) => 
        set((state) => ({
          savedRoommates: state.savedRoommates.filter(id => id !== roommateId)
        })),
      addSavedProperty: (property) => 
        set((state) => ({
          savedProperties: [...state.savedProperties, property]
        })),
      removeSavedProperty: (propertyId) => 
        set((state) => ({
          savedProperties: state.savedProperties.filter(property => property.id !== propertyId)
        })),
      addSavedContact: (contact) => 
        set((state) => ({
          savedContacts: [...state.savedContacts, contact]
        })),
      removeSavedContact: (contactId) => 
        set((state) => ({
          savedContacts: state.savedContacts.filter(contact => contact.id !== contactId)
        })),
      isMessagingOpen: false,
      setMessagingOpen: (isOpen) => set({ isMessagingOpen: isOpen }),
      activeContactId: null,
      setActiveContactId: (contactId) => set({ activeContactId: contactId }),
      isPaymentModalOpen: false,
      setPaymentModalOpen: (isOpen) => set({ isPaymentModalOpen: isOpen }),
      selectedPropertyForPayment: null,
      setSelectedPropertyForPayment: (propertyId) => set({ selectedPropertyForPayment: propertyId }),
    }),
    {
      name: 'findmynest-storage',
    }
  )
);
