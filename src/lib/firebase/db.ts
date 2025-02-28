import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  Firestore,
  onSnapshot,
} from 'firebase/firestore';
import { db, getFirestoreInstance } from './config';
import { User, Challenge, ImpactMetric, ChatMessage, LeaderboardEntry } from '@/types';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Type for mock users
interface MockUsers {
  [key: string]: User;
}

// Mock data for development
const mockUsers: MockUsers = {
  'mock-user-id': {
    id: 'mock-user-id',
    name: 'Demo User',
    email: 'user@example.com',
    image: '/images/default-avatar.png',
    points: 250,
    badges: [],
    sustainabilityScore: 75,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

const mockImpactMetrics: ImpactMetric[] = [
  {
    id: 'metric-1',
    userId: 'mock-user-id',
    category: 'water',
    value: 50,
    description: 'Took shorter showers this week',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'metric-2',
    userId: 'mock-user-id',
    category: 'energy',
    value: 25,
    description: 'Used energy-efficient appliances',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'metric-3',
    userId: 'mock-user-id',
    category: 'waste',
    value: 3,
    description: 'Recycled plastic bottles',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'metric-4',
    userId: 'mock-user-id',
    category: 'transport',
    value: 15,
    description: 'Biked to work instead of driving',
    date: new Date().toISOString(),
  },
];

const mockChallenges: (Challenge & { completedBy: string[] })[] = [
  {
    id: 'challenge-1',
    title: 'Water Conservation Challenge',
    description: 'Reduce your water usage by 20% this week',
    category: 'water',
    points: 100,
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    participants: ['mock-user-id'],
    createdBy: 'admin',
    completedBy: [],
  },
  {
    id: 'challenge-2',
    title: 'Zero Waste Week',
    description: 'Try to produce no landfill waste for a week',
    category: 'waste',
    points: 150,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    participants: ['mock-user-id'],
    createdBy: 'admin',
    completedBy: [],
  },
];

// Helper function to check if db is available
const isDbAvailable = (): boolean => {
  return db !== null;
};

// ===== MOCK IMPLEMENTATIONS FOR DEVELOPMENT =====

// User functions - Mock implementations
const mockGetUser = async (userId: string): Promise<User | null> => {
  console.log('Development mode: Mock getUser', { userId });
  return mockUsers[userId] || null;
};

const mockCreateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  console.log('Development mode: Mock createUser', { userId, userData });
  mockUsers[userId] = { id: userId, ...userData } as User;
};

const mockUpdateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  console.log('Development mode: Mock updateUser', { userId, userData });
  if (mockUsers[userId]) {
    mockUsers[userId] = { ...mockUsers[userId], ...userData } as User;
  }
};

// Impact metrics functions - Mock implementations
const mockGetUserImpactMetrics = async (userId: string): Promise<ImpactMetric[]> => {
  console.log('Development mode: Mock getUserImpactMetrics', { userId });
  return mockImpactMetrics.filter(metric => metric.userId === userId);
};

const mockAddImpactMetric = async (metric: Partial<ImpactMetric>): Promise<string> => {
  console.log('Development mode: Mock addImpactMetric', { metric });
  const newMetric = {
    id: `metric-${Date.now()}`,
    ...metric,
    date: new Date().toISOString(),
  } as ImpactMetric;
  mockImpactMetrics.push(newMetric);
  return newMetric.id;
};

// Challenge functions - Mock implementations
const mockGetUserChallenges = async (userId: string): Promise<Challenge[]> => {
  console.log('Development mode: Mock getUserChallenges', { userId });
  return mockChallenges.filter(challenge => challenge.participants.includes(userId));
};

const mockAddChallenge = async (challenge: Partial<Challenge>): Promise<string> => {
  console.log('Development mode: Mock addChallenge', { challenge });
  const newChallenge = {
    id: `challenge-${Date.now()}`,
    ...challenge,
    startDate: new Date().toISOString(),
    completedBy: [],
  } as Challenge & { completedBy: string[] };
  mockChallenges.push(newChallenge);
  return newChallenge.id;
};

// ===== PRODUCTION IMPLEMENTATIONS =====

// User functions - Production implementations
const prodGetUser = async (userId: string): Promise<User | null> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  
  const userRef = doc(db!, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() } as User;
  } else {
    return null;
  }
};

const prodCreateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  
  const userRef = doc(db!, 'users', userId);
  await setDoc(userRef, {
    ...userData,
    points: 0,
    joinedAt: serverTimestamp(),
  });
};

const prodUpdateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  
  const userRef = doc(db!, 'users', userId);
  await updateDoc(userRef, userData);
};

// Impact metrics functions - Production implementations
const prodGetUserImpactMetrics = async (userId: string): Promise<ImpactMetric[]> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  
  const metricsRef = collection(db!, 'impact_metrics');
  const q = query(
    metricsRef,
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    // Convert Firestore Timestamp to JS Date if needed
    const date = data.date instanceof Timestamp 
      ? data.date.toDate().toISOString() 
      : new Date(data.date).toISOString();
    
    return {
      id: doc.id,
      ...data,
      date,
    } as ImpactMetric;
  });
};

const prodAddImpactMetric = async (metric: Partial<ImpactMetric>): Promise<string> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  
  const metricsRef = collection(db!, 'impact_metrics');
  const docRef = await addDoc(metricsRef, {
    ...metric,
    date: serverTimestamp(),
  });
  
  return docRef.id;
};

// Challenge functions - Production implementations
const prodGetUserChallenges = async (userId: string): Promise<Challenge[]> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  
  const challengesRef = collection(db!, 'challenges');
  const q = query(
    challengesRef,
    where('participants', 'array-contains', userId),
    orderBy('startDate', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    
    return {
      id: doc.id,
      ...data,
    } as Challenge;
  });
};

const prodAddChallenge = async (challenge: Partial<Challenge>): Promise<string> => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  
  const challengesRef = collection(db!, 'challenges');
  const docRef = await addDoc(challengesRef, {
    ...challenge,
    startDate: serverTimestamp(),
  });
  
  return docRef.id;
};

// ===== EXPORTED FUNCTIONS =====

