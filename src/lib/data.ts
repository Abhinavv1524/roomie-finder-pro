
export type Property = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  roomType: 'shared' | 'private';
  imageUrl: string;
  amenities: string[];
  available: boolean;
  nearbyFacilities: string[];
  ownerContact: string;
  virtualTourUrl?: string;
};

export type RoommateProfile = {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  avatar: string;
  bio: string;
  budget: number;
  location: string;
  preferences: {
    sleepingHabits: string;
    cleanliness: string;
    socialHabits: string;
    smoking: string;
    drinking: string;
    schedule: string;
    noiseTolerance: string;
    diet: string;
    pets: string;
    security: string;
  };
  compatibilityScores: {
    [userId: string]: number;
  };
};

export const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Studio Apartment',
    description: 'Bright and airy studio apartment with modern amenities and great views.',
    location: 'Downtown, New York',
    price: 1200,
    roomType: 'private',
    imageUrl: 'https://images.unsplash.com/photo-1524230572899-a752b3835840',
    amenities: ['WiFi', 'Gym', 'Laundry', 'Security'],
    available: true,
    nearbyFacilities: ['Metro Station', 'University', 'Shopping Mall'],
    ownerContact: 'owner1@example.com',
    virtualTourUrl: 'https://example.com/virtual-tour/1',
  },
  {
    id: '2',
    title: 'Cozy Shared Apartment',
    description: 'Furnished shared room in a friendly apartment with all utilities included.',
    location: 'Brooklyn, New York',
    price: 800,
    roomType: 'shared',
    imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
    amenities: ['WiFi', 'Kitchen', 'Heating', 'Cooling'],
    available: true,
    nearbyFacilities: ['Park', 'Grocery Store', 'Bus Stop'],
    ownerContact: 'owner2@example.com',
  },
  {
    id: '3',
    title: 'Luxury Private Room',
    description: 'Private room in a luxury apartment with access to all amenities.',
    location: 'Manhattan, New York',
    price: 1500,
    roomType: 'private',
    imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
    amenities: ['WiFi', 'Pool', 'Gym', 'Parking', 'Security'],
    available: true,
    nearbyFacilities: ['Metro Station', 'Office Hub', 'Shopping Mall'],
    ownerContact: 'owner3@example.com',
    virtualTourUrl: 'https://example.com/virtual-tour/3',
  },
  {
    id: '4',
    title: 'Student-Friendly Shared Space',
    description: 'Affordable shared room perfect for students, close to university.',
    location: 'Queens, New York',
    price: 600,
    roomType: 'shared',
    imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    amenities: ['WiFi', 'Study Area', 'Laundry'],
    available: true,
    nearbyFacilities: ['University', 'Library', 'Cafes'],
    ownerContact: 'owner4@example.com',
  },
];

export const sampleRoommates: RoommateProfile[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    age: 25,
    gender: 'Male',
    occupation: 'Software Engineer',
    avatar: 'https://i.pravatar.cc/150?img=11',
    bio: 'Tech enthusiast who enjoys coding and gaming. Looking for a quiet place to live and work.',
    budget: 1200,
    location: 'New York',
    preferences: {
      sleepingHabits: 'Night Owl',
      cleanliness: 'Very Neat',
      socialHabits: 'Introvert',
      smoking: 'Non-smoker',
      drinking: 'Occasional',
      schedule: 'Work from home',
      noiseTolerance: 'Low',
      diet: 'No Preference',
      pets: 'No Pets',
      security: 'High Priority',
    },
    compatibilityScores: {},
  },
  {
    id: '2',
    name: 'Samantha Lee',
    age: 28,
    gender: 'Female',
    occupation: 'Marketing Manager',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Creative professional looking for a place with good vibes and friendly roommates.',
    budget: 1000,
    location: 'New York',
    preferences: {
      sleepingHabits: 'Early Riser',
      cleanliness: 'Neat',
      socialHabits: 'Extrovert',
      smoking: 'Non-smoker',
      drinking: 'Social Drinker',
      schedule: 'Regular 9-5',
      noiseTolerance: 'Medium',
      diet: 'Vegetarian',
      pets: 'Loves Pets',
      security: 'Medium Priority',
    },
    compatibilityScores: {},
  },
  {
    id: '3',
    name: 'Marcus Chen',
    age: 23,
    gender: 'Male',
    occupation: 'Graduate Student',
    avatar: 'https://i.pravatar.cc/150?img=7',
    bio: 'PhD student looking for quiet space to study and relax. Clean and respectful roommate.',
    budget: 800,
    location: 'New York',
    preferences: {
      sleepingHabits: 'Night Owl',
      cleanliness: 'Very Neat',
      socialHabits: 'Balanced',
      smoking: 'Non-smoker',
      drinking: 'Occasional',
      schedule: 'Student Schedule',
      noiseTolerance: 'Low',
      diet: 'No Preference',
      pets: 'No Pets',
      security: 'High Priority',
    },
    compatibilityScores: {},
  },
  {
    id: '4',
    name: 'Priya Sharma',
    age: 26,
    gender: 'Female',
    occupation: 'Nurse',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Healthcare professional with rotating shifts. Quiet, clean, and respectful of shared spaces.',
    budget: 1100,
    location: 'New York',
    preferences: {
      sleepingHabits: 'Varies due to shifts',
      cleanliness: 'Very Neat',
      socialHabits: 'Introvert',
      smoking: 'Non-smoker',
      drinking: 'Rarely',
      schedule: 'Rotating Shifts',
      noiseTolerance: 'Medium',
      diet: 'Vegetarian',
      pets: 'OK with pets',
      security: 'High Priority',
    },
    compatibilityScores: {},
  },
];

