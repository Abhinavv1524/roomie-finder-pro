
import { UserProfile } from './store';
import { RoommateProfile } from './data';
import { calculateMLCompatibility } from './ml-compatibility';

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
    low: '₹5,000-₹8,000',
    medium: '₹8,000-₹12,000',
    high: '₹12,000-₹15,000',
    luxury: '₹15,000+',
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
  security: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
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
  security: 1.25,
};

// Compatibility matrix for specific preference combinations
const compatibilityMatrix = {
  sleepingHabits: {
    'early_riser-early_riser': 10,
    'early_riser-regular': 7,
    'early_riser-night_owl': 3,
    'early_riser-varies': 6,
    'regular-regular': 10,
    'regular-night_owl': 5,
    'regular-varies': 7,
    'night_owl-night_owl': 10,
    'night_owl-varies': 6,
    'varies-varies': 8,
  },
  cleanliness: {
    'very_neat-very_neat': 10,
    'very_neat-neat': 8,
    'very_neat-average': 5,
    'very_neat-relaxed': 2,
    'neat-neat': 10,
    'neat-average': 7,
    'neat-relaxed': 4,
    'average-average': 10, 
    'average-relaxed': 6,
    'relaxed-relaxed': 10,
  },
  socialHabits: {
    'introvert-introvert': 10,
    'introvert-balanced': 7,
    'introvert-extrovert': 4,
    'introvert-varies': 6,
    'balanced-balanced': 10,
    'balanced-extrovert': 7,
    'balanced-varies': 8,
    'extrovert-extrovert': 10,
    'extrovert-varies': 6,
    'varies-varies': 8,
  },
  smoking: {
    'non_smoker-non_smoker': 10,
    'non_smoker-outside_only': 6,
    'non_smoker-occasional': 3,
    'non_smoker-smoker': 1,
    'outside_only-outside_only': 10,
    'outside_only-occasional': 7,
    'outside_only-smoker': 5,
    'occasional-occasional': 10,
    'occasional-smoker': 8,
    'smoker-smoker': 10,
  },
  drinking: {
    'none-none': 10,
    'none-rarely': 7,
    'none-social': 4,
    'none-regular': 2,
    'rarely-rarely': 10,
    'rarely-social': 7,
    'rarely-regular': 5,
    'social-social': 10,
    'social-regular': 7,
    'regular-regular': 10,
  },
  pets: {
    'love-love': 10,
    'love-ok': 8,
    'love-allergic': 1,
    'love-no_pets': 3,
    'ok-ok': 10,
    'ok-allergic': 3,
    'ok-no_pets': 6,
    'allergic-allergic': 10,
    'allergic-no_pets': 8,
    'no_pets-no_pets': 10,
  },
};

// Calculate compatibility between preferences using the matrix
const calculatePreferenceMatch = (
  pref1: string,
  pref2: string,
  category: string
): number => {
  // For exact matches, return full points
  if (pref1 === pref2) return 10 * categoryWeights[category as keyof typeof categoryWeights];

  // Check the compatibility matrix
  const matrixKey = `${pref1}-${pref2}`;
  const reverseMatrixKey = `${pref2}-${pref1}`;
  
  if (
    category in compatibilityMatrix && 
    (matrixKey in compatibilityMatrix[category as keyof typeof compatibilityMatrix] || 
     reverseMatrixKey in compatibilityMatrix[category as keyof typeof compatibilityMatrix])
  ) {
    const score = compatibilityMatrix[category as keyof typeof compatibilityMatrix][
      matrixKey as keyof typeof compatibilityMatrix[keyof typeof compatibilityMatrix]
    ] || compatibilityMatrix[category as keyof typeof compatibilityMatrix][
      reverseMatrixKey as keyof typeof compatibilityMatrix[keyof typeof compatibilityMatrix]
    ];
    return score * categoryWeights[category as keyof typeof categoryWeights];
  }

  // For budget compatibility
  if (category === 'budget') {
    const budgetValues = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'luxury': 4,
    };
    
    const budget1 = budgetValues[pref1 as keyof typeof budgetValues] || 0;
    const budget2 = budgetValues[pref2 as keyof typeof budgetValues] || 0;
    
    // If budgets are the same or adjacent categories
    if (Math.abs(budget1 - budget2) <= 1) {
      return (10 - Math.abs(budget1 - budget2) * 2) * categoryWeights.budget;
    }
    // Bigger difference in budget
    return (5 - Math.abs(budget1 - budget2)) * categoryWeights.budget;
  }

  // For categories without specific matrix entries or special cases,
  // return a moderate compatibility score
  return 6 * categoryWeights[category as keyof typeof categoryWeights];
};

// Enhanced ML-inspired compatibility algorithm that takes into account:
// 1. Direct preference matching with weighted importance
// 2. Special compatibility rules for certain combinations
// 3. Budget alignment
// 4. Location/cultural compatibility
// 5. Lifestyle similarity
// 6. Now uses ML-based vector similarity for improved matching
export const calculateCompatibility = (
  userProfile: UserProfile,
  roommateProfile: RoommateProfile
): number => {
  if (!userProfile.preferences) return 0;
  
  // Use ML-based compatibility calculation if profile has enough data
  if (userProfile.profileData && Object.keys(userProfile.preferences).length > 3) {
    return calculateMLCompatibility(userProfile, roommateProfile);
  }
  
  // Fall back to the original algorithm if not enough data
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

  // Additional location compatibility bonus
  if (userProfile.profileData?.location && roommateProfile.location) {
    const userLocation = userProfile.profileData.location.toLowerCase();
    const roommateLocation = roommateProfile.location.toLowerCase();
    
    // Same city bonus
    if (userLocation.split(',')[0].trim() === roommateLocation.split(',')[0].trim()) {
      totalScore += 10; // Extra points for same city
      maxPossibleScore += 10;
    } 
    // Same state/region bonus
    else if (userLocation.includes(roommateLocation.split(',')[1]?.trim() || '')) {
      totalScore += 5; // Partial points for same state
      maxPossibleScore += 10;
    } else {
      maxPossibleScore += 10; // Add to denominator but no points
    }
  }

  // Age compatibility - prefer closer age ranges
  if (userProfile.profileData?.age && roommateProfile.age) {
    const ageDiff = Math.abs(userProfile.profileData.age - roommateProfile.age);
    const ageCompat = Math.max(0, 10 - ageDiff);
    totalScore += ageCompat;
    maxPossibleScore += 10;
  }
  
  // Gender compatibility (if preference exists)
  if (userProfile.profileData?.gender && roommateProfile.gender) {
    // Same gender bonus for traditional preferences
    const sameGender = userProfile.profileData.gender.toLowerCase() === roommateProfile.gender.toLowerCase();
    totalScore += sameGender ? 8 : 5;
    maxPossibleScore += 10;
  }

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