// Export the appropriate implementation based on environment and db availability
export const getUser = async (userId: string): Promise<User | null> => {
  try {
    if (isDevelopment && !db) {
      return await mockGetUser(userId);
    }
    return await prodGetUser(userId);
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const createUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  try {
    if (isDevelopment && !db) {
      return await mockCreateUser(userId, userData);
    }
    return await prodCreateUser(userId, userData);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  try {
    if (isDevelopment && !db) {
      return await mockUpdateUser(userId, userData);
    }
    return await prodUpdateUser(userId, userData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const updateUserPoints = async (userId: string, points: number) => {
  // Check if we're in development mode without Firebase
  if (isDevelopment && !db) {
    console.log('Development mode: Mock updateUserPoints', { userId, points });
    if (mockUsers[userId]) {
      mockUsers[userId].points = points;
      mockUsers[userId].updatedAt = new Date().toISOString();
    }
    return;
  }

  // Check if db is available
  if (!db) {
    console.error('Firestore is not initialized');
    throw new Error('Firestore is not initialized');
  }

  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    points: points,
    updatedAt: serverTimestamp(),
  });
};

// Challenges
export const createChallenge = async (challengeData: Omit<Challenge, 'id'>) => {
  try {
    // Check if we're in development mode without Firebase
    if (isDevelopment && !db) {
      console.log('Development mode: Mock createChallenge', challengeData);
      const newChallenge = {
        id: `challenge-${Date.now()}`,
        ...challengeData,
        createdAt: new Date().toISOString(),
        completedBy: [],
      } as Challenge & { completedBy: string[] };
      mockChallenges.push(newChallenge);
      return newChallenge.id;
    }

    // Check if db is available
    if (!db) {
      console.error('Firestore is not initialized');
      throw new Error('Firestore is not initialized');
    }

    const challengesRef = collection(db!, 'challenges');
    const newChallengeData = {
      ...challengeData,
      createdAt: serverTimestamp(),
      completedBy: [],
    };
    const docRef = await addDoc(challengesRef, newChallengeData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
};

export const joinChallenge = async (challengeId: string, userId: string) => {
  try {
    // Check if we're in development mode without Firebase
    if (isDevelopment && !db) {
      console.log('Development mode: Mock joinChallenge', { challengeId, userId });
      const challenge = mockChallenges.find(c => c.id === challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }
      if (challenge.participants.includes(userId)) {
        throw new Error('Already joined this challenge');
      }
      challenge.participants.push(userId);
      if (challenge.metrics) {
        challenge.metrics.totalParticipants = (challenge.metrics.totalParticipants || 0) + 1;
      } else {
        challenge.metrics = { totalParticipants: 1, completionRate: 0, totalImpact: 0 };
      }
      return;
    }

    // Check if db is available
    if (!db) {
      console.error('Firestore is not initialized');
      throw new Error('Firestore is not initialized');
    }

    const challengeRef = doc(db!, 'challenges', challengeId);
    const challengeDoc = await getDoc(challengeRef);
    
    if (!challengeDoc.exists()) {
      throw new Error('Challenge not found');
    }

    const challenge = challengeDoc.data() as Challenge & { completedBy: string[] };
    if (challenge.participants.includes(userId)) {
      throw new Error('Already joined this challenge');
    }

    await updateDoc(challengeRef, {
      participants: [...challenge.participants, userId],
      'metrics.totalParticipants': (challenge.metrics?.totalParticipants || 0) + 1,
    });
  } catch (error) {
    console.error('Error joining challenge:', error);
    throw error;
  }
};

export const updateChallengeProgress = async (
  challengeId: string,
  userId: string,
  progress: number
) => {
  try {
    const challengeRef = doc(db, 'challenges', challengeId);
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(challengeRef, {
      'metrics.completionRate': progress,
    });

    // Award points for progress (20 points per 20% progress)
    if (progress % 20 === 0 && progress > 0) {
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      await updateDoc(userRef, {
        points: (userData?.points || 0) + 20,
      });
    }
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    throw error;
  }
};

export const completeChallenge = async (challengeId: string, userId: string, impactMetric: ImpactMetric) => {
  try {
    // Check if we're in development mode without Firebase
    if (isDevelopment && !db) {
      console.log('Development mode: Mock completeChallenge', { challengeId, userId, impactMetric });
      const challenge = mockChallenges.find(c => c.id === challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }
      if (!challenge.participants.includes(userId)) {
        throw new Error('Not a participant in this challenge');
      }
      
      // Initialize completedBy array if it doesn't exist
      if (!challenge.completedBy) {
        challenge.completedBy = [];
      }
      
      if (challenge.completedBy.includes(userId)) {
        throw new Error('Already completed this challenge');
      }
      challenge.completedBy.push(userId);
      if (challenge.metrics) {
        challenge.metrics.completionRate = challenge.completedBy.length / challenge.participants.length;
        challenge.metrics.totalImpact += impactMetric.value || 0;
      }
      return;
    }

    // Check if db is available
    if (!db) {
      console.error('Firestore is not initialized');
      throw new Error('Firestore is not initialized');
    }

    const challengeRef = doc(db!, 'challenges', challengeId);
    const challengeDoc = await getDoc(challengeRef);
    
    if (!challengeDoc.exists()) {
      throw new Error('Challenge not found');
    }

    const challenge = challengeDoc.data() as Challenge & { completedBy: string[] };
    if (!challenge.participants.includes(userId)) {
      throw new Error('Not a participant in this challenge');
    }
    
    // Initialize completedBy array if it doesn't exist
    if (!challenge.completedBy) {
      challenge.completedBy = [];
    }
    
    if (challenge.completedBy.includes(userId)) {
      throw new Error('Already completed this challenge');
    }

    const completedBy = [...challenge.completedBy, userId];
    const completionRate = completedBy.length / challenge.participants.length;
    const totalImpact = (challenge.metrics?.totalImpact || 0) + (impactMetric.value || 0);

    await updateDoc(challengeRef, {
      completedBy,
      'metrics.completionRate': completionRate,
      'metrics.totalImpact': totalImpact,
    });

    // Update user points
    await updateUserPoints(userId, 50); // Award points for completing a challenge
  } catch (error) {
    console.error('Error completing challenge:', error);
    throw error;
  }
};

export const getActiveChallenges = async () => {
  try {
    // Check if we're in development mode without Firebase
    if (isDevelopment && !db) {
      console.log('Development mode: Mock getActiveChallenges');
      // Filter challenges that are still active (end date is in the future)
      return mockChallenges.filter(challenge => 
        new Date(challenge.endDate) > new Date()
      ).sort((a, b) => 
        new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      );
    }

    // Check if db is available
    if (!db) {
      console.error('Firestore is not initialized');
      return [];
    }

    const challengesRef = collection(db, 'challenges');
    const q = query(
      challengesRef,
      where('endDate', '>', new Date().toISOString()),
      orderBy('endDate', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data(),
    })) as Challenge[];
  } catch (error) {
    console.error('Error getting active challenges:', error);
    throw error;
  }
};

export const getUserChallenges = async (userId: string): Promise<Challenge[]> => {
  try {
    if (isDevelopment && !db) {
      return await mockGetUserChallenges(userId);
    }
    return await prodGetUserChallenges(userId);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
};

// Impact metrics functions
export const getUserImpactMetrics = async (userId: string): Promise<ImpactMetric[]> => {
  try {
    if (isDevelopment && !db) {
      return await mockGetUserImpactMetrics(userId);
    }
    return await prodGetUserImpactMetrics(userId);
  } catch (error) {
    console.error('Error fetching impact metrics:', error);
    throw error;
  }
};

export const addImpactMetric = async (metric: Partial<ImpactMetric>): Promise<string> => {
  try {
    if (isDevelopment && !db) {
      return await mockAddImpactMetric(metric);
    }
    return await prodAddImpactMetric(metric);
  } catch (error) {
    console.error('Error adding impact metric:', error);
    throw error;
  }
};

// Chat Messages
export async function addMessage(message: Omit<ChatMessage, 'id'>) {
  // Check if we're in development mode without Firebase
  if (isDevelopment && !db) {
    console.log('Development mode: Mock add message', message);
    return { id: `message-${Date.now()}` };
  }

  // Check if db is available
  if (!db) {
    console.error('Firestore is not initialized');
    throw new Error('Firestore is not initialized');
  }

  const messageData = {
    content: message.content,
    userId: message.userId,
    userName: message.userName,
    userImage: message.userImage,
    timestamp: message.timestamp,
    ...(message.challengeId && { challengeId: message.challengeId })
  };

  const messagesRef = collection(db, 'messages');
  return addDoc(messagesRef, messageData);
}

export function subscribeToMessages(callback: (messages: ChatMessage[]) => void, challengeId?: string) {
  // Check if we're in development mode without Firebase
  if (isDevelopment && !db) {
    console.log('Development mode: Mock message subscription');
    // Return empty messages array immediately
    setTimeout(() => callback([]), 100);
    // Return a no-op unsubscribe function
    return () => {};
  }

  // Check if db is available
  if (!db) {
    console.error('Firestore is not initialized');
    // Return a no-op unsubscribe function
    return () => {};
  }

  const messagesRef = collection(db, 'messages');
  const q = challengeId 
    ? query(messagesRef, where('challengeId', '==', challengeId), orderBy('timestamp', 'asc'))
    : query(messagesRef, orderBy('timestamp', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
    callback(messages);
  });
}

// Leaderboard
export const getLeaderboard = async (limitCount: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    // Check if we're in development mode without Firebase
    if (isDevelopment && !db) {
      console.log('Development mode: Mock leaderboard data');
      // Return mock leaderboard data
      return Object.values(mockUsers)
        .sort((a, b) => b.points - a.points)
        .slice(0, limitCount)
        .map(user => ({
          id: user.id,
          name: user.name || 'Anonymous User',
          image: user.image || '',
          points: user.points || 0,
          badges: user.badges.map(badge => badge.id || badge.name) || [], // Convert Badge[] to string[]
          sustainabilityScore: user.sustainabilityScore || 0
        }));
    }

    // Check if db is available
    if (!db) {
      console.error('Firestore is not initialized');
      return [];
    }

    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      orderBy('points', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Anonymous User',
        image: data.image || '',
        points: data.points || 0,
        badges: Array.isArray(data.badges) 
          ? data.badges.map((badge: any) => typeof badge === 'string' ? badge : (badge.id || badge.name))
          : [],
        sustainabilityScore: data.sustainabilityScore || 0
      } as LeaderboardEntry;
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export const addChallenge = async (challenge: Partial<Challenge>): Promise<string> => {
  try {
    if (isDevelopment && !db) {
      return await mockAddChallenge(challenge);
    }
    return await prodAddChallenge(challenge);
  } catch (error) {
    console.error('Error adding challenge:', error);
    throw error;
  }
}; 