export const compatibilityQuestions = [
  {
    id: 'sleeping',
    question: 'What are your sleeping habits?',
    options: [
      { value: 'early_riser', label: 'Early Riser (Before 7 AM)' },
      { value: 'regular', label: 'Regular Hours (7-9 AM)' },
      { value: 'night_owl', label: 'Night Owl (Sleep after midnight)' },
      { value: 'varies', label: 'Varies due to my schedule' },
    ],
  },
  {
    id: 'cleanliness',
    question: 'How would you describe your cleanliness level?',
    options: [
      { value: 'very_neat', label: 'Very Neat and Organized' },
      { value: 'neat', label: 'Generally Neat' },
      { value: 'average', label: 'Average Cleanliness' },
      { value: 'relaxed', label: 'Relaxed about Cleanliness' },
    ],
  },
  {
    id: 'social',
    question: 'How social are you at home?',
    options: [
      { value: 'introvert', label: 'Prefer Quiet & Privacy' },
      { value: 'balanced', label: 'Balanced - Sometimes Social, Sometimes Not' },
      { value: 'extrovert', label: 'Very Social & Enjoy Company' },
      { value: 'varies', label: 'Depends on the Day' },
    ],
  },
  {
    id: 'smoking',
    question: 'What is your stance on smoking?',
    options: [
      { value: 'non_smoker', label: 'Non-smoker & prefer non-smoking environment' },
      { value: 'outside_only', label: 'Non-smoker but ok with smoking outside' },
      { value: 'occasional', label: 'Occasional smoker (outside only)' },
      { value: 'smoker', label: 'Regular smoker' },
    ],
  },
  {
    id: 'drinking',
    question: 'What are your drinking habits?',
    options: [
      { value: 'none', label: 'Don\'t drink at all' },
      { value: 'rarely', label: 'Rarely drink' },
      { value: 'social', label: 'Social drinker (weekends/events)' },
      { value: 'regular', label: 'Regular drinker' },
    ],
  },
  {
    id: 'schedule',
    question: 'What is your typical daily schedule?',
    options: [
      { value: 'regular', label: 'Regular 9-5 work hours' },
      { value: 'flexible', label: 'Flexible/Remote work' },
      { value: 'student', label: 'Student schedule with classes' },
      { value: 'shifts', label: 'Rotating/Night shifts' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your monthly budget for rent?',
    options: [
      { value: 'low', label: '$500-$800' },
      { value: 'medium', label: '$800-$1,200' },
      { value: 'high', label: '$1,200-$1,500' },
      { value: 'luxury', label: '$1,500+' },
    ],
  },
  {
    id: 'noise',
    question: 'What is your noise tolerance level?',
    options: [
      { value: 'low', label: 'Need quiet environment most of the time' },
      { value: 'medium', label: 'Can tolerate some noise' },
      { value: 'high', label: 'Very tolerant of noise' },
      { value: 'varies', label: 'Depends on time of day' },
    ],
  },
  {
    id: 'diet',
    question: 'Do you have dietary preferences?',
    options: [
      { value: 'none', label: 'No specific preferences' },
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'other', label: 'Other dietary restrictions' },
    ],
  },
  {
    id: 'pets',
    question: 'What is your preference regarding pets?',
    options: [
      { value: 'love', label: 'Love pets & have/want them' },
      { value: 'ok', label: 'OK with pets but don\'t have any' },
      { value: 'allergic', label: 'Allergic to some pets' },
      { value: 'no_pets', label: 'Prefer no pets' },
    ],
  },
];
