'use client';

import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getUser } from '@/lib/firebase/db';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // Get additional user data from Firestore
          const userData = await getUser(firebaseUser.uid);
          if (userData) {
            setUser({
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || '',
              email: userData.email || firebaseUser.email || '',
              image: userData.image || firebaseUser.photoURL || '',
              points: userData.points || 0,
              badges: userData.badges || [],
              sustainabilityScore: userData.sustainabilityScore || 0,
              createdAt: userData.createdAt || new Date().toISOString(),
              updatedAt: userData.updatedAt || new Date().toISOString()
            });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
} 