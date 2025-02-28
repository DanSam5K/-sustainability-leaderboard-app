export interface User {
  uid: string;
  email: string;
  name: string;
  points: number;
  badges: string[];
  sustainabilityScore: number;
  createdAt: string;
  type: 'google' | 'school' | 'email';
  schoolId?: string;
  photoURL?: string;
}

export type UserUpdate = Partial<User>;

export interface UserProfile extends User {
  rank?: number;
  totalUsers?: number;
} 