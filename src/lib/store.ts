
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
}

const initialSearchFilters = {
  location: '',
  budget: [500, 2000],
  roomType: 'any',
  amenities: [],
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
    }),
    {
      name: 'roomie-finder-storage',
    }
  )
);
