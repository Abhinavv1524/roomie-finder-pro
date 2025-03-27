
import { UserProfile } from './store';
import { RoommateProfile } from './data';

// Map preference values to a standardized format for comparison
const preferenceMapping = {
  sleepingHabits: {
    early_riser: 'Early Riser',
    regular: 'Regular Hours',
    night_owl: 'Night Owl',
    varies: 'Varies',
  },
  cleanliness: {
    very_neat: 'Very Neat',
    neat: 'Neat',
    average: 'Average',
    relaxed: 'Relaxed',
  },
  socialHabits: {
    introvert: 'Introvert',
    balanced: 'Balanced',
    extrovert: 'Extrovert',
    varies: 'Varies',
  },
  smoking: {
    non_smoker: 'Non-smoker',
    outside_only: 'Outside Only',
    occasional: 'Occasional',
    smoker: 'Smoker',
  },
  drinking: {
    none: 'None',
    rarely: 'Rarely',
    social: 'Social',
    regular: 'Regular',
  },
  schedule: {
    regular: 'Regular',
    flexible: 'Flexible',
    student: 'Student',
    shifts: 'Shifts',
  },
  budget: {
    low: '$500-$800',
    medium: '$800-$1,200',
    high: '$1,200-$1,500',
    luxury: '$1,500+',
  },
  noiseTolerance: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    varies: 'Varies',
  },
  diet: {
    none: 'No Preference',
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    other: 'Other',
  },
  pets: {
    love: 'Loves Pets',
    ok: 'OK with pets',
    allergic: 'Allergic',
    no_pets: 'No Pets',
  },
};

// Weight each category by importance in roommate compatibility
const categoryWeights = {
  sleepingHabits: 1.5,
  cleanliness: 2.0,
  socialHabits: 1.5,
  smoking: 2.0,
  drinking: 1.0,
  schedule: 1.0,
  budget: 1.5,
  noiseTolerance: 1.0,
  diet: 0.75,
  pets: 1.0,
};

// Calculate compatibility between preferences
const calculatePreferenceMatch = (
  pref1: string,
  pref2: string,
  category: string
): number => {
  // For exact matches, return full points
  if (pref1 === pref2) return 10 * categoryWeights[category as keyof typeof categoryWeights];

  // Handle special cases of compatibility
  switch (category) {
    case 'sleepingHabits':
      // Night owls and early risers might conflict
      if (
        (pref1 === 'early_riser' && pref2 === 'night_owl') ||
        (pref1 === 'night_owl' && pref2 === 'early_riser')
      ) {
        return 3 * categoryWeights.sleepingHabits;
      }
      break;
    case 'cleanliness':
      // Very neat and relaxed might conflict
      if (
        (pref1 === 'very_neat' && pref2 === 'relaxed') ||
        (pref1 === 'relaxed' && pref2 === 'very_neat')
      ) {
        return 2 * categoryWeights.cleanliness;
      }
      break;
    case 'smoking':
      // Non-smokers and smokers might conflict severely
      if (
        (pref1 === 'non_smoker' && pref2 === 'smoker') ||
        (pref1 === 'smoker' && pref2 === 'non_smoker')
      ) {
        return 1 * categoryWeights.smoking;
      }
      break;
    case 'pets':
      // Pet allergies and pet lovers might conflict severely
      if (
        (pref1 === 'allergic' && pref2 === 'love') ||
        (pref1 === 'love' && pref2 === 'allergic')
      ) {
        return 1 * categoryWeights.pets;
      }
      break;
  }

  // For other combinations, return partial match
  return 6 * categoryWeights[category as keyof typeof categoryWeights];
};

// Calculate overall compatibility score
export const calculateCompatibility = (
  userProfile: UserProfile,
  roommateProfile: RoommateProfile
): number => {
  if (!userProfile.preferences) return 0;

  let totalScore = 0;
  let maxPossibleScore = 0;

  // Calculate scores for each preference category
  Object.keys(userProfile.preferences).forEach((category) => {
    const userPref = userProfile.preferences?.[category as keyof typeof userProfile.preferences] || '';
    const roommatePref = roommateProfile.preferences[category as keyof typeof roommateProfile.preferences];
    
    if (userPref && roommatePref) {
      const weight = categoryWeights[category as keyof typeof categoryWeights] || 1;
      const score = calculatePreferenceMatch(userPref, roommatePref, category);
      
      totalScore += score;
      maxPossibleScore += 10 * weight;
    }
  });

  // Convert to percentage rounded to nearest whole number
  const compatibilityPercentage = Math.round((totalScore / maxPossibleScore) * 100);
  
  return compatibilityPercentage;
};

// Map raw question responses to standardized preferences
export const mapQuestionResponseToPreference = (
  questionId: string,
  response: string
): string => {
  const mapping = preferenceMapping[questionId as keyof typeof preferenceMapping];
  return mapping ? mapping[response as keyof typeof mapping] : response;
};

// Get compatibility description based on score
export const getCompatibilityDescription = (score: number): string => {
  if (score >= 90) return 'Perfect Match';
  if (score >= 80) return 'Excellent Match';
  if (score >= 70) return 'Great Match';
  if (score >= 60) return 'Good Match';
  if (score >= 50) return 'Fair Match';
  if (score >= 40) return 'Average Match';
  if (score < 40) return 'Low Compatibility';
  return 'Unknown';
};

// Generate compatibility color based on score
export const getCompatibilityColor = (score: number): string => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-emerald-500';
  if (score >= 50) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};
