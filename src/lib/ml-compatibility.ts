
import { UserProfile } from './store';
import { RoommateProfile } from './data';

// Define feature vector interface for ML compatibility
interface FeatureVector {
  sleepingHabits: number[];
  cleanliness: number[];
  socialHabits: number[];
  smoking: number[];
  drinking: number[];
  schedule: number[];
  budget: number[];
  noiseTolerance: number[];
  diet: number[];
  pets: number[];
  security: number[];
  age: number;
  gender: number;
  location: number;
}

// Preference value to vector embeddings mapping
const preferenceEmbeddings = {
  sleepingHabits: {
    'early_riser': [1, 0, 0, 0.5],
    'regular': [0.5, 1, 0, 0.5],
    'night_owl': [0, 0, 1, 0.5],
    'varies': [0.5, 0.5, 0.5, 1],
  },
  cleanliness: {
    'very_neat': [1, 0.7, 0.3, 0],
    'neat': [0.7, 1, 0.5, 0.2],
    'average': [0.3, 0.5, 1, 0.7],
    'relaxed': [0, 0.2, 0.7, 1],
  },
  socialHabits: {
    'introvert': [1, 0.5, 0.1, 0.4],
    'balanced': [0.5, 1, 0.5, 0.8],
    'extrovert': [0.1, 0.5, 1, 0.4],
    'varies': [0.4, 0.8, 0.4, 1],
  },
  smoking: {
    'non_smoker': [1, 0.6, 0.3, 0.1],
    'outside_only': [0.6, 1, 0.7, 0.5],
    'occasional': [0.3, 0.7, 1, 0.8],
    'smoker': [0.1, 0.5, 0.8, 1],
  },
  drinking: {
    'none': [1, 0.7, 0.3, 0.1],
    'rarely': [0.7, 1, 0.6, 0.4],
    'social': [0.3, 0.6, 1, 0.7],
    'regular': [0.1, 0.4, 0.7, 1],
  },
  schedule: {
    'regular': [1, 0.7, 0.5, 0.3],
    'flexible': [0.7, 1, 0.7, 0.7],
    'student': [0.5, 0.7, 1, 0.5],
    'shifts': [0.3, 0.7, 0.5, 1],
  },
  budget: {
    'low': [1, 0.7, 0.3, 0.1],
    'medium': [0.7, 1, 0.7, 0.4],
    'high': [0.3, 0.7, 1, 0.7],
    'luxury': [0.1, 0.4, 0.7, 1],
  },
  noiseTolerance: {
    'low': [1, 0.5, 0.2, 0.4],
    'medium': [0.5, 1, 0.5, 0.5],
    'high': [0.2, 0.5, 1, 0.4],
    'varies': [0.4, 0.5, 0.4, 1],
  },
  diet: {
    'none': [1, 0.8, 0.7, 0.9],
    'vegetarian': [0.8, 1, 0.9, 0.6],
    'vegan': [0.7, 0.9, 1, 0.5],
    'other': [0.9, 0.6, 0.5, 1],
  },
  pets: {
    'love': [1, 0.8, 0.1, 0.3],
    'ok': [0.8, 1, 0.4, 0.6],
    'allergic': [0.1, 0.4, 1, 0.8],
    'no_pets': [0.3, 0.6, 0.8, 1],
  },
  security: {
    'low': [1, 0.7, 0.4, 0.2],
    'medium': [0.7, 1, 0.7, 0.5],
    'high': [0.4, 0.7, 1, 0.8],
    'critical': [0.2, 0.5, 0.8, 1],
  },
};

