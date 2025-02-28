export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  points: number;
  badges: Badge[];
  sustainabilityScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  criteria: string;
  earnedAt?: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  startDate: string;
  endDate: string;
  participants: string[];
  createdBy: string;
  category: 'water' | 'energy' | 'waste' | 'transport' | 'other';
  status: 'active' | 'completed' | 'upcoming';
  metrics?: {
    totalParticipants: number;
    completionRate: number;
    totalImpact: number;
  };
}

export interface ImpactMetric {
  id: string;
  userId: string;
  category: string;
  value: number;
  date: string;
  description: string;
}

export interface ChatMessage {
  id?: string;
  content: string;
  userId: string;
  userName: string;
  userImage?: string;
  timestamp: string;
  challengeId?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  image: string;
  points: number;
  badges: string[];
  sustainabilityScore: number;
} 