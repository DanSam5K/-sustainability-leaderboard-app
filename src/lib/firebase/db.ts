import { db } from './config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit as limitQuery,
  Timestamp,
  addDoc,
  serverTimestamp,
  onSnapshot,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';
import { User, Challenge, ImpactMetric, ChatMessage, LeaderboardEntry } from '@/types';

// User Management
export const createUser = async (userData: Partial<User>) => {
  const userRef = doc(db, 'users', userData.id!);
  await setDoc(userRef, {
    ...userData,
    points: 0,
    badges: [],
    sustainabilityScore: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() as User : null;
};

export const updateUserPoints = async (userId: string, points: number) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    points: points,
    updatedAt: serverTimestamp(),
  });
};

// Challenges
export const createChallenge = async (challengeData: Partial<Challenge>) => {
  const challengesRef = collection(db, 'challenges');
  await addDoc(challengesRef, {
    ...challengeData,
    participants: [],
    metrics: {
      totalParticipants: 0,
      completionRate: 0,
      totalImpact: 0,
    },
  });
};

export const getActiveChallenges = async (): Promise<Challenge[]> => {
  try {
    const challengesRef = collection(db, 'challenges');
    const q = query(
      challengesRef,
      where('status', '==', 'active'),
      orderBy('startDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      startDate: doc.data().startDate?.toDate?.() || new Date(doc.data().startDate),
      endDate: doc.data().endDate?.toDate?.() || new Date(doc.data().endDate),
    } as Challenge));
  } catch (error: any) {
    console.error('Error fetching challenges:', error);
    // Check if the error is due to missing index
    if (error.message?.includes('requires an index')) {
      throw new Error('Setting up database... Please try again in a few moments.');
    }
    throw error;
  }
};

// Impact Metrics
export const addImpactMetric = async (metric: Partial<ImpactMetric>) => {
  const metricsRef = collection(db, 'impact_metrics');
  await addDoc(metricsRef, {
    ...metric,
    date: serverTimestamp(),
  });
};

export const getUserImpactMetrics = async (userId: string): Promise<ImpactMetric[]> => {
  try {
    if (!userId) {
      throw new Error('User ID is required to fetch impact metrics');
    }

    const metricsRef = collection(db, 'impact_metrics');
    const q = query(
      metricsRef,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.() || new Date(doc.data().date),
    } as ImpactMetric));
  } catch (error) {
    console.error('Error fetching impact metrics:', error);
    throw error; // Re-throw to handle in the component
  }
};

// Chat Messages
export async function addMessage(message: Omit<ChatMessage, 'id'>) {
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
export const getLeaderboard = async (limit: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      orderBy('points', 'desc'),
      limitQuery(limit)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Anonymous User',
        image: data.image || '',
        points: data.points || 0,
        badges: data.badges || [],
        sustainabilityScore: data.sustainabilityScore || 0
      } as LeaderboardEntry;
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}; 