// Extract feature vectors from user and roommate profiles
export const extractFeatureVectors = (
  userProfile: UserProfile,
  roommateProfile: RoommateProfile
): { userVector: FeatureVector, roommateVector: FeatureVector } => {
  const userVector: Partial<FeatureVector> = {};
  const roommateVector: Partial<FeatureVector> = {};
  
  // Extract preference vectors
  for (const category of Object.keys(preferenceEmbeddings)) {
    const userPref = userProfile.preferences?.[category as keyof typeof preferenceEmbeddings];
    const roommatePref = roommateProfile.preferences[category as keyof typeof roommateProfile.preferences];
    
    if (userPref && roommatePref) {
      userVector[category as keyof FeatureVector] = 
        preferenceEmbeddings[category as keyof typeof preferenceEmbeddings][userPref as keyof (typeof preferenceEmbeddings)[keyof typeof preferenceEmbeddings]];
      
      roommateVector[category as keyof FeatureVector] = 
        preferenceEmbeddings[category as keyof typeof preferenceEmbeddings][roommatePref as keyof (typeof preferenceEmbeddings)[keyof typeof preferenceEmbeddings]];
    }
  }
  
  // Add demographic features
  if (userProfile.profileData?.age && roommateProfile.age) {
    // Normalize age difference to a similarity score (0-1)
    const ageDiff = Math.abs(userProfile.profileData.age - roommateProfile.age);
    const ageSimilarity = Math.max(0, 1 - (ageDiff / 50)); // 0 difference = 1, 50+ difference = 0
    userVector.age = ageSimilarity;
    roommateVector.age = ageSimilarity;
  }
  
  // Gender compatibility (binary for simplicity)
  if (userProfile.profileData?.gender && roommateProfile.gender) {
    const sameGender = userProfile.profileData.gender.toLowerCase() === roommateProfile.gender.toLowerCase();
    userVector.gender = sameGender ? 1 : 0.5; // Same gender gets higher score
    roommateVector.gender = sameGender ? 1 : 0.5;
  }
  
  // Location compatibility
  if (userProfile.profileData?.location && roommateProfile.location) {
    const userLocation = userProfile.profileData.location.toLowerCase();
    const roommateLocation = roommateProfile.location.toLowerCase();
    
    let locationScore = 0.2; // Default low score
    
    // Same city
    if (userLocation.split(',')[0].trim() === roommateLocation.split(',')[0].trim()) {
      locationScore = 1.0;
    }
    // Same state/region
    else if (userLocation.includes(roommateLocation.split(',')[1]?.trim() || '')) {
      locationScore = 0.7;
    }
    
    userVector.location = locationScore;
    roommateVector.location = locationScore;
  }
  
  return { 
    userVector: userVector as FeatureVector, 
    roommateVector: roommateVector as FeatureVector 
  };
};

// Calculate cosine similarity between two vectors
const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Calculate weighted similarity between feature vectors
export const calculateVectorSimilarity = (
  userVector: FeatureVector,
  roommateVector: FeatureVector,
  weights: Record<keyof FeatureVector, number>
): number => {
  let totalSimilarity = 0;
  let totalWeight = 0;
  
  // Calculate weighted similarity for each feature
  for (const category of Object.keys(weights) as Array<keyof FeatureVector>) {
    if (
      userVector[category] !== undefined && 
      roommateVector[category] !== undefined
    ) {
      const weight = weights[category];
      let similarity: number;
      
      // For array features, use cosine similarity
      if (Array.isArray(userVector[category])) {
        similarity = cosineSimilarity(
          userVector[category] as number[], 
          roommateVector[category] as number[]
        );
      } 
      // For scalar features, use direct comparison
      else {
        similarity = 1 - Math.abs((userVector[category] as number) - (roommateVector[category] as number));
      }
      
      totalSimilarity += similarity * weight;
      totalWeight += weight;
    }
  }
  
  return totalWeight > 0 ? (totalSimilarity / totalWeight) * 100 : 0;
};

// Define feature importance weights
export const featureWeights: Record<keyof FeatureVector, number> = {
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
  age: 1.2,
  gender: 0.8,
  location: 1.6,
};

// Enhanced ML-based compatibility algorithm
export const calculateMLCompatibility = (
  userProfile: UserProfile,
  roommateProfile: RoommateProfile
): number => {
  // Extract feature vectors from profiles
  const { userVector, roommateVector } = extractFeatureVectors(userProfile, roommateProfile);
  
  // Calculate weighted similarity
  const compatibilityScore = calculateVectorSimilarity(userVector, roommateVector, featureWeights);
  
  // Apply non-linear transformation to emphasize differences
  // This is a simple form of what ML models might do with a sigmoid-like function
  const adjustedScore = Math.round(
    100 / (1 + Math.exp(-0.1 * (compatibilityScore - 50))) // Sigmoid centered at 50%
  );
  
  return adjustedScore;
};
