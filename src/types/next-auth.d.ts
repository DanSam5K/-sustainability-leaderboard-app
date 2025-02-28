import 'next-auth';
import { DefaultSession } from 'next-auth';
import { Badge } from '@/types';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      points?: number;
      co2Saved?: number;
      wasteSaved?: number;
      badges?: Badge[];
      sustainabilityScore?: number;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    points?: number;
    co2Saved?: number;
    wasteSaved?: number;
    badges?: Badge[];
    sustainabilityScore?: number;
  }
} 